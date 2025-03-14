import { remove } from 'es-toolkit';
import type { IpcChannel } from '../types/IpcChannel';
import { IpcName } from '../types/IpcName';
import { useDb } from '../utils/useDb';

export const removeFeedIpc: IpcChannel<[feedUrl: string]> = {
  name: IpcName.RemoveFeed,
  handler: async (_event, feedUrl) => {
    await useDb((db) => {
      if (db.feeds.some((feed) => feed.url === feedUrl)) {
        remove(db.feeds, (feed) => feed.url === feedUrl);
        remove(db.articles, (article) => article.feedUrl === feedUrl);
      } else {
        throw new Error('Feed not found.');
      }
    });
  },
};
