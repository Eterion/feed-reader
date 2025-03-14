import type { Folder } from '@/types/Folder';
import { isNotNil } from 'es-toolkit';
import type { IpcChannel } from '../types/IpcChannel';
import { IpcName } from '../types/IpcName';
import { generateFolderId } from '../utils/generateFolderId';
import { useDb } from '../utils/useDb';

export const createFolderIpc: IpcChannel<
  [name: string, parentId?: number],
  Folder
> = {
  name: IpcName.CreateFolder,
  handler: async (_event, name, parentId) => {
    return await useDb(async (db) => {
      const folder: Folder = {
        id: await generateFolderId(),
        name,
        ...(isNotNil(parentId) && { parentId }),
      };
      db.folders.push(folder);
      return folder;
    });
  },
};
