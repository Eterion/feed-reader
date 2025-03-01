import type { Article } from './Article';
import type { Feed } from './Feed';
import type { Folder } from './Folder';

export interface Database {
  articles: Article[];
  feeds: Feed[];
  folders: Folder[];
}
