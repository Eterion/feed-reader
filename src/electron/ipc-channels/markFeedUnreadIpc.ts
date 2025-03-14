import { isEqual, pick } from 'es-toolkit';
import type { IpcChannel } from '../types/IpcChannel';
import { IpcName } from '../types/IpcName';
import { useDb } from '../utils/useDb';

export const markFeedUnreadIpc: IpcChannel<
  [{ feedUrl: string; link: string }[]]
> = {
  name: IpcName.MarkFeedUnread,
  handler: async (_event, payload) => {
    await useDb((db) => {
      db.articles
        .filter((article) => {
          return payload.some((payloadItem) => {
            return isEqual(payloadItem, pick(article, ['feedUrl', 'link']));
          });
        })
        .forEach((article) => {
          article.isRead = false;
        });
    });
  },
};
