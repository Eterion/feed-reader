<script setup lang="ts">
import BaseButton from './BaseButton.vue';
import LastCheckedOn from './LastCheckedOn.vue';
import ThemeToggle from './ThemeToggle.vue';

defineProps<{
  lastCheckedOn?: Date;
  loading?: boolean;
}>();

defineEmits<{
  newFeed: [];
  refresh: [event: Event];
}>();
</script>

<template>
  <header :class="$style.el">
    <BaseButton @click="$emit('newFeed')">New Feed</BaseButton>
    <ul :class="$style.buttons">
      <li v-if="lastCheckedOn">
        <LastCheckedOn
          :date="lastCheckedOn"
          :loading="loading"
          @click="$emit('refresh', $event)" />
      </li>
      <li>
        <ThemeToggle />
      </li>
    </ul>
  </header>
</template>

<style module lang="scss">
.el {
  align-items: center;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  padding: 12px;
}

.buttons {
  align-items: center;
  column-gap: 6px;
  display: flex;
  list-style: none;
  padding: 0;
}
</style>
