import type { Article } from '@/types/Article';
import type { Database } from '@/types/Database';
import { getFeedArticles } from './getFeedArticles';
import { getFolderFeeds } from './getFolderFeeds';

export function getFolderArticles(
  folderId: number,
  { articles, feeds, folders }: Database,
): Article[] {
  return getFolderFeeds(folderId, { feeds, folders }).flatMap((feed) =>
    getFeedArticles(feed.url, { articles }),
  );
}
