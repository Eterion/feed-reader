<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import type { ComponentProps } from 'vue-component-type-helpers';
import EyeIcon from './@icons/EyeIcon.vue';
import EyeOffIcon from './@icons/EyeOffIcon.vue';
import FolderIcon from './@icons/FolderIcon.vue';
import FolderOpenIcon from './@icons/FolderOpenIcon.vue';
import PencilIcon from './@icons/PencilIcon.vue';
import RssIcon from './@icons/RssIcon.vue';
import TrashIcon from './@icons/TrashIcon.vue';
import ContextMenu from './ContextMenu.vue';

withDefaults(
  defineProps<{
    depthLevel?: number;
    folder: {
      id: number;
      name: string;
      parentId?: number;
    };
    open?: boolean;
    unreadCount?: number;
  }>(),
  {
    depthLevel: 0,
    unreadCount: 0,
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

defineOptions({
  inheritAttrs: false,
});

const folderRef = useTemplateRef('folder');
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
    ref="folder"
    :class="[$style.el, { [$style.open]: isContextMenuOpen }]"
    type="button"
    v-bind="$attrs"
    @click="$emit('toggle', $event)">
    <span v-for="n in depthLevel" :key="n" :class="$style.guide"></span>
    <span :class="$style.folder">
      <FolderOpenIcon v-if="open" />
      <FolderIcon v-else />
    </span>
    <span :class="$style.name">{{ folder.name }}</span>
    <span v-if="unreadCount" :class="$style.count">({{ unreadCount }})</span>
  </button>
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
</template>

<style module lang="scss">
.el {
  align-items: center;
  background-color: transparent;
  border-radius: 6px;
  border: none;
  color: var(--text);
  column-gap: 0.5ch;
  display: flex;
  font-size: 0.875rem;
  padding: 0 10px;
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

.folder {
  align-items: center;
  color: var(--light-text);
  display: flex;
  justify-content: center;
  width: 36px;
  :where(svg) {
    width: 18px;
    height: 18px;
  }
}

.name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 6px 0;
}

.count {
  flex-shrink: 0;
}

.guide {
  align-self: stretch;
  background-color: var(--light-border);
  margin-left: 17px;
  margin-right: 16px;
  width: 1px;
}
</style>
