import { useFeedsStore } from './useFeedsStore';

export function useFeed(feedUrl: MaybeRefOrGetter<string | undefined>) {
  const feedsStore = useFeedsStore();

  const feed = computed(() => {
    return feedsStore.feeds.find((feed) => {
      return feed.url === toValue(feedUrl);
    });
  });

  const articles = computed(() => {
    return feedsStore.articles.filter((article) => {
      return article.feedUrl === toValue(feedUrl);
    });
  });

  return {
    feed,
    articles,
  };
}
