<script setup lang="ts">
const props = withDefaults(
  defineProps<{ value: string; label?: string; disabled?: boolean }>(),
  {
    label: "Copy",
    disabled: false,
  },
);

const toast = useToast();
const copied = ref(false);
let copyTimer: ReturnType<typeof setTimeout> | undefined;

async function copy() {
  try {
    await navigator.clipboard.writeText(props.value);
    copied.value = true;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    toast.add({ title: "Couldn't copy to clipboard", color: "error" });
  }
}

watch(() => props.value, () => {
  clearTimeout(copyTimer);
  copied.value = false;
});
onBeforeUnmount(() => clearTimeout(copyTimer));
</script>

<template>
  <UTooltip :text="copied ? 'Copied' : label">
    <UButton
      type="button"
      :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
      :aria-label="label"
      :disabled="disabled || !value"
      color="neutral"
      variant="ghost"
      size="sm"
      class="copy-button"
      @click="copy"
    />
  </UTooltip>
</template>

<style scoped>
.copy-button {
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  justify-content: center;
}
</style>
