<script setup lang="ts">
import BaseModal from './BaseModal.vue';

const props = defineProps<{
  defaultValue?: string;
  message: string;
  onOk?: (value: string) => PromiseLike<unknown>;
}>();

defineEmits<{
  hidden: [];
  hide: [];
  show: [];
  shown: [];
  cancel: [];
}>();

const visible = defineModel<boolean>('visible');
const value = ref(props.defaultValue);
const isLoading = ref(false);

async function submitForm(event: Event) {
  event.preventDefault();
  if (value.value) {
    try {
      isLoading.value = true;
      await props.onOk?.(value.value);
    } finally {
      isLoading.value = false;
    }
  }
}
</script>

<template>
  <BaseModal
    v-model:visible="visible"
    :width="460"
    @hidden="$emit('hidden')"
    @hide="$emit('hide')"
    @show="$emit('show')"
    @shown="$emit('shown')">
    <form @submit="submitForm">
      <p>{{ message }}</p>
      <input v-model="value" type="text" required />
      <button :disabled="isLoading" type="submit">Ok</button>
      <button :disabled="isLoading" type="button" @click="$emit('cancel')">
        Cancel
      </button>
    </form>
  </BaseModal>
</template>
