if (process.env.NODE_ENV === undefined) process.env.NODE_ENV = 'production'
else process.env.NODE_ENV = 'development'

const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron')
const url = require('url')
const path = require('path')
const ProgressBar = require('electron-progressbar')

let mainWindow = ''
let progressBar = ''

function createWindow() {
    mainWindow = new BrowserWindow({
        width: process.env.NODE_ENV === 'development' ? 800 : 480,
        height: 625, // 625
        show: false,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        transparent: false,
        resizable: false,
        icon: path.join(__dirname, '/app/assets/img/icon/icon.ico')
    })

    // mainWindow.loadFile('index.html')
    if (process.env.NODE_ENV === 'development') mainWindow.webContents.openDevTools()

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, '/app/view/index.html'),
            protocol: 'file:',
            slashes: true
        })
    )

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

function showProgressbar(texto) {
    if (progressBar) return

    progressBar = new ProgressBar({
        title: 'Gerador de Conexão',
        text: texto,
        detail: 'Aguarde...',
        options: {
            closeOnComplete: false
        },
        browserWindow: {
            parent: null,
            modal: true,
            resizable: false,
            closable: false,
            minimizable: false,
            maximizable: false,
            width: 320,
            height: 170,
            webPreferences: {
                nodeIntegration: true
            }
        }
    })

    progressBar.on('completed', () => {
        // progressBar.detail = 'Task completed. Exiting...'
        progressBar = null
    })
}

function setProgressbarCompleted() {
    if (progressBar) progressBar.setCompleted()
}

ipcMain.on('show-progressbar', (event, texto) => {
    showProgressbar(texto)
})

ipcMain.on('set-progressbar-completed', setProgressbarCompleted)

app.on('ready', () => {
    createWindow()
    globalShortcut.register('CommandOrControl+P', () => {
        mainWindow.webContents.openDevTools()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (mainWindow === null) createWindow()
})
