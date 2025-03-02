import type { Article } from '@/types/Article';
import type { Database } from '@/types/Database';
import { isAfter, parseISO } from 'date-fns';
import { Notification } from 'electron';
import type { IpcChannel } from '../types/IpcChannel';
import { IpcName } from '../types/IpcName';
import { downloadFeedArticles } from '../utils/downloadFeedArticles';

export const refreshIpc: IpcChannel<[], Database> = {
  name: IpcName.Refresh,
  handler: async () => {
    const db = await downloadFeedArticles();
    showUnreadNotification(db);
    return db;
  },
};

function showUnreadNotification(db: Database) {
  const now = new Date();
  const getArticleDate = (articleData: Article['data']) =>
    articleData.isoDate ? parseISO(articleData.isoDate) : now;
  const unreadArticles = db.articles
    .filter((article) => !article.isRead)
    .map((article) => ({ ...article, isoDate: getArticleDate(article.data) }))
    .sort((a, b) => (isAfter(a.isoDate, b.isoDate) ? -1 : 1))
    .map((article) => article.data.title || 'Unknown Title');
  if (unreadArticles.length) {
    const notificaiton = new Notification({
      title: `${unreadArticles.length} unread articles`,
      body: unreadArticles.slice(0, 3).join(' | '),
    });
    notificaiton.show();
  }
}
