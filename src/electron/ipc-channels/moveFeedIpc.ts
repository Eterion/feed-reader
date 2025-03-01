import { isNotNil } from 'es-toolkit';
import type { IpcChannel } from '../types/IpcChannel';
import { IpcName } from '../types/IpcName';
import { readDb, writeDb } from '../utils/readAndWriteDb';

export const moveFeedIpc: IpcChannel<[{ feedId: string; parentId?: number }]> =
  {
    name: IpcName.MoveFeed,
    handler: async (_event, { feedId, parentId }) => {
      const db = await readDb();
      const feed = db.feeds.find((feed) => feed.id === feedId);
      if (feed) {
        if (isNotNil(parentId)) feed.parentId = parentId;
        else delete feed.parentId;
        await writeDb(db);
      } else {
        throw new Error("Feed doesn't exist.");
      }
    },
  };
