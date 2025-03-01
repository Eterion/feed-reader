import { ipcRenderer } from 'electron';
import type { IpcChannel } from '../types/IpcChannel';
import type { IpcName } from '../types/IpcName';

export function invokeIpcChannel<TChannel extends IpcChannel<any[], any>>(
  ipcName: IpcName,
): (
  ...params: ExtractIpcChannelParams<TChannel>
) => Promise<ExtractIpcChannelReturn<TChannel>> {
  return (...params: ExtractIpcChannelParams<TChannel>) => {
    return ipcRenderer.invoke(ipcName, ...params);
  };
}

type ExtractIpcChannelParams<T extends IpcChannel> =
  T extends IpcChannel<infer Params, any> ? Params : never;

type ExtractIpcChannelReturn<T extends IpcChannel> =
  T extends IpcChannel<any[], infer Return> ? Return : never;
