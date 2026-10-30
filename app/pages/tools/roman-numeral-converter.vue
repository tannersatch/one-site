<script setup lang="ts">
import { decimalToRoman, romanToDecimal } from "~/utils/romanNumerals";

definePageMeta({
  title: "Roman Numeral Converter",
});

useSeoMeta({
  title: "Roman Numeral Converter | Dev Tools",
  description:
    "Convert whole numbers to Roman numerals and back, from 1 to 3999.",
});

const decimalValue = ref("2026");
const romanValue = ref(decimalToRoman(decimalValue.value));
const errorMessage = ref("");
const copiedField = ref<string | null>(null);
const toast = useToast();
let copyTimer: ReturnType<typeof setTimeout> | undefined;
const examples = [4, 9, 42, 99, 2026, 3999].map(value => ({
  decimal: String(value),
  roman: decimalToRoman(String(value)),
}));
const symbols = [
  { roman: "I", value: 1 },
  { roman: "V", value: 5 },
  { roman: "X", value: 10 },
  { roman: "L", value: 50 },
  { roman: "C", value: 100 },
  { roman: "D", value: 500 },
  { roman: "M", value: 1000 },
];
const hasResult = computed(() =>
  !!decimalValue.value && !!romanValue.value && !errorMessage.value
);
const breakdown = computed(() =>
  hasResult.value
    ? (romanValue.value.match(/CM|CD|XC|XL|IX|IV|[MDCLXVI]/g) ?? []).map(
      roman => ({ roman, value: romanToDecimal(roman) }),
    )
    : []
);

function updateValue(value: string | number, field: "decimal" | "roman") {
  errorMessage.value = "";
  copiedField.value = null;
  if (field === "decimal") decimalValue.value = String(value);
  else romanValue.value = String(value).trim().toUpperCase();

  try {
    if (field === "decimal") {
      romanValue.value = decimalToRoman(decimalValue.value);
    } else decimalValue.value = romanToDecimal(romanValue.value);
  } catch (error) {
    if (field === "decimal") romanValue.value = "";
    else decimalValue.value = "";
    errorMessage.value = error instanceof Error
      ? error.message
      : "Unable to convert this value.";
  }
}

async function copyValue(value: string, field: string) {
  try {
    await navigator.clipboard.writeText(value);
    copiedField.value = field;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copiedField.value = null;
    }, 2000);
  } catch {
    toast.add({ title: "Couldn't copy to clipboard", color: "error" });
  }
}

function clear() {
  updateValue("", "decimal");
}

onBeforeUnmount(() => clearTimeout(copyTimer));
</script>

<template>
  <main class="numeral-tool">
    <header class="tool-heading">
      <div class="tool-title">
        <div class="tool-icon"><UIcon name="i-lucide-landmark" /></div>
        <div>
          <p class="tool-category">DEVELOPER TOOLS</p>
          <h1>Roman Numeral Converter</h1>
        </div>
      </div>
      <UBadge color="neutral" variant="subtle">1 &ndash; 3999</UBadge>
    </header>

    <div class="tool-toolbar">
      <h2>Conversion</h2><UButton
        icon="i-lucide-eraser"
        color="neutral"
        variant="ghost"
        @click="clear"
      >Clear</UButton>
    </div>

    <div class="conversion-grid">
      <section class="conversion-panel" aria-labelledby="decimal-label">
        <div class="panel-heading">
          <label id="decimal-label" for="decimal-input"
          >Decimal number</label><UTooltip text="Copy number"><UButton
              :icon="copiedField === 'decimal' ? 'i-lucide-check' : 'i-lucide-copy'"
              aria-label="Copy number"
              :disabled="!hasResult"
              color="neutral"
              variant="ghost"
              class="copy-button"
              @click="copyValue(decimalValue, 'decimal')"
            /></UTooltip>
        </div>
        <UInput
          id="decimal-input"
          :model-value="decimalValue"
          inputmode="numeric"
          placeholder="2026"
          autocomplete="off"
          :maxlength="32"
          :aria-invalid="!!errorMessage"
          :aria-describedby="errorMessage ? 'conversion-error' : undefined"
          class="conversion-input decimal-input"
          @update:model-value="updateValue($event, 'decimal')"
        />
        <p class="field-note">Whole numbers from 1 to 3999</p>
      </section>
      <div class="conversion-bridge" aria-hidden="true">
        <UIcon name="i-lucide-arrow-left-right" />
      </div>
      <section class="conversion-panel" aria-labelledby="roman-label">
        <div class="panel-heading">
          <label id="roman-label" for="roman-input"
          >Roman numeral</label><UTooltip text="Copy Roman numeral"><UButton
              :icon="copiedField === 'roman' ? 'i-lucide-check' : 'i-lucide-copy'"
              aria-label="Copy Roman numeral"
              :disabled="!hasResult"
              color="neutral"
              variant="ghost"
              class="copy-button"
              @click="copyValue(romanValue, 'roman')"
            /></UTooltip>
        </div>
        <UInput
          id="roman-input"
          :model-value="romanValue"
          placeholder="MMXXVI"
          autocomplete="off"
          autocapitalize="characters"
          :spellcheck="false"
          :maxlength="64"
          :aria-invalid="!!errorMessage"
          :aria-describedby="errorMessage ? 'conversion-error' : undefined"
          class="conversion-input roman-input"
          @update:model-value="updateValue($event, 'roman')"
        />
        <p class="field-note">Standard Roman notation</p>
      </section>
    </div>

    <div aria-live="polite" aria-atomic="true">
      <UAlert
        v-if="errorMessage"
        id="conversion-error"
        :title="errorMessage"
        color="error"
        variant="subtle"
        icon="i-lucide-circle-alert"
        class="conversion-error"
      />
    </div>

    <section class="examples-section" aria-labelledby="examples-title">
      <h2 id="examples-title">Quick values</h2>
      <div class="example-values">
        <UButton
          v-for="example in examples"
          :key="example.decimal"
          color="neutral"
          variant="outline"
          @click="updateValue(example.decimal, 'decimal')"
        ><span>{{ example.decimal }}</span><UIcon
            name="i-lucide-arrow-right"
          /><span>{{ example.roman }}</span></UButton>
      </div>
    </section>

    <section class="breakdown-section" aria-labelledby="breakdown-title">
      <div class="section-heading">
        <h2 id="breakdown-title">Breakdown</h2><UBadge
          v-if="hasResult"
          color="primary"
          variant="subtle"
        >{{ decimalValue }}</UBadge>
      </div>
      <div v-if="hasResult" class="breakdown-values">
        <template v-for="(part, index) in breakdown" :key="index"><span
            v-if="index"
            class="addition-sign"
            aria-hidden="true"
          >+</span><div class="numeral-part">
            <span>{{ part.roman }}</span><span>{{ part.value }}</span>
          </div></template>
      </div>
      <p v-else class="empty-state">No conversion</p>
    </section>

    <section class="reference-section" aria-labelledby="reference-title">
      <h2 id="reference-title">Roman symbols</h2>
      <dl class="symbol-reference">
        <div v-for="symbol in symbols" :key="symbol.roman">
          <dt>{{ symbol.roman }}</dt>
          <dd>{{ symbol.value }}</dd>
        </div>
      </dl>
    </section>
  </main>
</template>

<style scoped>
.numeral-tool {
  width: 100%;
  max-width: 1200px;
  min-width: 0;
  margin-inline: auto;
  padding: 0.5rem;
}
.tool-heading, .tool-title, .tool-toolbar, .panel-heading, .section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.tool-heading {
  flex-wrap: wrap;
  padding-bottom: 1.5rem;
}
.tool-title {
  justify-content: flex-start;
  min-width: 0;
  gap: 0.85rem;
}
.tool-icon {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  flex-shrink: 0;
  border: 1px solid var(--ui-border);
  border-radius: 0.5rem;
  background: var(--ui-bg-muted);
  color: var(--ui-primary);
}
.tool-icon .iconify {
  width: 1.4rem;
  height: 1.4rem;
}
.tool-category {
  margin-bottom: 0.2rem;
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--ui-text-muted);
}
h1 {
  font-size: 1.5rem;
  line-height: 1.25;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
h2 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.tool-toolbar {
  padding-block: 0.75rem;
  margin-bottom: 1.5rem;
  border-block: 1px solid var(--ui-border);
}
.conversion-grid {
  display: grid;
  gap: 0.75rem;
}
.conversion-panel {
  min-width: 0;
  padding: 1.25rem;
  border: 1px solid var(--ui-border);
  border-radius: 0.5rem;
  background: var(--ui-bg);
}
.panel-heading {
  margin-bottom: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
}
.copy-button {
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  justify-content: center;
}
.conversion-input {
  width: 100%;
}
.conversion-input :deep(input) {
  height: 4.5rem;
  font-family: var(--font-mono, monospace);
  font-size: 2rem;
  font-variant-numeric: tabular-nums;
  background: var(--ui-bg-muted);
}
.roman-input :deep(input) {
  font-size: 1.25rem;
}
.field-note {
  margin-top: 0.75rem;
  font-size: 0.75rem;
  color: var(--ui-text-muted);
}
.conversion-bridge {
  display: grid;
  place-items: center;
  color: var(--ui-text-muted);
}
.conversion-bridge .iconify {
  width: 1.25rem;
  height: 1.25rem;
  transform: rotate(90deg);
}
.conversion-error {
  margin-top: 1rem;
}
.examples-section {
  padding-block: 1.5rem;
}
.example-values {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.85rem;
}
.example-values .iconify {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--ui-text-muted);
}
.breakdown-section, .reference-section {
  padding-block: 1.5rem;
  border-top: 1px solid var(--ui-border);
}
.section-heading {
  min-height: 1.5rem;
  margin-bottom: 1rem;
}
.breakdown-values {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}
.numeral-part {
  display: grid;
  gap: 0.4rem;
  min-width: 3rem;
  padding: 0.75rem;
  border-left: 2px solid var(--ui-primary);
  background: var(--ui-bg-muted);
  font-family: var(--font-mono, monospace);
}
.numeral-part > span:first-child {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.numeral-part > span:last-child, .addition-sign, .empty-state {
  font-size: 0.8125rem;
  color: var(--ui-text-muted);
}
.symbol-reference {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}
.symbol-reference > div {
  padding-block: 0.75rem;
  border-bottom: 1px solid var(--ui-border);
}
.symbol-reference dt {
  font-family: var(--font-mono, monospace);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.symbol-reference dd {
  margin-top: 0.35rem;
  font-size: 0.8125rem;
  color: var(--ui-text-muted);
}
@media (min-width: 640px) {
  .conversion-grid {
    grid-template-columns: minmax(0, 1fr) 1.5rem minmax(0, 1fr);
    align-items: center;
  }
  .conversion-bridge .iconify {
    transform: none;
  }
  .symbol-reference {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }
  .roman-input :deep(input) {
    font-size: 1.5rem;
  }
}
@media (min-width: 1280px) {
  .numeral-tool {
    padding: 1rem;
  }
  h1 {
    font-size: 1.75rem;
  }
  .roman-input :deep(input) {
    font-size: 1.75rem;
  }
}
@media (max-width: 479px) {
  .numeral-tool {
    padding: 0;
  }
  h1 {
    font-size: 1.25rem;
  }
}
</style>
