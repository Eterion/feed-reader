<script setup lang="ts">
import FolderIcon from '@/components/@icons/FolderIcon.vue';
import RssIcon from '@/components/@icons/RssIcon.vue';
import ContextMenu from '@/components/ContextMenu.vue';
import FileExplorer from '@/components/FileExplorer.vue';
import LastCheckedOn from '@/components/LastCheckedOn.vue';
import ThemeToggle from '@/components/ThemeToggle.vue';
import type { IterableElement } from 'type-fest';
import type { ComponentProps } from 'vue-component-type-helpers';

const feedsStore = useFeedsStore();

const getFeedArticles = computed(() => {
  return (feedId: string) => {
    const articles = feedsStore.articles;
    const feedArticles = articles.filter((item) => item.feedId === feedId);
    const unread = feedArticles.filter((item) => !item.isRead);
    const read = feedArticles.filter((item) => item.isRead);
    return { unread, read };
  };
});

const feeds = computed(() => {
  return feedsStore.feeds.map<
    IterableElement<ComponentProps<typeof FileExplorer>['feeds']>
  >((feed) => ({
    id: feed.id,
    name: feed.name,
    parentId: feed.parentId,
    url: feed.url,
    unreadCount: getFeedArticles.value(feed.id).unread.length,
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
  showPrompt('Feed url', {
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
    onMarkFeedRead: async (feedId) => {
      const { unread } = getFeedArticles.value(feedId);
      if (unread.length)
        await feedsStore.markFeedRead(
          unread.map((article) => ({
            feedId: article.feedId,
            link: article.link,
          })),
        );
    },
    onMarkFolderRead: async (folderId) => {
      await feedsStore.markFolderRead(folderId);
    },
    onMarkFeedUnread: async (feedId) => {
      const { read } = getFeedArticles.value(feedId);
      if (read.length)
        await feedsStore.markFeedUnread(
          read.map((article) => ({
            feedId: article.feedId,
            link: article.link,
          })),
        );
    },
    onMarkFolderUnread: async (folderId) => {
      await feedsStore.markFolderUnread(folderId);
    },
    onMoveFeed: async ({ feedId, parentId }) => {
      await feedsStore.moveFeed(feedId, parentId);
    },
    onMoveFolder: async ({ folderId, parentId }) => {
      await feedsStore.moveFolder(folderId, parentId);
    },
    onRemoveFeed: async (feedId) => {
      if (confirm('Really remove?'))
        try {
          await feedsStore.removeFeed(feedId);
        } catch (e) {
          alert(e);
        }
    },
    onRemoveFolder: async (folderId) => {
      if (confirm('Really remove?'))
        try {
          await feedsStore.removeFolder(folderId);
        } catch (e) {
          alert(e);
        }
    },
    onRenameFeed: async (feedId) => {
      showPrompt('New name', {
        defaultValue: feeds.value.find((feed) => {
          return feed.id === feedId;
        })?.name,
        onOk: async (name) => {
          try {
            await feedsStore.renameFeed(feedId, name);
          } catch (e) {
            alert(e);
          }
        },
      });
    },
    onRenameFolder: async (folderId) => {
      showPrompt('New name', {
        defaultValue: folders.value.find((folder) => folder.id === folderId)
          ?.name,
        onOk: async (name) => {
          try {
            await feedsStore.renameFolder(folderId, name);
          } catch (e) {
            alert(e);
          }
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
    <header :class="$style.header">
      <button :class="$style.addButton" type="button" @click="newFeed()">
        Add Feed
      </button>
      <ThemeToggle />
      <div v-if="feedsStore.lastCheckedOn" :class="$style.lastCheckedOn">
        <LastCheckedOn
          :date="feedsStore.lastCheckedOn"
          :loading="feedsStore.isLoading"
          @click="feedsStore.refresh" />
      </div>
    </header>
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
  align-items: center;
  background-color: var(--foreground);
  column-gap: 0.5ch;
  display: flex;
  padding: 12px;
  position: sticky;
  top: 0;
}

.addButton {
  background-color: var(--foreground);
  border-radius: 6px;
  border: 1px solid var(--border);
  box-shadow: var(--low-shadow);
  color: var(--text);
  cursor: pointer;
  flex-shrink: 0;
  font-size: 0.875rem;
  padding: 6px 10px;
  transition-duration: 200ms;
  transition-property: background-color, border-color;
  &:hover {
    background-color: var(--hover-surface);
    border-color: var(--dark-border);
  }
}

.lastCheckedOn {
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
}

.content {
  padding: 0 12px 64px;
}
</style>
