
const { app, BrowserWindow, shell, ipcMain, Menu, dialog } = require('electron');
const path = require('node:path');
const { title } = require('node:process');

let loggedIn = false;

const usersData = [
  {
    username: 'Jbernardis',
    email: 'joaobernardiss@gmail',
    password: '123456',
  },
  {
    username: 'nenao',
    email: 'nenao@gmail.com',
    password: 'nenao'
  }
]

const getUserDataByUsername = (username) => {

  for(const user of usersData) {
    if(user.username === username) {
      return user;
    }
  }

  return undefined;
}

const getUserDataByEmail = (useremail) => {

  for(const user of usersData) {
    if(user.email === useremail) {
      return user;
    }
  }

  return undefined;
}

const getUserData = (userIdent) => {

  let user = undefined;

  user = getUserDataByUsername(userIdent);
  if(user !== undefined) {
    return user;
  }

  user = getUserDataByEmail(userIdent);
  if(user !== undefined) {
    return user;
  }

  return user;
}

const login = (userIdent, password) => {

  let user;

  user = getUserData(userIdent);
  if(user !== undefined) {
    if(user.password === password) {
      loggedIn = true;
      return true;
    }
  }

  dialog.showErrorBox('Falha no login', 'Os dados de login estão incorretos.');

  return false;
}

const createNewWindow = () => {
  const win = new BrowserWindow({
    width: 1450,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    }
  });

  if(!loggedIn) {
    win.loadFile('./pages/login.html');
  }
  else {
    win.loadFile('./pages/home.html');
  }
}

const openWindowExternally = (url) => {

  shell.openExternal(url);
}

app.whenReady().then(() => {

  ipcMain.on('openExternalUrl', (event, url) => openWindowExternally(url));

  ipcMain.handle('tryLogin', (event, userIdent, password) => {
    login(userIdent, password);
    if(loggedIn) {
      createNewWindow();
    }

    return loggedIn;
  });

  createNewWindow();

  app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) {
      createNewWindow();
    }
  })
});
