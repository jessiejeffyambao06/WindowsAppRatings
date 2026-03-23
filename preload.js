const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    saveRating: (data) => ipcRenderer.send('save-rating', data)
});