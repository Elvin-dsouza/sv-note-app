<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    export let title;
    export let id;
    let checked;
    export let state;

    function saveNewItem() {
        console.log("saved");
        state = "pending";
        dispatch("todoStateChange", { id, state, title})
    }

    function onCheckboxChecked(e){
        checked = e.target.checked;
        dispatch("todoStateChange", { id, state: checked ? "complete": "pending", title })
    }

    function toggleEditMode(e) {
        state = state == "pending" ? "edit": "pending";
    }

    function removeItem(e) {
        dispatch("removeItem", id);
    }

    $: isComplete = checked || state == "complete"; 
    $: isNewItem =  state == "edit"; 
</script>

{@debug isComplete}
<div class="card">
    <input type="checkbox" checked={isComplete} on:change={onCheckboxChecked} disabled={state == "edit"} />
    {#if !isNewItem}
        <h1 class={isComplete ? "strike": ""}>{title}</h1>
    {:else}
    <form on:submit|preventDefault={saveNewItem}>
        <input type="text" placeholder="Enter a title, press Enter to save" bind:value={title}/>
        <input type="submit" class="hide">
    </form>
    {/if}
    {#if !isNewItem}
        <button on:click|once={toggleEditMode} class="edit">e</button>
    {/if}
    <button on:click={removeItem} class="delete">x</button>
</div>

<style>
    .card {
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.199);
        border-radius:5px;
        padding:10px;
        background:rgb(37, 37, 37);
        margin-bottom:10px;
        font-family:'Consolas';
        display:flex;
        align-items: center;
    }

    .card:hover > button {
        display:block;
    }

    h1 {
        font-weight: 150;
        color:rgb(181, 181, 182);
        margin-left:10px;
        font-size:1em;
        flex:9;
    }
    input[type="checkbox"] {
        width:25px;
        height:25px;
        background: lightslategray;
    }
    input[type="text"]::-webkit-input-placeholder { 
      font-family: 'Consolas';
    }
    
    input[type="text"]:-moz-placeholder { 
      font-family: 'Consolas', Arial, Helvetica, sans-serif;
    }
    input[type="text"] {
        background: transparent;
        border:0px;
        font-family: 'Consolas', Arial, Helvetica, sans-serif;
        border-bottom:1px solid lightsteelblue;
        font-size:1em;
        padding:5px;
        color: rgb(181, 181, 182);
        outline: none;
        margin-left:5px;
        width:40%;
        
    }

    input[type="checkbox"]:hover {
        color:blue;
    }

    .strike {
        text-decoration: line-through;
    }

    .hide {
        display: none;
    }

    form {
        flex:9
    }

    button {
        color:rgb(181, 181, 182);
        border:0;
        outline: none;
        font-size:1.2em;
        background:transparent;
        justify-self: flex-end;
        display:none;
        cursor: pointer;
        transform: color 0.5s;
    }

    button.delete:hover {
        color:red;
    }
    button.edit:hover {
        color:cyan;
    }
    

</style>