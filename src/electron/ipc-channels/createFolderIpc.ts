import type { Folder } from '@/types/Folder';
import { isNotNil } from 'es-toolkit';
import type { IpcChannel } from '../types/IpcChannel';
import { IpcName } from '../types/IpcName';
import { generateFolderId } from '../utils/generateFolderId';
import { readDb, writeDb } from '../utils/readAndWriteDb';

export const createFolderIpc: IpcChannel<
  [{ name: string; parentId?: number }],
  Folder
> = {
  name: IpcName.CreateFolder,
  handler: async (_event, { name, parentId }) => {
    const db = await readDb();
    const folder: Folder = {
      id: await generateFolderId(),
      name: name,
      ...(isNotNil(parentId) && { parentId }),
    };
    db.folders.push(folder);
    await writeDb(db);
    return folder;
  },
};
