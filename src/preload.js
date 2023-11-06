
const { contextBridge, ipcRenderer, dialog } = require('electron')

contextBridge.exposeInMainWorld('extern', {
  openPageExternally: (url) => ipcRenderer.send('openExternalUrl', url),
  loggedIn: () => ipcRenderer.send('')
})

contextBridge.exposeInMainWorld('currentSession', {
  login: async (username, password) => await ipcRenderer.invoke('tryLogin', username, password),
  // wrongLoginDialog: () => dialog.showErrorBox('Dados Incorretos', 'Os dados de login inseridos estão incorretos.'),
})
