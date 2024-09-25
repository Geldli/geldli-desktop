
const { app, shell, protocol, BrowserWindow, dialog, session } = require('electron');
const path = require('path');

let mainWindow;


if(process.defaultApp) {
  if(process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('geldli-desktop', process.execPath, [path.resolve(process.argv[1])]);
  } else {
    app.setAsDefaultProtocolClient('geldli-desktop');
  }
}

const gotTheLock = app.requestSingleInstanceLock();
// Windows
if(!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if(mainWindow) {
      if(mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }


    dialog.showErrorBox('Welcome back', `You arrived from [${commandLine.pop()}]`)
    mainWindow.loadURL('http://localhost:3000');
  })
}

// Unix
app.on('open-url', (e, url) => {

  let expirationDay = (new Date().getDate() + 15);
  const expirationDate = new Date()
  expirationDate.setDate(expirationDay)


  const queryParamsStrings = url
    .split('//')[1]
    .split('&')

  
  const queryParams = {};
  queryParamsStrings.forEach((queryParamString) => {

    const splitQueryParam = queryParamString.split('=');
    queryParams[splitQueryParam[0]] = splitQueryParam[1];

  })

  const authToken = queryParams['authToken'];

  session.defaultSession.cookies.set({
    url: 'http://localhost:3000',
    name: 'authToken',
    value: authToken,
    domain: 'localhost',
    secure: false, // TODO change on production
    httpOnly: true,
    expirationDate: expirationDate
  })

  mainWindow.loadURL('http://localhost:3000');
})


function createWindowFromUrl(initialContent) {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  mainWindow.loadURL(initialContent);
}


function isAuthCookieSet() {

  return session.defaultSession.cookies.get({ name: 'authToken' })
    .then(res => {
      if(res.length === 0) {
        return false;
      } else {
        return true;
      }
    })
}

function openAppWindow() {
  isAuthCookieSet()
      .then((cookieSet) => {
        if(cookieSet) {
          createWindowFromUrl('http://localhost:3000');
        } else {
          shell.openExternal('http://localhost:8000/desktopLogin');
          createWindowFromUrl('http://localhost:8000/waitLogin')
        }
      })
}

app.whenReady()
  .then(() => {

    openAppWindow();


    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        openAppWindow()
      }
    })
  })  



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
