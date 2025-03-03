<script setup lang="ts">
import { useEscapeStack } from '@/utils/useEscapeStack';
import type { Promisable } from 'type-fest';
import BaseButton from './BaseButton.vue';
import BaseModal from './BaseModal.vue';
import ButtonGroup from './ButtonGroup.vue';
import MarkdownText from './MarkdownText.vue';

const props = defineProps<{
  danger?: boolean;
  message: string;
  onOk?: () => Promisable<unknown>;
  title?: string;
}>();

const emit = defineEmits<{
  cancel: [];
  hidden: [];
  hide: [];
  show: [];
  shown: [];
}>();

const visible = defineModel<boolean>('visible');
const isLoading = ref(false);

async function onOk() {
  try {
    isLoading.value = true;
    await props.onOk?.();
  } finally {
    isLoading.value = false;
  }
}

function onEscape() {
  emit('cancel');
  visible.value = false;
}

useEscapeStack(visible, onEscape);
</script>

<template>
  <BaseModal
    v-model:visible="visible"
    :title="title"
    :width="460"
    @hidden="$emit('hidden')"
    @hide="$emit('hide')"
    @show="$emit('show')"
    @shown="$emit('shown')">
    <MarkdownText :class="$style.main" :markdown="message" />
    <ButtonGroup>
      <BaseButton
        :loading="isLoading"
        :primary="!danger"
        :danger="danger"
        @click="onOk">
        Ok
      </BaseButton>
      <BaseButton :disabled="isLoading" @click="$emit('cancel')">
        Cancel
      </BaseButton>
    </ButtonGroup>
  </BaseModal>
</template>

<style module lang="scss">
.main {
  margin-bottom: 24px;
}
</style>
