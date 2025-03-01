<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
import { remove } from 'es-toolkit';
import { isNumber } from 'es-toolkit/compat';
import { computed } from 'vue';
import type { ComponentProps } from 'vue-component-type-helpers';
import FileExplorerFeed from './FileExplorerFeed.vue';
import FileExplorerFolder from './FileExplorerFolder.vue';

const props = withDefaults(
  defineProps<{
    depthLevel?: number;
    feeds?: ComponentProps<typeof FileExplorerFeed>['feed'][];
    folderId?: number;
    folders?: ComponentProps<typeof FileExplorerFolder>['folder'][];
  }>(),
  {
    depthLevel: 0,
    feeds: () => [],
    folders: () => [],
  },
);

const emit = defineEmits<{
  createFolder: [parentId?: number];
  markFeedRead: [feedId: string];
  markFeedUnread: [feedId: string];
  markFolderRead: [folderId: number];
  markFolderUnread: [folderId: number];
  moveFeed: [payload: { feedId: string; parentId?: number }];
  moveFolder: [payload: { folderId: number; parentId?: number }];
  newFeed: [parentId?: number];
  removeFeed: [feedId: string];
  removeFolder: [folderId: number];
  renameFeed: [feedId: string];
  renameFolder: [folderId: number];
}>();

const openedIds = useLocalStorage<number[]>('file-explorer/opened-ids', []);

const foldersInCurrentDepth = computed(() => {
  return props.folders.filter((folder) => {
    return isNumber(props.folderId)
      ? isNumber(folder.parentId)
        ? folder.parentId === props.folderId
        : false
      : !isNumber(folder.parentId);
  });
});

const mappedFolders = computed(() => {
  return foldersInCurrentDepth.value.map<{
    id: number;
    name: string;
    folder: ComponentProps<typeof FileExplorerFolder>;
  }>((folder) => {
    const isOpen = openedIds.value.includes(folder.id);
    return {
      id: folder.id,
      name: folder.name,
      folder: {
        folder: folder,
        depthLevel: props.depthLevel,
        open: isOpen,
        onCreateFolder: () => emit('createFolder', folder.id),
        onNewFeed: () => emit('newFeed', folder.id),
        onRemove: () => emit('removeFolder', folder.id),
        onRename: () => emit('renameFolder', folder.id),
        onDrop: (event) => {
          const feedId = event.dataTransfer?.getData('feedId');
          if (feedId)
            emit('moveFeed', {
              feedId,
              parentId: folder.id,
            });
        },
        onToggle: () => {
          isOpen
            ? remove(openedIds.value, (value) => value === folder.id)
            : openedIds.value.push(folder.id);
        },
      },
    };
  });
});

const sortedFolders = computed(() => {
  return mappedFolders.value.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
});

const feedsInCurrentDepth = computed(() => {
  return props.feeds.filter((feed) => {
    return isNumber(props.folderId)
      ? isNumber(feed.parentId)
        ? feed.parentId === props.folderId
        : false
      : !isNumber(feed.parentId);
  });
});

const mappedFeeds = computed(() => {
  return feedsInCurrentDepth.value.map<{
    id: string;
    name: string;
    feed: ComponentProps<typeof FileExplorerFeed>;
  }>((feed) => ({
    id: feed.id,
    name: feed.name || feed.url,
    feed: {
      depthLevel: props.depthLevel,
      feed: feed,
      onMarkRead: () => emit('markFeedRead', feed.id),
      onMarkUnread: () => emit('markFeedUnread', feed.id),
      onRemove: () => emit('removeFeed', feed.id),
      onRename: () => emit('renameFeed', feed.id),
    },
  }));
});

const sortedFeeds = computed(() => {
  return mappedFeeds.value.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
});
</script>

<template>
  <ul :class="$style.el">
    <li v-for="folder in sortedFolders" :key="folder.id">
      <FileExplorerFolder v-bind="folder.folder" />
      <FileExplorer
        v-if="folder.folder.open"
        :depth-level="depthLevel + 1"
        :feeds="feeds"
        :folder-id="folder.id"
        :folders="folders"
        @create-folder="$emit('createFolder', $event)"
        @mark-feed-read="$emit('markFeedRead', $event)"
        @mark-feed-unread="$emit('markFeedUnread', $event)"
        @mark-folder-read="$emit('markFolderRead', $event)"
        @mark-folder-unread="$emit('markFolderUnread', $event)"
        @move-feed="$emit('moveFeed', $event)"
        @move-folder="$emit('moveFolder', $event)"
        @new-feed="$emit('newFeed', $event)"
        @remove-feed="$emit('removeFeed', $event)"
        @remove-folder="$emit('removeFolder', $event)"
        @rename-feed="$emit('renameFeed', $event)"
        @rename-folder="$emit('renameFolder', $event)" />
    </li>
    <li v-for="feed in sortedFeeds" :key="feed.id">
      <FileExplorerFeed v-bind="feed.feed" />
    </li>
  </ul>
</template>

<style module lang="scss">
.el {
  list-style: none;
  padding: 0;
  &:where(li):not(:last-child) {
    margin-bottom: 1px;
  }
}
</style>
