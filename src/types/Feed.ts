import type RssParser from 'rss-parser';
import type { Except, UnknownRecord } from 'type-fest';

export interface Feed {
  data: Except<RssParser.Output<UnknownRecord>, 'items'>;
  id: string;
  name?: string;
  parentId?: number;
  url: string;
}
