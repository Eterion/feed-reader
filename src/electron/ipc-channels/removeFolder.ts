import { remove } from 'es-toolkit';
import type { IpcChannel } from '../types/IpcChannel';
import { IpcName } from '../types/IpcName';
import { readDb, writeDb } from '../utils/readAndWriteDb';

export const removeFolderIpc: IpcChannel<[folderId: number]> = {
  name: IpcName.RemoveFolder,
  handler: async (_event, folderId) => {
    const db = await readDb();
    remove(db.folders, (folder) => folder.id === folderId);
    await writeDb(db);
  },
};
