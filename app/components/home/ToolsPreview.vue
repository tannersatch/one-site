<script setup lang="ts">
import { decimalToRoman } from "~/utils/romanNumerals";

const value = ref("2026");
const conversion = computed(() => {
  try {
    return { result: decimalToRoman(value.value), error: false };
  } catch {
    return { result: "", error: true };
  }
});
</script>

<template>
  <div class="tools-preview">
    <UIcon name="i-lucide-terminal" class="preview-mark" aria-hidden="true" />
    <div class="mini-converter">
      <label for="home-preview-number">DECIMAL</label>
      <div class="mini-conversion">
        <UInput
          id="home-preview-number"
          v-model="value"
          inputmode="numeric"
          autocomplete="off"
          :maxlength="8"
          :aria-invalid="conversion.error"
          :aria-describedby="conversion.error ? 'home-preview-error' : undefined"
          class="mini-input"
        /><UIcon name="i-lucide-arrow-right" aria-hidden="true" /><output
          for="home-preview-number"
          aria-live="polite"
        >{{ conversion.result || "-" }}</output>
      </div>
      <p v-if="conversion.error" id="home-preview-error" role="status">
        1 &ndash; 3999
      </p>
      <p v-else>ROMAN NUMERALS</p>
    </div>
  </div>
</template>

<style scoped>
.tools-preview {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  min-width: 0;
}
.preview-mark {
  width: 2rem;
  height: 2rem;
  color: var(--ui-primary);
}
.mini-converter {
  display: none;
}
@media (min-width: 900px) {
  .preview-mark {
    display: none;
  }
  .mini-converter {
    display: block;
    width: 100%;
    padding: 1.25rem;
    min-width: 0;
  }
  .mini-converter label, .mini-converter p {
    font-size: 0.55rem;
    font-weight: 600;
    color: var(--ui-text-muted);
  }
  .mini-converter p {
    margin-top: 0.75rem;
  }
  .mini-conversion {
    display: grid;
    grid-template-columns: 4.5rem 1rem minmax(0, 1fr);
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.6rem;
  }
  .mini-input {
    width: 100%;
  }
  .mini-input :deep(input) {
    font-family: var(--font-mono, monospace);
    font-size: 0.875rem;
  }
  .mini-conversion > .iconify {
    color: var(--ui-text-muted);
  }
  output {
    min-width: 0;
    font-family: var(--font-mono, monospace);
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.3;
    overflow-wrap: anywhere;
    color: var(--ui-primary);
  }
}
</style>
