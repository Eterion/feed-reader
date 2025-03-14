<script setup lang="ts">
import { formatDistance } from 'date-fns';
import RefreshIcon from './@icons/RefreshIcon.vue';

const props = defineProps<{
  date: Date;
  loading?: boolean;
}>();

defineEmits<{
  click: [event: Event];
}>();

const now = useNow();
const timesAgo = computed(() => {
  return formatDistance(props.date, now.value, {
    addSuffix: true,
    includeSeconds: false,
  });
});
</script>

<template>
  <button
    :class="$style.button"
    :disabled="loading"
    type="button"
    title="Click to refresh feeds"
    @click="$emit('click', $event)">
    <RefreshIcon v-if="loading" :class="$style.icon" />
    <span>{{ timesAgo }}</span>
  </button>
</template>

<style module lang="scss">
.button {
  align-items: center;
  background-color: transparent;
  border: none;
  border-radius: var(--small-radius);
  color: var(--light-text);
  column-gap: 6px;
  display: flex;
  font-size: 0.75rem;
  padding: 6px 10px;
  text-align: right;
  transition-duration: 200ms;
  transition-property: background-color, color;
  &:not([disabled]):hover {
    background-color: var(--hover-surface);
    color: var(--text);
    cursor: pointer;
  }
}

.icon {
  animation-duration: 1200ms;
  animation-iteration-count: infinite;
  animation-name: spin;
  animation-timing-function: linear;
  color: var(--primary);
  height: 16px;
  width: 16px;
}

@keyframes spin {
  from {
    rotate: 0deg;
  }
  to {
    rotate: 360deg;
  }
}
</style>
