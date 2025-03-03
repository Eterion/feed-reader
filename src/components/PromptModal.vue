<script setup lang="ts">
import { useEscapeStack } from '@/utils/useEscapeStack';
import type { Promisable } from 'type-fest';
import BaseButton from './BaseButton.vue';
import BaseModal from './BaseModal.vue';
import ButtonGroup from './ButtonGroup.vue';
import InputField from './InputField.vue';
import TextInput from './TextInput.vue';

const props = defineProps<{
  defaultValue?: string;
  message: string;
  onOk?: (value: string) => Promisable<unknown>;
  title?: string;
}>();

const emit = defineEmits<{
  hidden: [];
  hide: [];
  show: [];
  shown: [];
  cancel: [];
}>();

const visible = defineModel<boolean>('visible');
const modelValue = ref(props.defaultValue);
const isLoading = ref(false);

async function submitForm(event: Event) {
  event.preventDefault();
  if (modelValue.value) {
    try {
      isLoading.value = true;
      await props.onOk?.(modelValue.value);
    } finally {
      isLoading.value = false;
    }
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
    <form @submit="submitForm">
      <div :class="$style.main">
        <InputField :label="message" required>
          <TextInput v-model="modelValue" autofocus />
        </InputField>
      </div>
      <ButtonGroup>
        <BaseButton :loading="isLoading" primary submit>Ok</BaseButton>
        <BaseButton :disabled="isLoading" @click="$emit('cancel')">
          Cancel
        </BaseButton>
      </ButtonGroup>
    </form>
  </BaseModal>
</template>

<style module lang="scss">
.main {
  margin-bottom: 24px;
}
</style>
