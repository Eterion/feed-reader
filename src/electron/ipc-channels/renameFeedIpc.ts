import type { IpcChannel } from '../types/IpcChannel';
import { IpcName } from '../types/IpcName';
import { useDb } from '../utils/useDb';

export const renameFeedIpc: IpcChannel<[feedUrl: string, name: string]> = {
  name: IpcName.RenameFeed,
  handler: async (_event, feedUrl, name) => {
    await useDb((db) => {
      const feed = db.feeds.find((feed) => feed.url === feedUrl);
      if (feed) {
        feed.name = name;
      } else {
        throw new Error('Feed not found.');
      }
    });
  },
};
