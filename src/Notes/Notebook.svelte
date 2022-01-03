<script>
    import {marked} from 'marked';
    import { onMount } from "svelte";
    import debounce from 'lodash.debounce';
    let showPreview = true;
    let selectedFileName = "";
    let notes = [];
    let source = "";
    $: markdown = marked.parse(source);

    window.ipcRenderer.receive("retrieveNotesList", (resNotes) => {
            notes = resNotes.map((note, idx) => ({isSelected: idx === 0, title: note}));
            if(notes.length) {
                window.ipcRenderer.send('requestNote', notes[0].title);
            }
            console.log(notes);
    });

    window.ipcRenderer.receive("retrieveNote", (res) => {
            console.log(res);
           source = res;
    });

    onMount(async () => {
        window.ipcRenderer.send('requestNotesList', '');
    });

    function loadNote(filename) {
        console.log(filename);
        notes = notes.map((note) => ({
            title: note.title,
            isSelected: false
        }));
        notes.filter((note) => note.title === filename)[0].isSelected = true;
        notes = [...notes];
        selectedFileName = filename;
        window.ipcRenderer.send('requestNote', filename);
    }

    function togglePreview() {
        showPreview = !showPreview;
    }
    
    function writeFile(e) {
        window.ipcRenderer.send('updateFile', {filename: selectedFileName, source});
        console.log(source);
    }
</script>


<div class="container">
    <div class="preview-overlay" on:click={togglePreview}>{showPreview ? "✎ Edit" : "👁 view"}</div>
    <aside>
        {#each notes as note (note.title)}
            <div class={note.isSelected ? "note-item selected" : "note-item"} on:click={(e) => loadNote(note.title)} >{note.title}</div>
        {/each}
    </aside>
    {#if !showPreview}
        <div class="textarea">
            <textarea  bind:value={source} on:input={debounce(writeFile, 1000)} />
        </div>
    {:else}
        <article class={showPreview ? "markdown" : "hidden"}>{@html markdown}</article>
    {/if}
</div>
<style>
    aside {
        width:20vw;
        flex:1;
        background:#263238;
    }
    .container {
        display: flex;
        height:100vh;
        flex:1;
    }
    .textarea {
        flex:4;
        display:flex;
        position: relative;
    }
    textarea {
        width:100%;
        height:100;
        margin:0px;
        display: block;
        /* border-radius:5px; */
        box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.199);
        
        background:#212121;
        color:lightcyan;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        outline: none;
        font-size:1rem;
        padding-left:10px;
        border:0px;
        resize: none;
        line-height: 1.2em;
    }
    
    article {
        flex:4;
        /* border:1px solid white; */
        /* margin:10px; */
        margin-top:0px;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        padding:10px;
        border-radius:5px;
        box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.199);
        background:#37474F;
        overflow-y: scroll;
    }
    .preview-overlay {
        position: fixed;
        top:15px;
        right:35px;
        background:rgba(0,0,0,0.8);
        border-radius:5%;
        padding:10px;
        color:white;
        cursor: pointer;
        z-index: 99999;
    }

    .preview-overlay:hover {
        background:rgba(73, 73, 73, 0.6);
    }
    .hidden {
        display:none;
    }

    .note-item {
        background:rgba(73, 73, 73, 0.6);
        /* border-radius:5px; */
        color:silver;
        padding:5px;
        cursor:pointer;
    }

    .note-item:hover {
        background: slategray;
    }

    .selected {
        background:thistle;
        color:black;
    }

   
</style>