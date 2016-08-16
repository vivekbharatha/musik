const electron = require('electron');
const app = electron.app;

const BrowserWindow = electron.BrowserWindow;

var mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width: 1280, height: 720, frame: false});

  mainWindow.loadURL('file:// ' + __dirname + '/app/index.html');
  if(process.env.ENV !== 'production') mainWindow.webContents.openDevTools();
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}
app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});