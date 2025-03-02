import type { Database } from '@/types/Database';
import type { IpcChannel } from '../types/IpcChannel';
import { IpcName } from '../types/IpcName';
import { downloadFeedArticles } from '../utils/downloadFeedArticles';

export const refreshIpc: IpcChannel<[], Database> = {
  name: IpcName.Refresh,
  handler: async () => {
    return await downloadFeedArticles();
  },
};
