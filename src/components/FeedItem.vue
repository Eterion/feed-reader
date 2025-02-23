<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import type { ComponentProps } from 'vue-component-type-helpers';
import EyeIcon from './@icons/EyeIcon.vue';
import EyeOffIcon from './@icons/EyeOffIcon.vue';
import PencilIcon from './@icons/PencilIcon.vue';
import TrashIcon from './@icons/TrashIcon.vue';
import ContextMenu from './ContextMenu.vue';

const props = defineProps<{
  active?: boolean;
  id: string;
  name?: string;
  unreadCount: number;
  url: string;
}>();

const emit = defineEmits<{
  markRead: [];
  markUnread: [];
  remove: [];
  rename: [];
}>();

const to = computed(() => {
  return `/${props.id}`;
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
          [$style.unread]: unreadCount > 0,
          [$style.open]: isContextMenuOpen,
        },
      ]"
      @click="navigate">
      <span :class="$style.name">{{ name || url }}</span>
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
  align-items: center;
  border-radius: 6px;
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
    color: var(--text-on-primary-surface);
    background-color: var(--primary-surface);
  }
  &:not(.active).open,
  &:not(.active):hover {
    background-color: var(--hover-surface);
  }
}

.name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.count {
  flex-shrink: 0;
}
</style>
