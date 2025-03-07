import type { IpcChannel } from '../types/IpcChannel';
import { IpcName } from '../types/IpcName';
import { useDb } from '../utils/useDb';

export const renameFolderIpc: IpcChannel<[folderId: number, name: string]> = {
  name: IpcName.RenameFolder,
  handler: async (_event, folderId, name) => {
    await useDb((db) => {
      const folder = db.folders.find((folder) => folder.id === folderId);
      if (folder) {
        folder.name = name;
      } else {
        throw Error('Folder not found.');
      }
    });
  },
};
