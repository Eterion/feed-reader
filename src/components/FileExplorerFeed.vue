<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import type { ComponentProps } from 'vue-component-type-helpers';
import { useRoute } from 'vue-router';
import EyeIcon from './@icons/EyeIcon.vue';
import EyeOffIcon from './@icons/EyeOffIcon.vue';
import PencilIcon from './@icons/PencilIcon.vue';
import RssIcon from './@icons/RssIcon.vue';
import TrashIcon from './@icons/TrashIcon.vue';
import ContextMenu from './ContextMenu.vue';

const props = withDefaults(
  defineProps<{
    depthLevel?: number;
    feed: {
      id: string;
      name?: string;
      parentId?: number;
      unreadCount?: number;
      url: string;
    };
  }>(),
  {
    depthLevel: 0,
  },
);

const emit = defineEmits<{
  markRead: [];
  markUnread: [];
  remove: [];
  rename: [];
}>();

const unreadCount = computed(() => props.feed.unreadCount ?? 0);
const to = computed(() => `/${props.feed.id}`);

const route = useRoute();
const isActive = computed(() => {
  return route.params.feedId === props.feed.id;
});

const link = useTemplateRef('link');
const isContextMenuOpen = ref(false);
const contextMenuItems = computed<
  ComponentProps<
    typeof ContextMenu<'markRead' | 'markUnread' | 'rename' | 'remove'>
  >['items']
>(() => [
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

function onDragstart(event: DragEvent) {
  event.dataTransfer?.setData('feedId', props.feed.id);
}
</script>

<template>
  <RouterLink v-slot="{ href, navigate }" custom :to="to">
    <a
      ref="link"
      :href="href"
      :class="[
        $style.link,
        {
          [$style.active]: isActive,
          [$style.unread]: unreadCount > 0,
          [$style.open]: isContextMenuOpen,
        },
      ]"
      draggable
      @click="navigate"
      @dragstart="onDragstart">
      <span v-for="n in depthLevel" :key="n" :class="$style.guide"></span>
      <span :class="$style.rss"><RssIcon /></span>
      <span :class="$style.name">{{ feed.name || feed.url }}</span>
      <span :class="$style.count" v-if="unreadCount">({{ unreadCount }})</span>
    </a>
    <ContextMenu
      v-model:open="isContextMenuOpen"
      :reference-element="link"
      :items="contextMenuItems">
      <template #markRead><EyeIcon /></template>
      <template #markUnread><EyeOffIcon /></template>
      <template #remove><TrashIcon /></template>
      <template #rename><PencilIcon /></template>
    </ContextMenu>
  </RouterLink>
</template>

<style module lang="scss">
.link {
  --rss-color: var(--light-text);
  align-items: center;
  border-radius: 6px;
  color: var(--text);
  column-gap: 0.5ch;
  display: flex;
  font-size: 0.875rem;
  padding: 0 10px;
  text-decoration: none;
  &.unread {
    --rss-color: var(--rss);
    font-weight: bold;
  }
  &.active {
    --rss-color: currenColor;
    color: var(--text-on-primary-surface);
    background-color: var(--primary-surface);
  }
  &:not(.active).open,
  &:not(.active):hover {
    background-color: var(--hover-surface);
  }
}

.guide {
  align-self: stretch;
  background-color: var(--border);
  margin-left: 17px;
  margin-right: 16px;
  width: 1px;
}

.rss {
  align-items: center;
  display: flex;
  justify-content: center;
  width: 36px;
  color: var(--rss-color);
  :where(svg) {
    height: 18px;
    width: 18px;
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
</style>
