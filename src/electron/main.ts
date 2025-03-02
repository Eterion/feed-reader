import { app, BrowserWindow } from 'electron';
import { createFolderIpc } from './ipc-channels/createFolderIpc';
import { markFeedReadIpc } from './ipc-channels/markFeedReadIpc';
import { markFeedUnreadIpc } from './ipc-channels/markFeedUnreadIpc';
import { moveFeedIpc } from './ipc-channels/moveFeedIpc';
import { newFeedIpc } from './ipc-channels/newFeedIpc';
import { refreshIpc } from './ipc-channels/refreshIpc';
import { removeFeedIpc } from './ipc-channels/removeFeedIpc';
import { removeFolderIpc } from './ipc-channels/removeFolder';
import { renameFeedIpc } from './ipc-channels/renameFeedIpc';
import { handleIpcChannel } from './utils/handleIpcChannel';
import { createWindow } from './win';

handleIpcChannel(createFolderIpc);
handleIpcChannel(markFeedReadIpc);
handleIpcChannel(markFeedUnreadIpc);
handleIpcChannel(moveFeedIpc);
handleIpcChannel(newFeedIpc);
handleIpcChannel(refreshIpc);
handleIpcChannel(removeFeedIpc);
handleIpcChannel(removeFolderIpc);
handleIpcChannel(renameFeedIpc);

app.whenReady().then(() => {
  createWindow();
  // createTray({ onExit: () => app.quit() });
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
