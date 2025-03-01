import type { IpcChannel } from '../types/IpcChannel';
import { IpcName } from '../types/IpcName';
import { readDb, writeDb } from '../utils/readAndWriteDb';

export const removeFeedIpc: IpcChannel<[feedId: string]> = {
  name: IpcName.RemoveFeed,
  handler: async (_event, feedId) => {
    const db = await readDb();
    if (db.feeds.some((feed) => feed.id === feedId)) {
      db.feeds = db.feeds.filter((feed) => {
        return feed.id !== feedId;
      });
      db.articles = db.articles.filter((article) => {
        return article.feedId !== feedId;
      });
      await writeDb(db);
    } else {
      throw new Error('Feed not found.');
    }
  },
};
