import type { Article } from '@/types/Article';
import type { Feed } from '@/types/Feed';
import type { Folder } from '@/types/Folder';
import { getFeedArticles } from './getFeedArticles';
import { getFolderFeeds } from './getFolderFeeds';

export function getFolderArticles(
  folderId: number,
  {
    articles,
    feeds,
    folders,
  }: {
    articles: Article[];
    feeds: Feed[];
    folders: Folder[];
  },
): Article[] {
  return getFolderFeeds(folderId, { feeds, folders }).flatMap((feed) =>
    getFeedArticles(feed.id, { articles }),
  );
}
