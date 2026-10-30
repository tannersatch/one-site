<script setup lang="ts">
import CopyButton from "~/components/tools/CopyButton.vue";
import GradientColorInput from "~/components/tools/GradientColorInput.vue";
import ToolPage from "~/components/tools/ToolPage.vue";
import ToolToolbar from "~/components/tools/ToolToolbar.vue";
import { contrastRatio, contrastResults } from "~/utils/colorContrast";

definePageMeta({ title: "Color Contrast Checker" });
useSeoMeta({
  title: "Color Contrast Checker | Dev Tools",
  description:
    "Check text and background colors against WCAG AA and AAA contrast thresholds.",
});

const foreground = ref("#172554");
const background = ref("#ffffff");
const largeText = ref(false);
const result = computed(() => {
  try {
    const ratio = contrastRatio(foreground.value, background.value);
    return { ...contrastResults(ratio), error: "" };
  } catch (reason) {
    return {
      ratio: 0,
      aaNormal: false,
      aaLarge: false,
      aaaNormal: false,
      aaaLarge: false,
      error: reason instanceof Error
        ? reason.message
        : "Enter valid hex colors.",
    };
  }
});
const selectedAa = computed(() =>
  largeText.value ? result.value.aaLarge : result.value.aaNormal
);
const selectedAaa = computed(() =>
  largeText.value ? result.value.aaaLarge : result.value.aaaNormal
);
function clear() {
  foreground.value = "#172554";
  background.value = "#ffffff";
  largeText.value = false;
}
function swap() {
  [foreground.value, background.value] = [background.value, foreground.value];
}
</script>

<template>
  <ToolPage title="Color Contrast Checker" icon="i-lucide-contrast">
    <template #status><UBadge
        :color="result.error ? 'error' : selectedAa ? 'success' : 'warning'"
        variant="subtle"
      >{{
        result.error ? "Invalid colors" : selectedAa ? "AA pass" : "AA fail"
      }}</UBadge></template>
    <ToolToolbar @clear="clear">
      <UCheckbox
        v-model="largeText"
        label="Evaluate as large text (18pt / 14pt bold)"
      />
      <template #actions><UButton
          icon="i-lucide-arrow-left-right"
          color="neutral"
          variant="ghost"
          @click="swap"
        >Swap colors</UButton></template>
    </ToolToolbar>
    <UAlert
      v-if="result.error"
      :title="result.error"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      class="tool-error"
    />
    <div class="contrast-layout">
      <section class="color-controls" aria-label="Text and background colors">
        <div class="color-field">
          <label for="contrast-foreground">Text color</label><GradientColorInput
            id="contrast-foreground"
            v-model="foreground"
            label="text color"
          />
        </div>
        <div class="color-field">
          <label for="contrast-background"
          >Background color</label><GradientColorInput
            id="contrast-background"
            v-model="background"
            label="background color"
          />
        </div>
      </section>
      <section
        class="preview"
        :style="{ color: foreground, backgroundColor: background }"
        aria-label="Text contrast preview"
      >
        <span class="preview-label">Preview</span>
        <p>The quick brown fox jumps over the lazy dog.</p>
        <strong>Large bold text sample</strong>
      </section>
      <section class="results" aria-labelledby="contrast-results-title">
        <div class="ratio-row">
          <div>
            <h2 id="contrast-results-title">Contrast ratio</h2><strong>{{
              result.error ? "-" : `${result.ratio}:1`
            }}</strong>
          </div><CopyButton
            :value="result.error ? '' : `${result.ratio}:1`"
            label="Copy contrast ratio"
          />
        </div>
        <div class="standard-row">
          <span>WCAG AA · normal text</span><UBadge
            :color="result.aaNormal ? 'success' : 'error'"
            variant="subtle"
          >{{ result.aaNormal ? "Pass" : "Fail" }}</UBadge>
        </div>
        <div class="standard-row">
          <span>WCAG AA · large text</span><UBadge
            :color="result.aaLarge ? 'success' : 'error'"
            variant="subtle"
          >{{ result.aaLarge ? "Pass" : "Fail" }}</UBadge>
        </div>
        <div class="standard-row">
          <span>WCAG AAA · normal text</span><UBadge
            :color="result.aaaNormal ? 'success' : 'error'"
            variant="subtle"
          >{{ result.aaaNormal ? "Pass" : "Fail" }}</UBadge>
        </div>
        <div class="standard-row">
          <span>WCAG AAA · large text</span><UBadge
            :color="result.aaaLarge ? 'success' : 'error'"
            variant="subtle"
          >{{ result.aaaLarge ? "Pass" : "Fail" }}</UBadge>
        </div>
      </section>
    </div>
    <p class="privacy-note">
      <UIcon name="i-lucide-info" />WCAG contrast calculations use opaque sRGB
      hex colors. Large text is at least 18pt regular or 14pt bold.
    </p>
  </ToolPage>
</template>

<style scoped>
.tool-error {
  margin-bottom: 1rem;
}
.contrast-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.25rem;
}
.color-controls {
  display: grid;
  gap: 1rem;
}
.color-field {
  display: grid;
  gap: 0.5rem;
}
.color-field label {
  color: var(--ui-text-muted);
  font-size: 0.8125rem;
}
.preview {
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 0.75rem;
  min-height: 14rem;
  padding: 1.5rem;
  border: 1px solid var(--ui-border);
  border-radius: 0.5rem;
  text-align: center;
}
.preview-label {
  color: inherit;
  opacity: 0.7;
  font-size: 0.7rem;
  text-transform: uppercase;
}
.preview p {
  margin: 0;
  font-size: 1.125rem;
}
.preview strong {
  font-size: 1.5rem;
}
.results {
  padding-block: 0.5rem;
  border-top: 1px solid var(--ui-border);
}
.ratio-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 0.75rem 1rem;
  border-bottom: 1px solid var(--ui-border);
}
.ratio-row h2 {
  color: var(--ui-text-muted);
  font-size: 0.75rem;
  font-weight: 500;
}
.ratio-row strong {
  display: block;
  margin-top: 0.25rem;
  font-size: 1.75rem;
  font-variant-numeric: tabular-nums;
  color: var(--ui-text-highlighted);
}
.standard-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 0.8rem;
  border-bottom: 1px solid var(--ui-border);
  font-size: 0.8125rem;
}
.privacy-note {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  color: var(--ui-text-muted);
  font-size: 0.75rem;
}
.privacy-note :deep(.iconify) {
  flex-shrink: 0;
}
@media (min-width: 800px) {
  .contrast-layout {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    align-items: start;
  }
  .color-controls {
    grid-column: 1;
  }
  .preview {
    grid-column: 2;
    grid-row: 1;
  }
  .results {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0 1.25rem;
  }
  .ratio-row {
    grid-column: 1 / -1;
  }
}
</style>
