const { app, screen, BrowserWindow } = require('electron')

const createWindow = () => {
    const mainScreen = screen.getPrimaryDisplay()

    const win = new BrowserWindow({
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        show: false,
    })
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
    win.setIgnoreMouseEvents(true, { forward: true })

    win.loadFile('index.html')
    win.maximize()
    win.show()
}

app.whenReady().then(() => {
    createWindow()
})
