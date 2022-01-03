const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
var fs = require('fs'); 


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}
let mainWindow;
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      worldSafeExecuteJavaScript: true,
      preload: __dirname + '\\preload.js'
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
  awaitWriteFinish: true,
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.on('requestTodo', (event, arg) => {
  fs.appendFile('todo.json', '', (err) => {
    if (err) throw err;
    fs.readFile('todo.json',(err ,data)=>{
      if(err) throw err;
      mainWindow.webContents.send('retrieveTodo', JSON.parse(data.length ? data : "[]"));
    });
  });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.on('requestUpdate', (event, arg) => {
  fs.writeFile('todo.json', JSON.stringify(arg) , (err) => {
    if (err) throw err;
  });
});

ipcMain.on('requestNotesList', (event, arg) => {
  const homedir = require('os').homedir();
  fs.readdir(path.resolve(homedir, "Documents"), function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    mainWindow.webContents.send('retrieveNotesList', files.filter(file => /.md/g.test(file)));
  });
});

ipcMain.on('requestNote', (event, arg) => {
  const homedir = require('os').homedir();
  fs.readFile(path.resolve(homedir, "Documents", arg),(err ,data)=>{
    if(err) throw err;
    console.log(data);
    mainWindow.webContents.send('retrieveNote', data.toString());
  });
});

ipcMain.on('updateFile', (event, arg) => {
  const homedir = require('os').homedir();
  fs.writeFile(path.resolve(homedir, "Documents", arg.filename), arg.source , (err) => {
    if (err) throw err;
  });
});