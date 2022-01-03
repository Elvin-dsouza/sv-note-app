<script>
    import TodoCard from "./TodoCard.svelte";
    import { createEventDispatcher } from 'svelte';
    import { onMount } from "svelte";

    //props
    export let todoItems = [];

    window.ipcRenderer.receive("retrieveTodo", (itemResponse) => {
            todoItems = itemResponse;
            console.log(todoItems);
    });

    function updateTodoList(detail) {
        window.ipcRenderer.send('requestUpdate', detail.map((item)=> {
            return item;
        }));
    }

    onMount(async () => {
        window.ipcRenderer.send('requestTodo', '');
    })

  

    const dispatch = createEventDispatcher();

    // event handlers
    function onTodoStateChanged({ detail: { id, state, title } }){
        todoItems.filter((item) => item && item.id === id)[0].state = state;
        todoItems.filter((item) => item && item.id === id)[0].title = title;
        todoItems = [...todoItems];
        updateTodoList(todoItems);
    }

    function addNewPendingItem(e) {
        todoItems = [{
                id: todoItems.length + 1,
                state: "edit"
            },
            ...todoItems
        ]
    }

    function onRemoveItem({detail: id}) {
        console.log(id);
        todoItems = todoItems.map((item) => {
            if(item && item.id === id) {
                return null;
            }
            return item;
        });
        updateTodoList(todoItems);
    }

    // compute derived state.
    $: pendingItems = todoItems.filter(item => item).filter(item => item.state === "pending" || item.state === "edit");
    $: completeItems = todoItems.filter(item => item).filter(item => item.state === "complete");
    $: pendingCount = pendingItems.filter(item => item).length;
    $: completeCount = completeItems.filter(item => item).length;

</script>
{@debug todoItems}
<div class="container">
    <!-- Pending Items -->
    <details open={pendingCount}>
        <summary>Pending ({pendingCount}) <button on:click={addNewPendingItem}>+</button></summary>
        {#each pendingItems as item (item.id)}
            <TodoCard {...item} on:todoStateChange={onTodoStateChanged}  on:removeItem={onRemoveItem}/>
        {/each}
    </details>

    <!-- Completed Items -->
    <details open={completeCount} class={!completeCount ? "disabled": ""}>
        <summary>Completed ({completeCount})</summary>
        {#each completeItems as item (item.id)}
            <TodoCard {...item} on:todoStateChange={onTodoStateChanged} on:removeItem={onRemoveItem} />
        {/each}
    </details>
</div>


<style>
    details {
        font-size:1.2em;
        color:rgb(181, 181, 182);
        outline:none;
    }


    details.disabled summary {
        pointer-events: none;
        color:lightslategray;
    }

    button {
        background:transparent;
        outline: none;
        border:0px;
        color:rgb(181, 181, 182);
        cursor: pointer;
        font-size:1.2em;
    }

    button:hover {
        background:transparent;
        color:rgb(187, 187, 218);
    }

    .container {
        display:flex;
        flex-flow:column;
        margin-left: 40px;
        flex:1;
        height:inherit;
        overflow-y: scroll;
    }
</style>
