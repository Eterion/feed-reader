import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import { useFeedsStore } from './useFeedsStore';

export function useFeed(feedId: MaybeRefOrGetter<string | undefined>) {
  const feedsStore = useFeedsStore();

  const feed = computed(() => {
    return feedsStore.feeds.find((feed) => {
      return feed.id === toValue(feedId);
    });
  });

  const articles = computed(() => {
    return feedsStore.articles.filter((article) => {
      return article.feedId === toValue(feedId);
    });
  });

  return {
    feed,
    articles,
  };
}
