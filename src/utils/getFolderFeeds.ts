import type { Feed } from '@/types/Feed';
import type { Folder } from '@/types/Folder';
import { getFolderFolders } from './getFolderFolders';

export function getFolderFeeds(
  folderId: number,
  {
    feeds,
    folders,
  }: {
    feeds: Feed[];
    folders: Folder[];
  },
): Feed[] {
  return getFolderFolders(folderId, { folders })
    .map((folder) => folder.id)
    .concat(folderId)
    .flatMap((folderId) => feeds.filter((feed) => feed.parentId === folderId));
}
