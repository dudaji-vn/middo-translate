const { app, screen, BrowserWindow } = require('electron')

const createMain = () => {
    const win = new BrowserWindow({
    })
    win.loadFile('index.html')
    return win
}

const createCanvas = (parent) => {
    const win = new BrowserWindow({
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        show: false,
    })
    win.setParentWindow(parent)
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
    win.setIgnoreMouseEvents(true, { forward: true })
    win.setBackgroundColor('#00000001')
    win.loadFile('canvas.html')
    win.maximize()
    win.show()
}

const createWindow = () => {
    const parent = createMain()
    createCanvas(parent)
}

app.whenReady().then(() => {
    createWindow()
})
