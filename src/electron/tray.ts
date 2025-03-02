import { app, Menu, MenuItem, nativeImage, Tray } from 'electron';
import { win } from './win';

export let tray: Tray | undefined;
const appName = app.getName();
const defaultIcon = nativeImage.createFromPath('src/assets/rss.png');
const unreadIcon = nativeImage.createFromPath('src/assets/rss-unread.png');

export function createTray({
  onExit,
}: {
  onExit: ConstructorParameters<typeof MenuItem>[0]['click'];
}) {
  tray = new Tray(defaultIcon);
  tray.setTitle(appName);
  tray.setToolTip(appName);
  const menu = new Menu();
  menu.append(new MenuItem({ label: appName, enabled: false }));
  menu.append(new MenuItem({ label: 'Open', click: openWindow }));
  menu.append(new MenuItem({ label: 'Quit', click: onExit }));
  tray.setContextMenu(menu);
  tray.on('click', openWindow);
  return tray;
}

export function updateTrayIcon({ unreadCount }: { unreadCount: number }) {
  tray?.setImage(unreadCount ? unreadIcon : defaultIcon);
}

function openWindow() {
  if (!win?.isVisible()) {
    win?.show();
  }
}
