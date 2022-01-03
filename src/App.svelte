<script>
    import TodoList from "./TodoList/TodoList.svelte";
    import Notebook from "./Notes/Notebook.svelte";
    let notebookAppSelected = true;
    function selectNotebookApp() {
        notebookAppSelected = true;
    }

    function selectTodoApp() {
        notebookAppSelected = false;
    }
</script>
<main>
    <!-- <header>
        <div class="container">
            <h1>Svelte Todo</h1>
        </div>
    </header> -->
    <!-- <div class="container pad-top">
        <TodoList/>
        
    </div> -->
    <nav>
        <div class={notebookAppSelected ? "selected": "" } on:click={selectNotebookApp}>🗊</div>
        <div class={notebookAppSelected ? "": "selected" } on:click={selectTodoApp}>✔</div>
    </nav>
    {#if notebookAppSelected}
        <Notebook />
    {:else}
        <TodoList />
    {/if}
</main>
<style>
    main {
        display:flex;
        flex-flow:row;
        height:100vh;
    }

    nav {
        max-width:10vw;
        background:thistle;
        box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.199);
    }

    nav > div {
        padding:20px;
        transition: all 1s;
        cursor:pointer;
    }

    nav > div:hover {
        background:rgba(0,0,0,0.5);
        color:white;
    }

    .selected {
        background: #01579B;
        color:white;
    }
</style>
