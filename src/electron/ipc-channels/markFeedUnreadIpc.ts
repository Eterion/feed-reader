import type { IpcChannel } from '../types/IpcChannel';
import { IpcName } from '../types/IpcName';
import { readDb, writeDb } from '../utils/readAndWriteDb';

export const markFeedUnreadIpc: IpcChannel<
  [{ feedId: string; link: string }[]]
> = {
  name: IpcName.MarkFeedUnread,
  handler: async (_event, payload) => {
    const db = await readDb();
    const articles = db.articles.filter((article) => {
      return payload.some((item) => {
        const isSameFeed = item.feedId === article.feedId;
        const isSameLink = item.link === article.link;
        return isSameFeed && isSameLink;
      });
    });
    articles.forEach((article) => {
      article.isRead = false;
    });
    await writeDb(db);
  },
};
