import { remove } from 'es-toolkit';
import type { IpcChannel } from '../types/IpcChannel';
import { IpcName } from '../types/IpcName';
import { useDb } from '../utils/useDb';

export const removeFeedIpc: IpcChannel<[feedId: string]> = {
  name: IpcName.RemoveFeed,
  handler: async (_event, feedId) => {
    await useDb((db) => {
      if (db.feeds.some((feed) => feed.id === feedId)) {
        remove(db.feeds, (feed) => feed.id === feedId);
        remove(db.articles, (article) => article.feedId === feedId);
      } else {
        throw new Error('Feed not found.');
      }
    });
  },
};
