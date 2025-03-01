import type { Article } from '@/types/Article';
import { isAfter, parseISO } from 'date-fns';
import RssParser from 'rss-parser';
import { readDb, writeDb } from './readAndWriteDb';

export async function downloadFeedArticles(feedIds: string[] = []) {
  const db = await readDb();
  const rssParser = new RssParser();
  const feeds = await Promise.all(
    db.feeds
      .filter((feed) => {
        if (feedIds.length) return feedIds.includes(feed.id);
        return true;
      })
      .map(async (feed) => ({
        feedId: feed.id,
        data: await rssParser.parseURL(feed.url),
      })),
  );
  const items = feeds.flatMap(({ data, feedId }) =>
    data.items.map((item) => ({
      feedId,
      data: item,
    })),
  );
  const now = new Date();
  const getArticleDate = (articleData: Article['data']) =>
    articleData.isoDate ? parseISO(articleData.isoDate) : now;
  items.forEach((item) => {
    const itemLink = item.data.link;
    const itemDate = getArticleDate(item.data);
    if (itemLink) {
      const downloadedArticle = db.articles.find((article) => {
        const isSameFeed = article.feedId === item.feedId;
        const isSameLink = article.link === itemLink;
        return isSameFeed && isSameLink;
      });
      if (downloadedArticle) {
        if (isAfter(itemDate, getArticleDate(downloadedArticle.data))) {
          downloadedArticle.data = item.data;
          downloadedArticle.isRead = false;
        }
      } else {
        db.articles.push({
          data: item.data,
          feedId: item.feedId,
          isRead: false,
          link: itemLink,
        });
      }
    }
  });
  await writeDb(db);
  return db;
}
