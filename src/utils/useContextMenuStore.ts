import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useContextMenuStore = defineStore('contextMenu', () => {
  const activeInstances = ref<{ id: string; close: () => unknown }[]>([]);
  return { activeInstances };
});
