import { isEqual, pick } from 'es-toolkit';
import type { IpcChannel } from '../types/IpcChannel';
import { IpcName } from '../types/IpcName';
import { readDb, writeDb } from '../utils/readAndWriteDb';

export const markFeedUnreadIpc: IpcChannel<
  [{ feedId: string; link: string }[]]
> = {
  name: IpcName.MarkFeedUnread,
  handler: async (_event, payload) => {
    const db = await readDb();
    db.articles
      .filter((article) => {
        return payload.some((payloadItem) => {
          return isEqual(payloadItem, pick(article, ['feedId', 'link']));
        });
      })
      .forEach((article) => {
        article.isRead = false;
      });
    await writeDb(db);
  },
};
