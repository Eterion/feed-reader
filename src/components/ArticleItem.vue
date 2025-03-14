<script setup lang="ts">
import type { ComponentProps } from 'vue-component-type-helpers';
import type { RouteLocationRaw } from 'vue-router';
import EyeIcon from './@icons/EyeIcon.vue';
import EyeOffIcon from './@icons/EyeOffIcon.vue';
import GlobeIcon from './@icons/GlobeIcon.vue';
import ContextMenu from './ContextMenu.vue';

const props = defineProps<{
  active?: boolean;
  link: string;
  selected?: boolean;
  title?: string;
  unread?: boolean;
}>();

const emit = defineEmits<{
  markRead: [];
  markUnread: [];
}>();

const link = useTemplateRef('link');
const to = computed<RouteLocationRaw>(() => ({
  params: {
    articleLink: props.link,
  },
}));

const isContextMenuOpen = ref(false);
const contextMenuItems = computed<
  ComponentProps<
    typeof ContextMenu<'open' | 'markRead' | 'markUnread'>
  >['items']
>(() => [
  {
    caption: 'Open in browser',
    iconSlot: 'open',
    onClick: () => window.open(props.link),
  },
  props.unread
    ? {
        caption: 'Mark as read',
        iconSlot: 'markRead',
        onClick: () => emit('markRead'),
      }
    : {
        caption: 'Mark as unread',
        iconSlot: 'markUnread',
        onClick: () => emit('markUnread'),
      },
]);

function ensureMarkRead() {
  if (props.active && props.unread) {
    emit('markRead');
  }
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
          [$style.active]: active,
          [$style.unread]: unread,
          [$style.open]: isContextMenuOpen,
        },
      ]"
      @click="(navigate($event), ensureMarkRead())">
      <span v-if="unread" :class="$style.dot"></span>
      <span :class="$style.title">{{ title || link }}</span>
    </a>
    <ContextMenu
      v-model:open="isContextMenuOpen"
      :reference-element="link"
      :items="contextMenuItems">
      <template #open><GlobeIcon /></template>
      <template #markRead><EyeIcon /></template>
      <template #markUnread><EyeOffIcon /></template>
    </ContextMenu>
  </RouterLink>
</template>

<style module lang="scss">
.link {
  align-items: center;
  border-radius: var(--small-radius);
  color: var(--text);
  column-gap: 0.5ch;
  display: flex;
  font-size: 0.875rem;
  padding: 6px 10px;
  text-decoration: none;
  &.unread {
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

.title {
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dot {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  padding: 0 0.5ch;
  &::after {
    background-color: var(--primary);
    border-radius: 50%;
    content: '';
    display: block;
    height: 5px;
    width: 5px;
  }
}
</style>
