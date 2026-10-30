<script setup lang="ts">
import ToolPage from "~/components/tools/ToolPage.vue";
import ToolTextEditor from "~/components/tools/ToolTextEditor.vue";
import ToolToolbar from "~/components/tools/ToolToolbar.vue";
import { formatSql, sqlDialects, sqlExamples } from "~/utils/sqlFormatter";
import type {
  SqlDialect,
  SqlIndentation,
  SqlKeywordCase,
} from "~/utils/sqlFormatter";

definePageMeta({ title: "SQL Formatter" });
useSeoMeta({
  title: "SQL Formatter | Dev Tools",
  description:
    "Format SQL locally with dialect, keyword case, and indentation options.",
});

const dialect = ref<SqlDialect>("sql");
const keywordCase = ref<SqlKeywordCase>("upper");
const indentation = ref<SqlIndentation>("2");
const source = ref(sqlExamples.sql);
const keywordOptions = [
  { label: "UPPERCASE", value: "upper" },
  { label: "lowercase", value: "lower" },
  { label: "Preserve case", value: "preserve" },
];
const indentationOptions = [{ label: "2 spaces", value: "2" }, {
  label: "4 spaces",
  value: "4",
}, { label: "Tabs", value: "tab" }];
const result = computed(() => {
  try {
    return {
      output: formatSql(source.value, {
        dialect: dialect.value,
        keywordCase: keywordCase.value,
        indentation: indentation.value,
      }),
      error: "",
    };
  } catch (error) {
    return {
      output: "",
      error: error instanceof Error ? error.message : "Unable to format SQL.",
    };
  }
});
</script>

<template>
  <ToolPage title="SQL Formatter" icon="i-lucide-database" max-width="1400px">
    <template v-if="source.trim()" #status><UBadge
        :color="result.error ? 'error' : 'neutral'"
        variant="subtle"
        :icon="result.error ? 'i-lucide-circle-alert' : 'i-lucide-align-left'"
      >{{ result.error ? "Unable to format" : "Formatted" }}</UBadge></template>
    <ToolToolbar @clear="source = ''">
      <div class="formatter-controls">
        <UFormField label="Dialect"><USelect
            id="sql-dialect"
            v-model="dialect"
            :items="sqlDialects"
            aria-label="SQL dialect"
            class="dialect-select"
          /></UFormField>
        <UFormField label="Keywords"><USelect
            id="sql-keyword-case"
            v-model="keywordCase"
            :items="keywordOptions"
            aria-label="Keyword case"
            class="keyword-select"
          /></UFormField>
        <UFormField label="Indentation"><USelect
            id="sql-indentation"
            v-model="indentation"
            :items="indentationOptions"
            aria-label="Indentation"
            class="indentation-select"
          /></UFormField>
      </div>
      <template #actions><UButton
          icon="i-lucide-flask-conical"
          color="neutral"
          variant="ghost"
          @click="source = sqlExamples[dialect]"
        >Example</UButton></template>
    </ToolToolbar>
    <div aria-live="polite" aria-atomic="true">
      <UAlert
        v-if="result.error"
        id="sql-format-error"
        title="Unable to format SQL"
        :description="result.error"
        color="error"
        variant="subtle"
        icon="i-lucide-circle-alert"
        class="format-error"
      />
    </div>
    <div class="formatter-grid">
      <ToolTextEditor
        id="sql-source"
        v-model="source"
        label="Input"
        language="SQL"
        placeholder="SELECT ..."
        :error="!!result.error"
        :error-id="result.error ? 'sql-format-error' : undefined"
      />
      <ToolTextEditor
        id="sql-output"
        :model-value="result.output"
        label="Output"
        language="SQL"
        readonly
      />
    </div>
    <footer class="formatter-footer">
      <span><UIcon name="i-lucide-lock-keyhole" />Local processing</span><span
      >SQL is not executed or semantically validated</span>
    </footer>
  </ToolPage>
</template>

<style scoped>
.formatter-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.75rem;
  min-width: 0;
}
.formatter-controls :deep(.dialect-select) {
  width: 10rem;
}
.formatter-controls :deep(.keyword-select) {
  width: 9rem;
}
.formatter-controls :deep(.indentation-select) {
  width: 8rem;
}
.format-error {
  margin-bottom: 1rem;
}
.format-error :deep([data-slot="description"]) {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  max-height: 12rem;
  overflow-y: auto;
}
.formatter-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}
.formatter-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1rem;
  font-size: 0.6875rem;
  color: var(--ui-text-muted);
}
.formatter-footer > span:first-child {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
@media (min-width: 900px) {
  .formatter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 479px) {
  .formatter-controls {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    width: 100%;
  }
  .formatter-controls :deep(.dialect-select),
  .formatter-controls :deep(.keyword-select),
  .formatter-controls :deep(.indentation-select) {
    width: 100%;
  }
}
</style>
