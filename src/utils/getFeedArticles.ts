export function getFeedArticles(
  feedId: string,
  {
    articles,
  }: {
    articles: Article[];
  },
): Article[] {
  return articles.filter((article) => {
    return article.feedId === feedId;
  });
}
