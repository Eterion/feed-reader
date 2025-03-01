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
