import type RssParser from 'rss-parser';

export interface Article {
  data: RssParser.Item;
  feedId: string;
  isRead: boolean;
  link: string;
}
