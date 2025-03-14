import { contextBridge } from 'electron';
import type { Promisable } from 'type-fest';
import type { createFolderIpc } from './ipc-channels/createFolderIpc';
import type { markFeedReadIpc } from './ipc-channels/markFeedReadIpc';
import type { markFeedUnreadIpc } from './ipc-channels/markFeedUnreadIpc';
import type { moveFeedIpc } from './ipc-channels/moveFeedIpc';
import type { newFeedIpc } from './ipc-channels/newFeedIpc';
import type { refreshIpc } from './ipc-channels/refreshIpc';
import type { removeFeedIpc } from './ipc-channels/removeFeedIpc';
import type { removeFolderIpc } from './ipc-channels/removeFolder';
import type { renameFeedIpc } from './ipc-channels/renameFeedIpc';
import type { renameFolderIpc } from './ipc-channels/renameFolderIpc';
import { IpcName } from './types/IpcName';
import { invokeIpcChannel } from './utils/invokeIpcChannel';

const invoke = invokeIpcChannel;

export const ipcApi = {
  createFolder: invoke<typeof createFolderIpc>(IpcName.CreateFolder),
  markFeedRead: invoke<typeof markFeedReadIpc>(IpcName.MarkFeedRead),
  markFeedUnread: invoke<typeof markFeedUnreadIpc>(IpcName.MarkFeedUnread),
  moveFeed: invoke<typeof moveFeedIpc>(IpcName.MoveFeed),
  newFeed: invoke<typeof newFeedIpc>(IpcName.NewFeed),
  refresh: invoke<typeof refreshIpc>(IpcName.Refresh),
  removeFeed: invoke<typeof removeFeedIpc>(IpcName.RemoveFeed),
  removeFolder: invoke<typeof removeFolderIpc>(IpcName.RemoveFolder),
  renameFeed: invoke<typeof renameFeedIpc>(IpcName.RenameFeed),
  renameFolder: invoke<typeof renameFolderIpc>(IpcName.RenameFolder),
};

contextBridge.exposeInMainWorld('ipcRenderer', ipcApi);

declare global {
  interface Window {
    ipcRenderer: ExtractIpcWindow<typeof ipcApi>;
  }
}

type ExtractIpcWindow<TApi extends Record<string, any>> = {
  [K in keyof TApi]: TApi[K] extends (
    ...args: infer Params
  ) => Promisable<infer R>
    ? (...args: Params) => Promise<R>
    : never;
};
