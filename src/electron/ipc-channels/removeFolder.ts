import { getFolderFeeds } from '@/utils/getFolderFeeds';
import { getFolderFolders } from '@/utils/getFolderFolders';
import { remove } from 'es-toolkit';
import type { IpcChannel } from '../types/IpcChannel';
import { IpcName } from '../types/IpcName';
import { readDb, writeDb } from '../utils/readAndWriteDb';

export const removeFolderIpc: IpcChannel<[folderId: number]> = {
  name: IpcName.RemoveFolder,
  handler: async (_event, folderId) => {
    const db = await readDb();
    // Remove all child feeds and articles
    const feeds = getFolderFeeds(folderId, db);
    const feedIds = feeds.map((feed) => feed.id);
    remove(db.feeds, (feed) => feedIds.includes(feed.id));
    remove(db.articles, (article) => feedIds.includes(article.feedId));
    // Remove folder and child folders
    const folders = getFolderFolders(folderId, db);
    const folderIds = folders.map((folder) => folder.id).concat(folderId);
    remove(db.folders, (folder) => folderIds.includes(folder.id));
    await writeDb(db);
  },
};
