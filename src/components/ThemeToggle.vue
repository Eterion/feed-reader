<script setup lang="ts">
import { useDark } from '@vueuse/core';
import MoonIcon from './@icons/MoonIcon.vue';
import SunIcon from './@icons/SunIcon.vue';

const isDark = useDark();
</script>

<template>
  <button type="button" :class="$style.el" @click="isDark = !isDark">
    <Transition>
      <MoonIcon v-if="isDark" />
      <SunIcon v-else />
    </Transition>
  </button>
</template>

<style module lang="scss">
.el {
  align-items: center;
  background-color: transparent;
  border-radius: 6px;
  border: none;
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
