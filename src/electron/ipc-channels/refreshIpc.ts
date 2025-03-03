import type { Database } from '@/types/Database';
import type { IpcChannel } from '../types/IpcChannel';
import { IpcName } from '../types/IpcName';
import { downloadFeedArticles } from '../utils/downloadFeedArticles';
import { readDb } from '../utils/readAndWriteDb';

export const refreshIpc: IpcChannel<
  [{ skipDownloadOfArticles?: boolean }?],
  Database
> = {
  name: IpcName.Refresh,
  handler: async (_event, options) => {
    if (options?.skipDownloadOfArticles) {
      return await readDb();
    } else {
      return await downloadFeedArticles();
    }
  },
};
