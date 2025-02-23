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
  border: none;
  color: var(--light-text);
  cursor: pointer;
  display: flex;
  height: 36px;
  justify-content: center;
  width: 36px;
  :where(svg) {
    height: 18px;
    width: 18px;
  }
}
</style>
