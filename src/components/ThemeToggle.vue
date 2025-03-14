<script setup lang="ts">
import MoonIcon from './@icons/MoonIcon.vue';
import SunIcon from './@icons/SunIcon.vue';

const isDark = useDark();
</script>

<template>
  <button type="button" :class="$style.el" @click="isDark = !isDark">
    <MoonIcon v-if="isDark" />
    <SunIcon v-else />
  </button>
</template>

<style module lang="scss">
.el {
  align-items: center;
  background-color: transparent;
  border: none;
  border-radius: var(--small-radius);
  color: var(--light-text);
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding: 6px;
  &:hover {
    background-color: var(--hover-surface);
    color: var(--text);
  }
  :where(svg) {
    height: 1rem;
    width: 1rem;
  }
}
</style>
