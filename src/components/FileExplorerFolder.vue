<script setup lang="ts">
import type { Folder } from '@/types/Folder';
import type { ComponentProps } from 'vue-component-type-helpers';
import EyeIcon from './@icons/EyeIcon.vue';
import EyeOffIcon from './@icons/EyeOffIcon.vue';
import FolderIcon from './@icons/FolderIcon.vue';
import FolderOpenIcon from './@icons/FolderOpenIcon.vue';
import PencilIcon from './@icons/PencilIcon.vue';
import RssIcon from './@icons/RssIcon.vue';
import TrashIcon from './@icons/TrashIcon.vue';
import ContextMenu from './ContextMenu.vue';

const props = withDefaults(
  defineProps<{
    depthLevel?: number;
    folder: Folder & { unreadCount?: number };
    open?: boolean;
  }>(),
  {
    depthLevel: 0,
  },
);

const emit = defineEmits<{
  createFolder: [];
  markRead: [];
  markUnread: [];
  newFeed: [];
  remove: [];
  rename: [];
  toggle: [event: Event];
}>();

const unreadCount = computed(() => props.folder.unreadCount ?? 0);

const folderRef = useTemplateRef('folderRef');
const isContextMenuOpen = ref(false);
const contextMenuItems = computed<
  ComponentProps<
    typeof ContextMenu<
      | 'newFeed'
      | 'createFolder'
      | 'markRead'
      | 'markUnread'
      | 'rename'
      | 'remove'
    >
  >['items']
>(() => [
  {
    caption: 'New Feed',
    iconSlot: 'newFeed',
    onClick: () => emit('newFeed'),
  },
  {
    caption: 'Create Sub-Folder',
    iconSlot: 'createFolder',
    onClick: () => emit('createFolder'),
  },
  {
    caption: 'Mark as read',
    iconSlot: 'markRead',
    onClick: () => emit('markRead'),
  },
  {
    caption: 'Mark as unread',
    iconSlot: 'markUnread',
    onClick: () => emit('markUnread'),
  },
  {
    caption: 'Rename',
    iconSlot: 'rename',
    onClick: () => emit('rename'),
  },
  {
    caption: 'Remove',
    danger: true,
    iconSlot: 'remove',
    onClick: () => emit('remove'),
  },
]);
</script>

<template>
  <button
    ref="folderRef"
    :class="[
      $style.el,
      {
        [$style.unread]: unreadCount > 0,
        [$style.open]: isContextMenuOpen,
      },
    ]"
    type="button"
    @click="$emit('toggle', $event)">
    <span v-for="n in depthLevel" :key="n" :class="$style.guide"></span>
    <span :class="$style.folder">
      <FolderOpenIcon v-if="open" />
      <FolderIcon v-else />
    </span>
    <span :class="$style.name">{{ folder.name }}</span>
    <span v-if="unreadCount" :class="$style.count">({{ unreadCount }})</span>
    <ContextMenu
      v-model:open="isContextMenuOpen"
      :reference-element="folderRef"
      :items="contextMenuItems">
      <template #createFolder><FolderIcon /></template>
      <template #markRead><EyeIcon /></template>
      <template #markUnread><EyeOffIcon /></template>
      <template #newFeed><RssIcon /></template>
      <template #remove><TrashIcon /></template>
      <template #rename><PencilIcon /></template>
    </ContextMenu>
  </button>
</template>

<style module lang="scss">
.el {
  align-items: center;
  background-color: transparent;
  border: none;
  border-radius: var(--small-radius);
  color: var(--text);
  display: flex;
  font-size: 0.875rem;
  padding: 0 10px 0 0;
  text-decoration: none;
  width: 100%;
  &.unread {
    font-weight: bold;
  }
  &.open,
  &:hover {
    background-color: var(--hover-surface);
    cursor: pointer;
  }
}

.guide {
  align-self: stretch;
  background-color: var(--light-border);
  flex-shrink: 0;
  margin-left: 17px;
  margin-right: 16px;
  width: 1px;
}

.folder {
  align-items: center;
  color: var(--light-text);
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  width: 36px;
  :where(svg) {
    height: 18px;
    width: 18px;
  }
}

.name {
  overflow: hidden;
  padding: 6px 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.count {
  flex-shrink: 0;
  margin-left: 0.5ch;
}
</style>
