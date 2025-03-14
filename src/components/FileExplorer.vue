<script setup lang="ts">
import { remove } from 'es-toolkit';
import { isNumber } from 'es-toolkit/compat';
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
  markFeedRead: [feedUrl: string];
  markFeedUnread: [feedUrl: string];
  markFolderRead: [folderId: number];
  markFolderUnread: [folderId: number];
  moveFeed: [payload: { feedUrl: string; parentId?: number }];
  moveFolder: [payload: { folderId: number; parentId?: number }];
  newFeed: [parentId?: number];
  removeFeed: [feedUrl: string];
  removeFolder: [folderId: number];
  renameFeed: [feedUrl: string];
  renameFolder: [folderId: number];
}>();

const openedIds = useLocalStorage<number[]>('file-explorer-opened-ids', []);

function onDrop(event: DragEvent, parentId?: number) {
  event.stopImmediatePropagation();
  const feedUrl = event.dataTransfer?.getData('feedUrl');
  if (feedUrl)
    emit('moveFeed', {
      feedUrl,
      parentId,
    });
}

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
        folder,
        depthLevel: props.depthLevel,
        open: isOpen,
        onCreateFolder: () => emit('createFolder', folder.id),
        onMarkRead: () => emit('markFolderRead', folder.id),
        onMarkUnread: () => emit('markFolderUnread', folder.id),
        onNewFeed: () => emit('newFeed', folder.id),
        onRemove: () => emit('removeFolder', folder.id),
        onRename: () => emit('renameFolder', folder.id),
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
    key: string;
    name: string;
    feed: ComponentProps<typeof FileExplorerFeed>;
  }>((feed) => ({
    key: feed.url,
    name: feed.name || feed.url,
    feed: {
      depthLevel: props.depthLevel,
      feed,
      onMarkRead: () => emit('markFeedRead', feed.url),
      onMarkUnread: () => emit('markFeedUnread', feed.url),
      onRemove: () => emit('removeFeed', feed.url),
      onRename: () => emit('renameFeed', feed.url),
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
  <ul :class="$style.el" @dragover.prevent @drop="onDrop($event, folderId)">
    <li
      v-for="folder in sortedFolders"
      :key="folder.id"
      @dragover.prevent
      @drop="onDrop($event, folder.id)">
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
    <li v-for="feed in sortedFeeds" :key="feed.key">
      <FileExplorerFeed v-bind="feed.feed" />
    </li>
  </ul>
</template>

<style module lang="scss">
.el {
  list-style: none;
  padding: 0;
}
</style>
