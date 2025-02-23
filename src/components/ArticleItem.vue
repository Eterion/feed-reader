<script setup lang="ts">
import { computed } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

const props = defineProps<{
  active?: boolean;
  link: string;
  selected?: boolean;
  title?: string;
  unread?: boolean;
}>();

defineEmits<{
  markUnread: [];
}>();

const to = computed<RouteLocationRaw>(() => ({
  params: {
    articleLink: props.link,
  },
}));
</script>

<template>
  <RouterLink
    :to="to"
    :class="[
      $style.link,
      {
        [$style.active]: active,
        [$style.unread]: unread,
      },
    ]">
    <span :class="$style.title">{{ title || link }}</span>
    <span v-if="unread" :class="$style.dot"></span>
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
