import type { IpcMainInvokeEvent } from 'electron';
import type { Promisable } from 'type-fest';
import type { IpcName } from './IpcName';

export interface IpcChannel<TParams extends any[] = any[], TReturn = void> {
  name: IpcName;
  handler: (
    event: IpcMainInvokeEvent,
    ...params: TParams
  ) => Promisable<TReturn>;
}
