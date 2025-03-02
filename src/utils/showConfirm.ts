import ConfirmModal from '@/components/ConfirmModal.vue';
import type { Promisable } from 'type-fest';
import { showAlert } from './showAlert';

export function showConfirm(
  message: string,
  {
    onOk,
    title,
  }: {
    onOk?: () => Promisable<unknown>;
    title?: string;
  } = {},
) {
  return new Promise<boolean>((resolve) => {
    const el = document.createElement('div');
    const app = createApp({
      setup() {
        const visible = ref(false);
        onMounted(() => {
          visible.value = true;
        });
        return () =>
          h(ConfirmModal, {
            message,
            title,
            visible: visible.value,
            onOk: async () => {
              try {
                await onOk?.();
                resolve(true);
                visible.value = false;
              } catch (e) {
                showAlert(e);
              }
            },
            onCancel: () => {
              resolve(false);
              visible.value = false;
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
