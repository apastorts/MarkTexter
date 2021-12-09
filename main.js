const { app, BrowserWindow, Menu, globalShortcut, dialog } = require('electron');

const path = require('path');

function createWindow (){
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        transparent:false,
        icon: __dirname + '/MarkTexter.png',
        vibrancy: 'ultra-dark',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    const menu = Menu.buildFromTemplate([
        {
          label: 'File',
          submenu: [
            {
               label:'Open File',
               accelerator: 'CmdOrCtrl+O',
               click() {
                  dialog.showOpenDialog({
                    properties: ['openFile'],
                    filters:[
                        { name: 'Markdown', extensions: ['md'] }
                    ]
                  })
                  .then(function(fileObj) {
                     if (!fileObj.canceled) {
                       win.webContents.send('FILE_OPEN', fileObj)
                     }
                  })
                  .catch(function(err) {
                     console.error(err)  
                  })
               } 
           },
           {
                label: "Edit",
                submenu: [
                    { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
                    { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
                    { type: "separator" },
                    { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
                    { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
                    { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
                    { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
                ]
            },
           {
                label:'Save File',
                accelerator: 'CmdOrCtrl+S',
                click() {
                dialog.showSaveDialog({
                    properties: ['saveFile'],
                    filters:[
                        { name: 'Markdown', extensions: ['md'] }
                    ]
                })
                .then(function(fileObj) {
                    if (!fileObj.canceled) {
                        win.webContents.send('FILE_SAVE', fileObj)
                    }
                })
                .catch(function(err) {
                    console.error(err)  
                })
                } 
            },
            {
                label: 'Export',
                submenu: [
                    {
                        label:'Export to PDF',
                        accelerator: 'CmdOrCtrl+E',
                        click() {
                            win.webContents.send('FILE_PDF', true)
                        }
                    }
                ]
            },
           {
               label:'Quit',
               click() {
                  app.quit()
               } 
             }
          ]
        }
      ])
      Menu.setApplicationMenu(menu)

    globalShortcut.register("CmdOrCtrl+F12", () => {
        win.isFocused() && win.webContents.toggleDevTools();
    });

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})