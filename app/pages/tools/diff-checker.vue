<script setup lang="ts">
import CopyButton from "~/components/tools/CopyButton.vue";
import ToolPage from "~/components/tools/ToolPage.vue";
import ToolTextEditor from "~/components/tools/ToolTextEditor.vue";
import ToolToolbar from "~/components/tools/ToolToolbar.vue";
import { compareText } from "~/utils/textDiff";
import type {
  DiffMode,
  DiffWhitespace,
  TextDiffResult,
} from "~/utils/textDiff";

definePageMeta({ title: "Diff Checker" });
useSeoMeta({
  title: "Diff Checker | Dev Tools",
  description:
    "Compare text locally with line numbers, word changes, whitespace options, and unified patch output.",
});

const examples = {
  original: "name: One Site\nstatus: in progress\nversion: 1\n",
  modified:
    "name: One Site\nstatus: ready\nversion: 2\nfeature: diff checker\n",
};
const original = ref(examples.original);
const modified = ref(examples.modified);
const mode = ref<DiffMode>("lines");
const whitespace = ref<DiffWhitespace>("exact");
const ignoreCase = ref(false);
const comparing = ref(false);
const result = ref<{ diff: TextDiffResult | null; error: string }>({
  diff: null,
  error: "",
});
const modes = [{ label: "Lines", value: "lines", icon: "i-lucide-list" }, {
  label: "Words",
  value: "words",
  icon: "i-lucide-text-cursor-input",
}];
const whitespaceOptions = [{ label: "Exact spaces", value: "exact" }, {
  label: "Trim line edges",
  value: "trim",
}, { label: "Ignore spaces & tabs", value: "ignore" }];

onMounted(() => {
  watch(
    [original, modified, mode, whitespace, ignoreCase],
    ([before, after, view, spacing, caseInsensitive], _previous, onCleanup) => {
      result.value = { diff: null, error: "" };
      comparing.value = !!(before || after);
      if (!before && !after) return;
      const timer = setTimeout(() => {
        try {
          result.value = {
            diff: compareText(before, after, {
              mode: view,
              whitespace: spacing,
              ignoreCase: caseInsensitive,
            }),
            error: "",
          };
        } catch (error) {
          result.value = {
            diff: null,
            error: error instanceof Error
              ? error.message
              : "Unable to compare text.",
          };
        } finally {
          comparing.value = false;
        }
      }, 150);
      onCleanup(() => clearTimeout(timer));
    },
    { immediate: true, flush: "sync" },
  );
});

function clear() {
  original.value = "";
  modified.value = "";
}
function swap() {
  [original.value, modified.value] = [modified.value, original.value];
}
function loadExample() {
  original.value = examples.original;
  modified.value = examples.modified;
}
</script>

<template>
  <ToolPage
    title="Diff Checker"
    icon="i-lucide-git-compare-arrows"
    max-width="1400px"
  >
    <template v-if="original || modified" #status><UBadge
        :color="result.error ? 'error' : 'neutral'"
        variant="subtle"
      >{{
        comparing
        ? "Comparing"
        : result.error
        ? "Unable to compare"
        : result.diff?.hasChanges
        ? "Differences found"
        : result.diff
        ? "No differences"
        : "Ready"
      }}</UBadge></template>
    <ToolToolbar @clear="clear">
      <div class="diff-controls">
        <UTabs
          v-model="mode"
          :items="modes"
          :content="false"
          aria-label="Comparison mode"
          class="mode-control"
        /><UFormField label="Whitespace"><USelect
            id="diff-whitespace"
            v-model="whitespace"
            :items="whitespaceOptions"
            aria-label="Whitespace handling"
            class="whitespace-select"
          /></UFormField><UCheckbox
          id="diff-ignore-case"
          v-model="ignoreCase"
          label="Ignore case"
        />
      </div>
      <template #actions><UButton
          icon="i-lucide-arrow-left-right"
          color="neutral"
          variant="ghost"
          @click="swap"
        >Swap</UButton><UButton
          icon="i-lucide-flask-conical"
          color="neutral"
          variant="ghost"
          @click="loadExample"
        >Example</UButton></template>
    </ToolToolbar>
    <div aria-live="polite" aria-atomic="true">
      <UAlert
        v-if="result.error"
        id="diff-error"
        :title="result.error"
        color="error"
        variant="subtle"
        icon="i-lucide-circle-alert"
        class="diff-error"
      />
    </div>
    <div class="input-grid">
      <ToolTextEditor
        id="diff-original"
        v-model="original"
        label="Original"
        placeholder="Original text..."
      /><ToolTextEditor
        id="diff-modified"
        v-model="modified"
        label="Modified"
        placeholder="Modified text..."
      />
    </div>
    <section
      class="comparison-section"
      aria-labelledby="diff-result-title"
      :aria-busy="comparing"
    >
      <div class="result-heading">
        <h2 id="diff-result-title">Comparison</h2>
        <div class="result-actions">
          <template v-if="result.diff?.hasChanges"><UBadge
              color="success"
              variant="subtle"
            >+{{ result.diff.added }} {{
                mode === "lines" ? "lines" : "tokens"
              }}</UBadge><UBadge color="error" variant="subtle">-{{
                result.diff.removed
              }} {{
                mode === "lines" ? "lines" : "tokens"
              }}</UBadge></template><CopyButton
            :value="result.diff?.patch ?? ''"
            label="Copy patch"
          />
        </div>
      </div>
      <p v-if="comparing" class="empty-result" role="status">Comparing...</p>
      <p v-else-if="!result.diff" class="empty-result">
        {{ result.error ? "No comparison" : "No text to compare" }}
      </p>
      <p v-else-if="!result.diff.hasChanges" class="empty-result" role="status">
        No differences under the current settings.
      </p>
      <div
        v-else-if="mode === 'lines'"
        class="line-diff"
        role="table"
        aria-label="Line comparison"
      >
        <div class="line-labels" role="row">
          <span role="columnheader">Old</span><span role="columnheader"
          >New</span><span
            role="columnheader"
            aria-label="Change"
            class="change-heading"
          >+/-</span><span role="columnheader">Compared text</span>
        </div>
        <div
          v-for="(line, index) in result.diff.lines"
          :key="index"
          class="diff-line"
          :class="`change-${line.kind}`"
          role="row"
        >
          <span class="line-number" role="cell">{{
            line.originalLine ?? ""
          }}</span><span class="line-number" role="cell">{{
            line.modifiedLine ?? ""
          }}</span><span
            class="change-marker"
            role="cell"
            :aria-label="line.kind"
          >{{
            line.kind === "added" ? "+" : line.kind === "removed" ? "-" : " "
          }}</span><div class="line-content" role="cell">
            <code>{{ line.value || " " }}</code><span
              v-if="line.missingNewline"
              class="newline-note"
            >
              No newline at end of file</span>
          </div>
        </div>
      </div>
      <div v-else class="word-diff">
        <template v-for="(part, index) in result.diff.parts" :key="index"><ins
            v-if="part.kind === 'added'"
          >{{ part.value }}</ins><del v-else-if="part.kind === 'removed'">{{
            part.value
          }}</del><span v-else>{{ part.value }}</span></template>
      </div>
    </section>
    <footer class="diff-footer">
      <span><UIcon name="i-lucide-lock-keyhole" />Local processing</span><span
      >CRLF normalized. Line numbers and patches refer to compared text.</span>
    </footer>
  </ToolPage>
</template>

<style scoped>
.diff-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.75rem;
  min-width: 0;
}
.mode-control {
  width: 12rem;
  max-width: 100%;
}
.diff-controls :deep(.whitespace-select) {
  width: 12rem;
}
.diff-controls :deep(#diff-ignore-case) {
  margin-bottom: 0.5rem;
}
.diff-error {
  margin-bottom: 1rem;
}
.input-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}
.comparison-section {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--ui-border);
  min-width: 0;
}
.result-heading, .result-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}
.result-heading {
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}
.result-heading h2 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.empty-result {
  padding-block: 1rem;
  font-size: 0.8125rem;
  color: var(--ui-text-muted);
}
.line-diff, .word-diff {
  max-height: 28rem;
  overflow: auto;
  border: 1px solid var(--ui-border);
  border-radius: 0.375rem;
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  line-height: 1.8;
}
.line-labels, .diff-line {
  display: grid;
  grid-template-columns: 3.25rem 3.25rem 1.5rem minmax(0, 1fr);
}
.line-labels {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--ui-bg-muted);
  border-bottom: 1px solid var(--ui-border);
  font-size: 0.6875rem;
  color: var(--ui-text-muted);
}
.line-labels > span {
  padding: 0.5rem 0.3rem;
}
.line-labels .change-heading {
  padding-inline: 0;
  text-align: center;
}
.line-number {
  padding-inline: 0.4rem;
  text-align: right;
  color: var(--ui-text-muted);
  border-right: 1px solid var(--ui-border);
  user-select: none;
}
.change-marker {
  text-align: center;
  user-select: none;
}
.line-content {
  min-width: 0;
  padding-inline: 0.5rem;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  tab-size: 4;
}
.change-added, .word-diff ins {
  background: color-mix(in srgb, var(--ui-success) 12%, var(--ui-bg));
}
.change-removed, .word-diff del {
  background: color-mix(in srgb, var(--ui-error) 12%, var(--ui-bg));
}
.change-added .change-marker {
  color: var(--ui-success);
}
.change-removed .change-marker {
  color: var(--ui-error);
}
.newline-note {
  font-size: 0.6875rem;
  font-style: italic;
  color: var(--ui-text-muted);
}
.word-diff {
  padding: 1rem;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.word-diff ins {
  text-decoration: underline;
  text-underline-offset: 0.15em;
}
.word-diff del {
  text-decoration: line-through;
}
.diff-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1rem;
  font-size: 0.6875rem;
  color: var(--ui-text-muted);
}
.diff-footer > span:first-child {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
@media (min-width: 900px) {
  .input-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 479px) {
  .diff-controls, .mode-control {
    width: 100%;
  }
}
</style>
