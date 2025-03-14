import type RssParser from 'rss-parser';

export interface Article {
  data: RssParser.Item;
  feedUrl: string;
  isRead: boolean;
  link: string;
}
