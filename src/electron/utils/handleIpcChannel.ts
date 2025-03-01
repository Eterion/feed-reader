import { ipcMain } from 'electron';
import type { IpcChannel } from '../types/IpcChannel';

export function handleIpcChannel<TParams extends any[], TReturn>(
  ipcChannel: IpcChannel<TParams, TReturn>,
) {
  ipcMain.handle(ipcChannel.name, ipcChannel.handler);
}
