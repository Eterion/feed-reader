import { isEqual, pick } from 'es-toolkit';
import type { IpcChannel } from '../types/IpcChannel';
import { IpcName } from '../types/IpcName';
import { useDb } from '../utils/useDb';

export const markFeedReadIpc: IpcChannel<[{ feedId: string; link: string }[]]> =
  {
    name: IpcName.MarkFeedRead,
    handler: async (_event, payload) => {
      await useDb((db) => {
        db.articles
          .filter((article) => {
            return payload.some((payloadItem) => {
              return isEqual(payloadItem, pick(article, ['feedId', 'link']));
            });
          })
          .forEach((article) => {
            article.isRead = true;
          });
      });
    },
  };
