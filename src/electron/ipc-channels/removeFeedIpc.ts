import { remove } from 'es-toolkit';
import type { IpcChannel } from '../types/IpcChannel';
import { IpcName } from '../types/IpcName';
import { readDb, writeDb } from '../utils/readAndWriteDb';

export const removeFeedIpc: IpcChannel<[feedId: string]> = {
  name: IpcName.RemoveFeed,
  handler: async (_event, feedId) => {
    const db = await readDb();
    if (db.feeds.some((feed) => feed.id === feedId)) {
      remove(db.feeds, (feed) => feed.id === feedId);
      remove(db.articles, (article) => article.feedId === feedId);
      await writeDb(db);
    } else {
      throw new Error('Feed not found.');
    }
  },
};
