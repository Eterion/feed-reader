<script setup lang="ts">
import FolderIcon from '@/components/@icons/FolderIcon.vue';
import RssIcon from '@/components/@icons/RssIcon.vue';
import AppHeader from '@/components/AppHeader.vue';
import ContextMenu from '@/components/ContextMenu.vue';
import FileExplorer from '@/components/FileExplorer.vue';
import { getFeedArticles } from '@/utils/getFeedArticles';
import { getFolderArticles } from '@/utils/getFolderArticles';
import { showConfirm } from '@/utils/showConfirm';
import { showPrompt } from '@/utils/showPrompt';
import { useFeedsStore } from '@/utils/useFeedsStore';
import type { IterableElement } from 'type-fest';
import type { ComponentProps } from 'vue-component-type-helpers';

const props = defineProps<{
  feedUrl?: string;
}>();

const feedsStore = useFeedsStore();

const getReadUnreadFeedArticles = computed(() => {
  return (feedUrl: string) => {
    const feedArticles = getFeedArticles(feedUrl, {
      articles: feedsStore.articles,
    });
    const unread = feedArticles.filter((item) => !item.isRead);
    const read = feedArticles.filter((item) => item.isRead);
    return { unread, read };
  };
});

const feeds = computed(() => {
  return feedsStore.feeds.map<
    IterableElement<ComponentProps<typeof FileExplorer>['feeds']>
  >((feed) => ({
    isActive: feed.url === props.feedUrl,
    data: feed.data,
    name: feed.name,
    parentId: feed.parentId,
    unreadCount: getReadUnreadFeedArticles.value(feed.url).unread.length,
    url: feed.url,
  }));
});

const folders = computed(() => {
  return feedsStore.folders.map<
    IterableElement<ComponentProps<typeof FileExplorer>['folders']>
  >((folder) => ({
    id: folder.id,
    name: folder.name,
    parentId: folder.parentId,
    unreadCount: getFolderArticles(folder.id, {
      articles: feedsStore.articles,
      feeds: feedsStore.feeds,
      folders: feedsStore.folders,
    }).filter((article) => !article.isRead).length,
  }));
});

function newFeed(parentId?: number) {
  showPrompt('Enter the rss/atom url', {
    title: 'New Feed',
    onOk: async (url) => {
      await feedsStore.newFeed(url, parentId);
    },
  });
}

function createFolder(parentId?: number) {
  showPrompt('Folder name', {
    title: 'Create Folder',
    onOk: async (name) => {
      await feedsStore.createFolder(name, parentId);
    },
  });
}

const fileExplorerProps = computed<ComponentProps<typeof FileExplorer>>(() => {
  return {
    feeds: feeds.value,
    folders: folders.value,
    onCreateFolder: createFolder,
    onNewFeed: newFeed,
    onMarkFeedRead: async (feedUrl) => {
      const { unread } = getReadUnreadFeedArticles.value(feedUrl);
      if (unread.length)
        await feedsStore.markFeedRead(
          unread.map((article) => ({
            feedUrl: article.feedUrl,
            link: article.link,
          })),
        );
    },
    onMarkFolderRead: async (folderId) => {
      await feedsStore.markFolderRead(folderId);
    },
    onMarkFeedUnread: async (feedUrl) => {
      const { read } = getReadUnreadFeedArticles.value(feedUrl);
      if (read.length)
        await feedsStore.markFeedUnread(
          read.map((article) => ({
            feedUrl: article.feedUrl,
            link: article.link,
          })),
        );
    },
    onMarkFolderUnread: async (folderId) => {
      await feedsStore.markFolderUnread(folderId);
    },
    onMoveFeed: async ({ feedUrl, parentId }) => {
      await feedsStore.moveFeed(feedUrl, parentId);
    },
    onMoveFolder: async ({ folderId, parentId }) => {
      await feedsStore.moveFolder(folderId, parentId);
    },
    onRemoveFeed: (feedUrl) => {
      const feedName = feeds.value.find((feed) => feed.url === feedUrl)?.name;
      showConfirm(`Are you sure you want to remove **${feedName}** feed?`, {
        title: 'Remove Feed',
        danger: true,
        onOk: async () => {
          await feedsStore.removeFeed(feedUrl);
        },
      });
    },
    onRemoveFolder: async (folderId) => {
      const folderName = folders.value.find(
        (folder) => folder.id === folderId,
      )?.name;
      showConfirm(
        `Are you sure you want to remove **${folderName}** folder? Feeds in this folder will also be removed.`,
        {
          danger: true,
          title: 'Remove Folder',
          onOk: async () => {
            await feedsStore.removeFolder(folderId);
          },
        },
      );
    },
    onRenameFeed: async (feedUrl) => {
      showPrompt('Enter new feed name', {
        defaultValue: feeds.value.find((feed) => {
          return feed.url === feedUrl;
        })?.name,
        title: 'Rename Feed',
        onOk: async (name) => {
          await feedsStore.renameFeed(feedUrl, name);
        },
      });
    },
    onRenameFolder: async (folderId) => {
      showPrompt('Enter new folder name', {
        defaultValue: folders.value.find((folder) => folder.id === folderId)
          ?.name,
        title: 'Rename Folder',
        onOk: async (name) => {
          await feedsStore.renameFolder(folderId, name);
        },
      });
    },
  };
});

const rootRef = useTemplateRef('root');
const contextMenuItems = computed<
  ComponentProps<typeof ContextMenu<'newFeed' | 'createFolder'>>['items']
>(() => [
  {
    caption: 'New Feed',
    iconSlot: 'newFeed',
    onClick: () => newFeed(),
  },
  {
    caption: 'Create Folder',
    iconSlot: 'createFolder',
    onClick: () => createFolder(),
  },
]);
</script>

<template>
  <div ref="root">
    <AppHeader
      :class="$style.header"
      :last-checked-on="feedsStore.lastCheckedOn"
      :loading="feedsStore.isLoading"
      @new-feed="newFeed"
      @refresh="feedsStore.refresh" />
    <div :class="$style.content">
      <FileExplorer v-bind="fileExplorerProps" />
    </div>
    <ContextMenu :reference-element="rootRef" :items="contextMenuItems">
      <template #newFeed><RssIcon /></template>
      <template #createFolder><FolderIcon /></template>
    </ContextMenu>
  </div>
</template>

<style module lang="scss">
.header {
  position: sticky;
  top: 0;
}

.content {
  padding: 12px 12px 64px;
}
</style>
