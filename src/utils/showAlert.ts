import AlertModal from '@/components/AlertModal.vue';
import { isString } from 'es-toolkit';
import type { Promisable } from 'type-fest';

export function showAlert(
  message: unknown,
  {
    onOk,
    title,
  }: {
    onOk?: () => Promisable<unknown>;
    title?: string;
  } = {},
) {
  return new Promise<void>((resolve) => {
    const el = document.createElement('div');
    const app = createApp({
      setup() {
        const visible = ref(false);
        onMounted(() => {
          visible.value = true;
        });
        return () =>
          h(AlertModal, {
            message: messageFromUnknown(message),
            title,
            visible: visible.value,
            onOk: async () => {
              try {
                await onOk?.();
                resolve();
                visible.value = false;
              } catch (e) {
                showAlert(e);
              }
            },
            onHidden: () => {
              app.unmount();
              el.remove();
            },
          });
      },
    });
    document.body.appendChild(el);
    app.mount(el);
  });
}

function messageFromUnknown(value: unknown) {
  if (isString(value)) return value;
  if (value instanceof Error) return value.message;
  return JSON.stringify(value);
}
