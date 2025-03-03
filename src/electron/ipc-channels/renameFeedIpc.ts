import type { IpcChannel } from '../types/IpcChannel';
import { IpcName } from '../types/IpcName';
import { readDb, writeDb } from '../utils/readAndWriteDb';

export const renameFeedIpc: IpcChannel<[feedId: string, name: string]> = {
  name: IpcName.RenameFeed,
  handler: async (_event, feedId, name) => {
    const db = await readDb();
    const feed = db.feeds.find((feed) => feed.id === feedId);
    if (feed) {
      feed.name = name;
      await writeDb(db);
    } else {
      throw new Error('Feed not found.');
    }
  },
};
