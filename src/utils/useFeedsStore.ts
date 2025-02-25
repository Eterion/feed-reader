import type { Article } from '@/types/Article';
import type { Feed } from '@/types/Feed';
import axios from 'axios';
import { isEqual, remove } from 'es-toolkit';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFeedsStore = defineStore('feeds', () => {
  const articles = ref<Article[]>([]);
  const feeds = ref<Feed[]>([]);
  const lastCheckedOn = ref<Date>();
  const isLoading = ref(false);

  async function refreshFeeds() {
    try {
      isLoading.value = true;
      const { data } = await axios.get<{
        articles: Article[];
        feeds: Feed[];
      }>('/refresh');
      articles.value = data.articles;
      feeds.value = data.feeds;
      lastCheckedOn.value = new Date();
    } finally {
      isLoading.value = false;
    }
  }

  async function addFeed(url: string) {
    const { data } = await axios.put<Feed>('/feeds', { url });
    feeds.value.push(data);
    await refreshFeeds();
  }

  async function removeFeed(feedId: string) {
    await axios.delete(`/feeds/${feedId}`);
    remove(feeds.value, (feed) => feed.id === feedId);
    remove(articles.value, (article) => article.feedId === feedId);
  }

  async function renameFeed(feedId: string, name: string) {
    await axios.patch(`/feeds/${feedId}`, { name });
    const feed = feeds.value.find((feed) => feed.id === feedId);
    if (feed) feed.name = name;
  }

  async function markRead(articlesParam: { feedId: string; link: string }[]) {
    await axios.post('/mark-read', articlesParam);
    const filteredArticles = articles.value.filter((article) => {
      return articlesParam.some((item) => {
        return isEqual(item, { feedId: article.feedId, link: article.link });
      });
    });
    filteredArticles.forEach((article) => {
      article.isRead = true;
    });
  }

  async function markUnread(articlesParam: { feedId: string; link: string }[]) {
    await axios.post('/mark-unread', articlesParam);
    const filteredArticles = articles.value.filter((article) => {
      return articlesParam.some((item) => {
        return isEqual(item, { feedId: article.feedId, link: article.link });
      });
    });
    filteredArticles.forEach((article) => {
      article.isRead = false;
    });
  }

  return {
    addFeed,
    articles,
    feeds,
    isLoading,
    lastCheckedOn,
    markRead,
    markUnread,
    refreshFeeds,
    removeFeed,
    renameFeed,
  };
});
