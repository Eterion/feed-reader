import { BrowserWindow, nativeImage, shell } from 'electron';
import { resolve } from 'node:path';

export let win: BrowserWindow | undefined;

export function createWindow() {
  win = new BrowserWindow({
    height: 1080,
    icon: nativeImage.createFromPath('src/assets/rss.png'),
    width: 1920,
    webPreferences: {
      preload: resolve('dist-electron/preload.mjs'),
    },
  });

  win.removeMenu();

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile('dist/index.html');
  }

  return win;
}
