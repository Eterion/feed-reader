import type { Article } from '@/types/Article';
import type { Feed } from '@/types/Feed';
import type { Folder } from '@/types/Folder';
import { isEqual, remove } from 'es-toolkit';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFeedsStore = defineStore('feeds', () => {
  const articles = ref<Article[]>([]);
  const feeds = ref<Feed[]>([]);
  const folders = ref<Folder[]>([]);
  const lastCheckedOn = ref<Date>();
  const isLoading = ref(false);

  async function refresh() {
    try {
      isLoading.value = true;
      const data = await window.ipcRenderer.refresh();
      articles.value = data.articles;
      feeds.value = data.feeds;
      folders.value = data.folders;
      lastCheckedOn.value = new Date();
    } finally {
      isLoading.value = false;
    }
  }

  async function newFeed(url: string, parentId?: number) {
    const data = await window.ipcRenderer.newFeed({ url, parentId });
    feeds.value.push(data);
    await refresh();
  }

  async function removeFeed(feedId: string) {
    await window.ipcRenderer.removeFeed(feedId);
    remove(feeds.value, (feed) => feed.id === feedId);
    remove(articles.value, (article) => article.feedId === feedId);
  }

  async function moveFeed(feedId: string, parentId?: number) {
    await window.ipcRenderer.moveFeed({ feedId, parentId });
    const feed = feeds.value.find((feed) => feed.id === feedId);
    if (feed) feed.parentId = parentId;
  }

  async function renameFeed(feedId: string, name: string) {
    await window.ipcRenderer.renameFeed({ feedId, name });
    const feed = feeds.value.find((feed) => feed.id === feedId);
    if (feed) feed.name = name;
  }

  async function markFeedRead(payload: { feedId: string; link: string }[]) {
    await window.ipcRenderer.markFeedRead(payload);
    const filteredArticles = articles.value.filter((article) => {
      return payload.some((item) => {
        return isEqual(item, { feedId: article.feedId, link: article.link });
      });
    });
    filteredArticles.forEach((article) => {
      article.isRead = true;
    });
  }

  async function markFeedUnread(payload: { feedId: string; link: string }[]) {
    await window.ipcRenderer.markFeedUnread(payload);
    const filteredArticles = articles.value.filter((article) => {
      return payload.some((item) => {
        return isEqual(item, { feedId: article.feedId, link: article.link });
      });
    });
    filteredArticles.forEach((article) => {
      article.isRead = false;
    });
  }

  async function createFolder(name: string, parentId?: number) {
    const data = await window.ipcRenderer.createFolder({ name, parentId });
    folders.value.push(data);
  }

  async function removeFolder(folderId: number) {
    await window.ipcRenderer.removeFolder(folderId);
    remove(folders.value, (folder) => folder.id === folderId);
  }

  async function renameFolder(folderId: number, name: string) {
    alert('Not yet implemented');
  }

  async function moveFolder(folderId: number, parentId?: number) {
    alert('Not yet implemented');
  }

  async function markFolderRead(folderId: number) {
    alert('Not yet implemented');
  }

  async function markFolderUnread(folderId: number) {
    alert('Not yet implemented');
  }

  return {
    articles,
    createFolder,
    feeds,
    folders,
    isLoading,
    lastCheckedOn,
    markFeedRead,
    markFeedUnread,
    markFolderRead,
    markFolderUnread,
    moveFeed,
    moveFolder,
    newFeed,
    refresh,
    removeFeed,
    removeFolder,
    renameFeed,
    renameFolder,
  };
});
