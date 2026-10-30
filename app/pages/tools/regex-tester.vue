<script setup lang="ts">
import CopyButton from "~/components/tools/CopyButton.vue";
import ToolPage from "~/components/tools/ToolPage.vue";
import ToolTextEditor from "~/components/tools/ToolTextEditor.vue";
import ToolToolbar from "~/components/tools/ToolToolbar.vue";
import {
  regexFlags,
  regexSegments,
  validateRegexRequest,
} from "~/utils/regexTester";
import type { RegexResponse, RegexResult } from "~/utils/regexTester";

definePageMeta({ title: "Regex Tester" });
useSeoMeta({
  title: "Regex Tester | Dev Tools",
  description:
    "Test JavaScript regular expressions locally with highlighted matches, capture groups, flags, and a worker timeout.",
});

const example = {
  pattern: "(?<word>[A-Za-z]+)",
  text: "Hello, world!\nRegex works across lines.",
};
const pattern = ref(example.pattern);
const text = ref(example.text);
const selectedFlags = ref<string[]>(["g"]);
const flags = computed(() =>
  regexFlags.filter(flag => selectedFlags.value.includes(flag.value)).map(
    flag => flag.value,
  ).join("")
);
const retry = ref(0);
const testing = ref(false);
const result = ref<RegexResult | null>(null);
const errorMessage = ref("");
const segments = computed(() =>
  result.value ? regexSegments(text.value, result.value.matches) : []
);
const matchJson = computed(() =>
  result.value ? JSON.stringify(result.value.matches, null, 2) : ""
);
const matchLabel = computed(() =>
  result.value
    ? `${result.value.matches.length}${result.value.truncated ? "+" : ""} ${
      result.value.matches.length === 1 && !result.value.truncated
        ? "match"
        : "matches"
    }`
    : "Ready"
);

function toggleFlag(value: string, checked: boolean | "indeterminate") {
  selectedFlags.value = selectedFlags.value.filter(flag =>
    flag !== value
    && !(checked === true
      && ((value === "u" && flag === "v") || (value === "v" && flag === "u")))
  );
  if (checked === true) selectedFlags.value.push(value);
}

onMounted(() => {
  watch(
    [pattern, text, flags, retry],
    ([expression, subject, modifiers], _previous, onCleanup) => {
      result.value = null;
      errorMessage.value = "";
      testing.value = !!expression;
      if (!expression) return;
      try {
        validateRegexRequest({
          pattern: expression,
          text: subject,
          flags: modifiers,
        });
      } catch (error) {
        testing.value = false;
        errorMessage.value = error instanceof Error
          ? error.message
          : "Unable to evaluate expression.";
        return;
      }

      let active = true;
      let worker: Worker | undefined;
      let timeout: ReturnType<typeof setTimeout> | undefined;
      const stop = () => {
        clearTimeout(timeout);
        worker?.terminate();
        worker = undefined;
      };
      const finish = (response: RegexResponse) => {
        if (!active) return;
        active = false;
        stop();
        testing.value = false;
        if (response.error !== undefined) errorMessage.value = response.error;
        else result.value = response.result;
      };
      const debounce = setTimeout(() => {
        try {
          worker = new Worker(
            new URL("../../workers/regex.worker.ts", import.meta.url),
            { type: "module" },
          );
          worker.onmessage = (event: MessageEvent<RegexResponse>) =>
            finish(event.data);
          worker.onerror = event => {
            event.preventDefault();
            finish({
              error:
                "The regex worker failed. Try running the expression again.",
            });
          };
          timeout = setTimeout(() =>
            finish({
              error:
                "Pattern exceeded the 1-second limit. Try a simpler expression.",
            }), 1000);
          worker.postMessage({
            pattern: expression,
            text: subject,
            flags: modifiers,
          });
        } catch (error) {
          finish({
            error: error instanceof Error
              ? error.message
              : "Web Workers are required to test expressions safely.",
          });
        }
      }, 150);
      onCleanup(() => {
        active = false;
        clearTimeout(debounce);
        stop();
      });
    },
    { immediate: true, flush: "sync" },
  );
});

function clear() {
  pattern.value = "";
  text.value = "";
}
function loadExample() {
  pattern.value = example.pattern;
  text.value = example.text;
  selectedFlags.value = ["g"];
  retry.value++;
}
</script>

<template>
  <ToolPage title="Regex Tester" icon="i-lucide-regex" max-width="1400px">
    <template v-if="pattern" #status><UBadge
        :color="errorMessage ? 'error' : 'neutral'"
        variant="subtle"
      >{{
        testing ? "Testing" : errorMessage ? "Unable to test" : matchLabel
      }}</UBadge></template>
    <section class="pattern-section">
      <UFormField label="Pattern"><div class="pattern-row">
          <code aria-hidden="true">/</code><UInput
            id="regex-pattern"
            v-model="pattern"
            autocomplete="off"
            autocapitalize="off"
            :spellcheck="false"
            placeholder="[A-Za-z]+"
            class="pattern-input"
            :aria-invalid="!!errorMessage"
            :aria-describedby="errorMessage ? 'regex-error' : undefined"
          /><code class="pattern-flags">/{{ flags }}</code>
        </div></UFormField>
    </section>
    <ToolToolbar @clear="clear">
      <fieldset class="flag-field">
        <legend>Flags</legend>
        <div class="flag-list">
          <UTooltip
            v-for="flag in regexFlags"
            :key="flag.value"
            :text="flag.description"
          ><UCheckbox
              :id="`regex-flag-${flag.value}`"
              :model-value="selectedFlags.includes(flag.value)"
              :label="flag.value"
              :aria-label="flag.label"
              @update:model-value="toggleFlag(flag.value, $event)"
            /></UTooltip>
        </div>
      </fieldset>
      <template #actions><UButton
          icon="i-lucide-play"
          color="neutral"
          variant="ghost"
          :disabled="!pattern"
          :loading="testing"
          @click="retry++"
        >Run</UButton><UButton
          icon="i-lucide-flask-conical"
          color="neutral"
          variant="ghost"
          @click="loadExample"
        >Example</UButton></template>
    </ToolToolbar>
    <div aria-live="polite" aria-atomic="true">
      <UAlert
        v-if="errorMessage"
        id="regex-error"
        :title="errorMessage"
        color="error"
        variant="subtle"
        icon="i-lucide-circle-alert"
        class="regex-alert"
      /><UAlert
        v-else-if="result?.truncated"
        title="Result limit reached"
        :description="`Showing ${result.matches.length} matches within the display and capture limits.`"
        color="warning"
        variant="subtle"
        icon="i-lucide-triangle-alert"
        class="regex-alert"
      />
    </div>
    <div class="regex-workspace" :aria-busy="testing">
      <ToolTextEditor
        id="regex-text"
        v-model="text"
        label="Test text"
        placeholder="Text to match..."
      />
      <section class="highlight-panel" aria-labelledby="regex-highlight-title">
        <div class="highlight-heading">
          <h2 id="regex-highlight-title">Highlighted matches</h2><UBadge
            color="neutral"
            variant="soft"
            size="sm"
          >{{ testing ? "Testing" : result ? matchLabel : "-" }}</UBadge>
        </div>
        <div v-if="result" id="regex-highlight" class="highlight-text">
          <template v-for="(part, index) in segments" :key="index"><mark
              v-if="part.matched"
              :class="{ 'empty-match': part.empty }"
              :title="`Match ${part.number}${part.empty ? ' (zero length)' : ''}`"
              :aria-label="part.empty ? 'Zero-length match' : undefined"
            >{{ part.text }}</mark><span v-else>{{
              part.text
            }}</span></template>
        </div>
        <div v-else id="regex-highlight" class="highlight-text empty-state">
          {{
            testing ? "Testing..." : errorMessage ? "No result" : "No expression"
          }}
        </div>
      </section>
    </div>
    <section class="match-section" aria-labelledby="regex-matches-title">
      <div class="match-heading">
        <h2 id="regex-matches-title">Match details</h2><CopyButton
          :value="matchJson"
          label="Copy matches JSON"
        />
      </div>
      <div v-if="result?.matches.length" class="match-list">
        <details
          v-for="(match, index) in result.matches"
          :key="index"
          :open="index === 0"
        >
          <summary>
            <span>Match {{ index + 1 }}</span><code>{{ match.index }} - {{
                match.end
              }}</code>
          </summary>
          <div class="match-content">
            <pre>{{ match.value || '(empty)' }}</pre>
            <dl v-if="match.groups.length" class="capture-list">
              <div v-for="group in match.groups" :key="group.number">
                <dt>Group {{ group.number }}</dt>
                <dd>
                  <code>{{
                    group.value === null
                    ? "Unmatched"
                    : group.value === ""
                    ? "(empty)"
                    : group.value
                  }}</code><span
                    v-if="group.start !== null"
                    class="capture-offset"
                  >{{ group.start }} - {{ group.end }}</span>
                </dd>
              </div>
            </dl>
            <dl
              v-if="Object.keys(match.namedGroups).length"
              class="capture-list"
            >
              <div v-for="(value, name) in match.namedGroups" :key="name">
                <dt>{{ name }}</dt>
                <dd>
                  <code>{{
                    value === null ? "Unmatched" : value === "" ? "(empty)" : value
                  }}</code>
                </dd>
              </div>
            </dl>
          </div>
        </details>
      </div>
      <p v-else class="empty-state">
        {{
          testing
          ? "Testing..."
          : result
          ? result.truncated ? "Matches exceed display limits" : "No matches"
          : "No match data"
        }}
      </p>
    </section>
    <footer class="regex-footer">
      <span><UIcon name="i-lucide-lock-keyhole" />Local processing in a
        worker</span><span>JavaScript RegExp &middot; UTF-16 offsets &middot;
        1-second limit</span>
    </footer>
  </ToolPage>
</template>

<style scoped>
.pattern-section {
  margin-bottom: 1.25rem;
}
.pattern-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}
.pattern-row > code {
  flex-shrink: 0;
  color: var(--ui-text-muted);
}
.pattern-input {
  flex: 1;
  min-width: 0;
}
.pattern-input :deep(input) {
  height: 3rem;
  font-family: var(--font-mono, monospace);
}
.pattern-flags {
  min-width: 0.5rem;
  font-size: 0.8125rem;
}
.flag-field {
  min-width: 0;
}
.flag-field legend {
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--ui-text-muted);
}
.flag-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}
.regex-alert {
  margin-bottom: 1rem;
}
.regex-alert :deep([data-slot="title"]) {
  overflow-wrap: anywhere;
}
.regex-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}
.highlight-panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--ui-border);
  border-radius: 0.5rem;
  background: var(--ui-bg);
}
.highlight-heading, .match-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}
.highlight-heading {
  min-height: 3.3rem;
  padding: 0.65rem 1rem;
  border-bottom: 1px solid var(--ui-border);
  background: var(--ui-bg-muted);
}
h2 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.highlight-text {
  height: 22rem;
  padding: 1rem;
  overflow: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-family: var(--font-mono, monospace);
  font-size: 0.8125rem;
  line-height: 1.7;
}
.highlight-text mark {
  padding: 0.1rem 0;
  background: color-mix(in srgb, var(--ui-primary) 20%, transparent);
  color: var(--ui-text-highlighted);
  border-bottom: 1px solid var(--ui-primary);
}
.highlight-text .empty-match {
  display: inline-block;
  width: 0;
  height: 1em;
  padding: 0;
  border: 0;
  border-left: 2px solid var(--ui-warning);
  vertical-align: text-bottom;
}
.match-section {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--ui-border);
}
.match-heading {
  margin-bottom: 0.75rem;
}
.match-list {
  max-height: 30rem;
  overflow: auto;
  border: 1px solid var(--ui-border);
  border-radius: 0.375rem;
}
.match-list details + details {
  border-top: 1px solid var(--ui-border);
}
.match-list summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: 0.8125rem;
  background: var(--ui-bg-muted);
}
.match-list summary code, .capture-offset {
  font-size: 0.6875rem;
  color: var(--ui-text-muted);
}
.match-content {
  padding: 1rem;
}
.match-content pre {
  max-height: 12rem;
  overflow: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-size: 0.8125rem;
}
.capture-list {
  margin-top: 0.75rem;
}
.capture-list > div {
  display: grid;
  grid-template-columns: minmax(4rem, 1fr) minmax(0, 3fr);
  gap: 0.75rem;
  padding-block: 0.4rem;
  border-top: 1px solid var(--ui-border);
  font-size: 0.75rem;
}
.capture-list dt {
  min-width: 0;
  overflow-wrap: anywhere;
  color: var(--ui-text-muted);
}
.capture-list dd {
  min-width: 0;
  overflow-wrap: anywhere;
}
.capture-offset {
  display: block;
  margin-top: 0.2rem;
}
.empty-state {
  padding: 1rem;
  font-size: 0.8125rem;
  color: var(--ui-text-muted);
}
.regex-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1rem;
  font-size: 0.6875rem;
  color: var(--ui-text-muted);
}
.regex-footer > span:first-child {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
@media (min-width: 900px) {
  .regex-workspace {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 639px) {
  .highlight-text {
    height: 16rem;
  }
}
</style>
