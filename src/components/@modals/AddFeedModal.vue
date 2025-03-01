<script setup lang="ts">
import { ref } from 'vue';
import BaseModal from '../BaseModal.vue';

const props = defineProps<{
  onSubmit?: (url: string) => PromiseLike<unknown>;
}>();

const visible = defineModel<boolean>('visible');
const url = ref<string>();

async function handleSubmit(event: Event) {
  event.preventDefault();
  if (!url.value) return;
  await props.onSubmit?.(url.value);
}
</script>

<template>
  <BaseModal v-model:visible="visible" title="Add Feed">
    <form @submit="handleSubmit">
      <input v-model="url" type="text" required />
      <button type="submit">Ok</button>
    </form>
  </BaseModal>
</template>
