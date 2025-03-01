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
