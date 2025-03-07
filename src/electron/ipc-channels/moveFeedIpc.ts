import { isNotNil } from 'es-toolkit';
import type { IpcChannel } from '../types/IpcChannel';
import { IpcName } from '../types/IpcName';
import { useDb } from '../utils/useDb';

export const moveFeedIpc: IpcChannel<[feedId: string, parentId?: number]> = {
  name: IpcName.MoveFeed,
  handler: async (_event, feedId, parentId) => {
    await useDb((db) => {
      const feed = db.feeds.find((feed) => feed.id === feedId);
      if (feed) {
        if (isNotNil(parentId)) feed.parentId = parentId;
        else delete feed.parentId;
      } else {
        throw new Error("Feed doesn't exist.");
      }
    });
  },
};
