import type { IpcChannel } from '../types/IpcChannel';
import { IpcName } from '../types/IpcName';
import { readDb, writeDb } from '../utils/readAndWriteDb';

export const renameFolderIpc: IpcChannel<[folderId: number, name: string]> = {
  name: IpcName.RenameFolder,
  handler: async (_event, folderId, name) => {
    const db = await readDb();
    const folder = db.folders.find((folder) => folder.id === folderId);
    if (folder) {
      folder.name = name;
      await writeDb(db);
    } else {
      throw Error('Folder not found.');
    }
  },
};
