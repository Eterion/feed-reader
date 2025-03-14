import type { Article } from '@/types/Article';
import type { Database } from '@/types/Database';

export function getFeedArticles(
  feedUrl: string,
  { articles }: Pick<Database, 'articles'>,
): Article[] {
  return articles.filter((article) => {
    return article.feedUrl === feedUrl;
  });
}
