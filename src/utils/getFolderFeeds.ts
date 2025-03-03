import type { Database } from '@/types/Database';
import type { Feed } from '@/types/Feed';
import { getFolderFolders } from './getFolderFolders';

export function getFolderFeeds(
  folderId: number,
  { feeds, folders }: Pick<Database, 'feeds' | 'folders'>,
): Feed[] {
  return getFolderFolders(folderId, { folders })
    .map((folder) => folder.id)
    .concat(folderId)
    .flatMap((folderId) => feeds.filter((feed) => feed.parentId === folderId));
}
