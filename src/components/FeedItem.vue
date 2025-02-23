<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  active?: boolean;
  id: string;
  name?: string;
  unreadCount: number;
  url: string;
}>();

defineEmits<{
  markRead: [];
  markUnread: [];
  remove: [];
  rename: [];
}>();

const to = computed(() => {
  return `/${props.id}`;
});
</script>

<template>
  <RouterLink
    :to="to"
    :class="[
      $style.link,
      {
        [$style.active]: active,
        [$style.unread]: unreadCount > 0,
      },
    ]">
    <span :class="$style.name">{{ name || url }}</span>
    <span :class="$style.count" v-if="unreadCount">({{ unreadCount }})</span>
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
