const { contextBridge, ipcRenderer } = require('electron');

// are we in electron? only available in node context
//export const isElectron = process.versions.hasOwnProperty('electron');

// expose electron functions globally through contextBridge
contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => {
        // whitelist channels
        let validChannels = ["requestTodo", "requestUpdate", "requestNotesList", "requestNote", "updateFile"];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        let validChannels = ["retrieveTodo", "retrieveNotesList", "retrieveNote"];
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender` 
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
});