import { app, BrowserWindow, shell } from 'electron';
import { resolve } from 'node:path';
import { createFolderIpc } from './ipc-channels/createFolderIpc';
import { markFeedReadIpc } from './ipc-channels/markFeedReadIpc';
import { markFeedUnreadIpc } from './ipc-channels/markFeedUnreadIpc';
import { moveFeedIpc } from './ipc-channels/moveFeedIpc';
import { newFeedIpc } from './ipc-channels/newFeedIpc';
import { refreshIpc } from './ipc-channels/refreshIpc';
import { removeFeedIpc } from './ipc-channels/removeFeedIpc';
import { renameFeedIpc } from './ipc-channels/renameFeedIpc';
import { handleIpcChannel } from './utils/handleIpcChannel';

function createWindow() {
  const win = new BrowserWindow({
    height: 1080,
    width: 1920,
    webPreferences: {
      preload: resolve('dist-electron/preload.mjs'),
    },
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile('dist/index.html');
  }
}

handleIpcChannel(createFolderIpc);
handleIpcChannel(markFeedReadIpc);
handleIpcChannel(markFeedUnreadIpc);
handleIpcChannel(moveFeedIpc);
handleIpcChannel(newFeedIpc);
handleIpcChannel(refreshIpc);
handleIpcChannel(removeFeedIpc);
handleIpcChannel(renameFeedIpc);

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
