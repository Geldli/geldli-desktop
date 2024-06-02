
const { app, shell, protocol, BrowserWindow, dialog } = require('electron');
const path = require('path');

let mainWindow;

if(process.defaultApp) {
  if(process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('geldli-desktop', process.execPath, [path.resolve(process.argv[1])]);
  } else {
    app.setAsDefaultProtocolClient('geldli-desktop');
  }
}


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  mainWindow.loadFile('waitLogin.html');
  
}


// Windows
const gotTheLock = app.requestSingleInstanceLock();

if(!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if(mainWindow) {
      if(mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  })
}


// Unix
app.on('open-url', (e, url) => {
  if(url === 'geldli-desktop://loginSuccessfull');
  dialog.showErrorBox('Welcome back', `You arrived from [${url}]`)
  mainWindow.loadURL('http://localhost:3000');
})


app.whenReady()
  .then(() => {

    createWindow();
    shell.openExternal(path.join('file:///', __dirname, 'index.html'));

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })  




app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
