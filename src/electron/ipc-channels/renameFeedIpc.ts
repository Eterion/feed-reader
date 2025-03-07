import type { IpcChannel } from '../types/IpcChannel';
import { IpcName } from '../types/IpcName';
import { useDb } from '../utils/useDb';

export const renameFeedIpc: IpcChannel<[feedId: string, name: string]> = {
  name: IpcName.RenameFeed,
  handler: async (_event, feedId, name) => {
    await useDb((db) => {
      const feed = db.feeds.find((feed) => feed.id === feedId);
      if (feed) {
        feed.name = name;
      } else {
        throw new Error('Feed not found.');
      }
    });
  },
};
