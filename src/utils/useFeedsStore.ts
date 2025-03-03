import type { Article } from '@/types/Article';
import type { Feed } from '@/types/Feed';
import type { Folder } from '@/types/Folder';
import { showAlert } from './showAlert';

export const useFeedsStore = defineStore('feeds', () => {
  const articles = ref<Article[]>([]);
  const feeds = ref<Feed[]>([]);
  const folders = ref<Folder[]>([]);
  const lastCheckedOn = ref<Date>();
  const isLoading = ref(false);

  async function refreshWithOptions({
    skipDownloadOfArticles,
  }: {
    skipDownloadOfArticles?: boolean;
  } = {}) {
    const affectsLoading = !skipDownloadOfArticles;
    try {
      if (affectsLoading) isLoading.value = true;
      const data = await window.ipcRenderer.refresh({ skipDownloadOfArticles });
      feeds.value = data.feeds;
      folders.value = data.folders;
      articles.value = data.articles;
      if (affectsLoading) lastCheckedOn.value = new Date();
    } finally {
      if (affectsLoading) isLoading.value = false;
    }
  }

  async function refresh() {
    await refreshWithOptions();
  }

  async function refreshWithoutDownloadingArticles() {
    await refreshWithOptions({
      skipDownloadOfArticles: true,
    });
  }

  async function newFeed(url: string, parentId?: number) {
    await window.ipcRenderer.newFeed(url, parentId);
    await refreshWithOptions();
  }

  async function removeFeed(feedId: string) {
    await window.ipcRenderer.removeFeed(feedId);
    await refreshWithoutDownloadingArticles();
  }

  async function moveFeed(feedId: string, parentId?: number) {
    await window.ipcRenderer.moveFeed(feedId, parentId);
    await refreshWithoutDownloadingArticles();
  }

  async function renameFeed(feedId: string, name: string) {
    await window.ipcRenderer.renameFeed(feedId, name);
    await refreshWithoutDownloadingArticles();
  }

  async function markFeedRead(payload: { feedId: string; link: string }[]) {
    await window.ipcRenderer.markFeedRead(payload);
    await refreshWithoutDownloadingArticles();
  }

  async function markFeedUnread(payload: { feedId: string; link: string }[]) {
    await window.ipcRenderer.markFeedUnread(payload);
    await refreshWithoutDownloadingArticles();
  }

  async function createFolder(name: string, parentId?: number) {
    await window.ipcRenderer.createFolder(name, parentId);
    await refreshWithoutDownloadingArticles();
  }

  async function removeFolder(folderId: number) {
    await window.ipcRenderer.removeFolder(folderId);
    await refreshWithoutDownloadingArticles();
  }

  async function renameFolder(folderId: number, name: string) {
    await window.ipcRenderer.renameFolder(folderId, name);
    await refreshWithoutDownloadingArticles();
  }

  async function moveFolder(folderId: number, parentId?: number) {
    showAlert('Not yet implemented');
  }

  async function markFolderRead(folderId: number) {
    showAlert('Not yet implemented');
  }

  async function markFolderUnread(folderId: number) {
    showAlert('Not yet implemented');
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
    refreshWithOptions,
    refreshWithoutDownloadingArticles,
    removeFeed,
    removeFolder,
    renameFeed,
    renameFolder,
  };
});
