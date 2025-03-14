<script setup lang="ts">
import type { Feed } from '@/types/Feed';
import type { ComponentProps } from 'vue-component-type-helpers';
import type { RouteLocationRaw } from 'vue-router';
import EyeIcon from './@icons/EyeIcon.vue';
import EyeOffIcon from './@icons/EyeOffIcon.vue';
import GlobeIcon from './@icons/GlobeIcon.vue';
import PencilIcon from './@icons/PencilIcon.vue';
import RssIcon from './@icons/RssIcon.vue';
import TrashIcon from './@icons/TrashIcon.vue';
import ContextMenu from './ContextMenu.vue';

const props = withDefaults(
  defineProps<{
    depthLevel?: number;
    feed: Feed & {
      isActive?: boolean;
      unreadCount?: number;
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
const to = computed<RouteLocationRaw>(() => ({
  params: {
    feedUrl: props.feed.url,
    articleLink: '',
  },
}));

const link = useTemplateRef('link');
const isContextMenuOpen = ref(false);
const contextMenuItems = computed<
  ComponentProps<
    typeof ContextMenu<
      'open' | 'viewFeed' | 'markRead' | 'markUnread' | 'rename' | 'remove'
    >
  >['items']
>(() => [
  {
    caption: 'Open in browser',
    iconSlot: 'open',
    onClick: () => window.open(props.feed.data.link),
  },
  {
    caption: 'View feed',
    iconSlot: 'viewFeed',
    onClick: () => window.open(props.feed.url),
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

function onDragstart(event: DragEvent) {
  event.dataTransfer?.setData('feedUrl', props.feed.url);
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
          [$style.active]: feed.isActive,
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
      <template #open><GlobeIcon /></template>
      <template #viewFeed><RssIcon /></template>
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
  border-radius: var(--small-radius);
  color: var(--text);
  display: flex;
  font-size: 0.875rem;
  padding: 0 10px 0 0;
  text-decoration: none;
  &.unread {
    --rss-color: var(--rss);
    font-weight: bold;
  }
  &.active {
    background-color: var(--gray-surface);
    position: relative;
    &::before {
      background-color: var(--primary);
      border-radius: 3px;
      bottom: 8px;
      content: '';
      display: block;
      left: 0;
      position: absolute;
      top: 8px;
      width: 2px;
    }
  }
  &:not(.active).open,
  &:not(.active):hover {
    background-color: var(--hover-surface);
  }
  &:not(.active):active {
    background-color: oklch(from var(--gray-surface) calc(l * 0.95) c h);
  }
}

.guide {
  align-self: stretch;
  background-color: var(--border);
  flex-shrink: 0;
  margin-left: 17px;
  margin-right: 16px;
  width: 1px;
}

.rss {
  align-items: center;
  color: var(--rss-color);
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
