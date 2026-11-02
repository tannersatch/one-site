<script setup lang="ts">
import { useRegisterSW } from "virtual:pwa-register/vue";

const { needRefresh, updateServiceWorker } = useRegisterSW({ immediate: true });
const updating = ref(false);
const toast = useToast();
let waitingWorker: ServiceWorker | null = null;

function reloadWhenActivated() {
  if (waitingWorker?.state !== "activated") return;
  waitingWorker.removeEventListener("statechange", reloadWhenActivated);
  window.location.reload();
}

async function applyUpdate() {
  if (updating.value) return;
  updating.value = true;
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    waitingWorker = registration?.waiting ?? null;
    if (!waitingWorker) {
      window.location.reload();
      return;
    }
    waitingWorker.addEventListener("statechange", reloadWhenActivated);
    await updateServiceWorker(true);
    reloadWhenActivated();
  } catch {
    waitingWorker?.removeEventListener("statechange", reloadWhenActivated);
    updating.value = false;
    toast.add({ title: "Unable to update Developer Tools", color: "error" });
  }
}

onBeforeUnmount(() =>
  waitingWorker?.removeEventListener("statechange", reloadWhenActivated)
);
</script>

<template>
  <UBanner
    v-if="needRefresh"
    title="A Developer Tools update is available."
    icon="i-lucide-refresh-cw"
    color="info"
    close
    :actions="[{
      label: 'Update',
      icon: 'i-lucide-refresh-cw',
      onClick: applyUpdate,
      disabled: updating,
    }]"
    @close="needRefresh = false"
  />
</template>
