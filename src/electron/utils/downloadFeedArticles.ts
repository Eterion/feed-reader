import type { Article } from '@/types/Article';
import { isAfter, parseISO } from 'date-fns';
import RssParser from 'rss-parser';
import { useDb } from './useDb';

export async function downloadFeedArticles(feedUrls: string[] = []) {
  return await useDb(async (db) => {
    const rssParser = new RssParser();
    const feeds = await Promise.all(
      db.feeds
        .filter((feed) => {
          if (feedUrls.length) return feedUrls.includes(feed.url);
          return true;
        })
        .map(async (feed) => ({
          feedUrl: feed.url,
          data: await rssParser.parseURL(feed.url),
        })),
    );
    const items = feeds.flatMap(({ data, feedUrl }) =>
      data.items.map((item) => ({
        feedUrl,
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
          const isSameFeed = article.feedUrl === item.feedUrl;
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
            feedUrl: item.feedUrl,
            isRead: false,
            link: itemLink,
          });
        }
      }
    });
    return db;
  });
}
