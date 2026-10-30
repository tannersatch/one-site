<script setup lang="ts">
import CopyButton from "~/components/tools/CopyButton.vue";
import ToolPage from "~/components/tools/ToolPage.vue";
import ToolTextEditor from "~/components/tools/ToolTextEditor.vue";
import ToolToolbar from "~/components/tools/ToolToolbar.vue";
import { renderMarkdown } from "~/utils/markdown";

definePageMeta({ title: "Markdown Previewer" });
useSeoMeta({
  title: "Markdown Previewer | Dev Tools",
  description:
    "Preview Markdown and sanitized HTML locally, with GitHub-flavored tables, task lists, and safe links.",
});

const example =
  "# Project notes\n\nA small project, built **one step at a time**.\n\n## Checklist\n\n- [x] Make something useful\n- [ ] Ship the next idea\n\n## Details\n\n| Project | Status |\n| --- | --- |\n| Developer tools | In progress |\n| Portfolio | Live |\n\n> Start small. Keep building.\n\n```typescript\nconst project = { name: \"One Site\", active: true };\n```\n\n[JavaScript reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript)";
const source = ref(example);
const mode = ref("preview");
const allowRemoteImages = ref(false);
const modes = [{ label: "Preview", value: "preview", icon: "i-lucide-eye" }, {
  label: "HTML",
  value: "html",
  icon: "i-lucide-code-xml",
}];
const result = computed(() => {
  try {
    return {
      html: renderMarkdown(source.value, {
        allowRemoteImages: allowRemoteImages.value,
      }),
      error: "",
    };
  } catch (error) {
    return {
      html: "",
      error: error instanceof Error
        ? error.message
        : "Unable to render Markdown.",
    };
  }
});
</script>

<template>
  <ToolPage
    title="Markdown Previewer"
    icon="i-lucide-file-text"
    max-width="1400px"
  >
    <template #status><UBadge
        color="neutral"
        variant="subtle"
        icon="i-lucide-shield-check"
      >Sanitized HTML</UBadge></template>
    <ToolToolbar @clear="source = ''">
      <div class="preview-controls">
        <UTabs
          v-model="mode"
          :items="modes"
          :content="false"
          aria-label="Markdown output mode"
          class="mode-control"
        /><UTooltip text="Allow external image requests"><UCheckbox
            id="markdown-remote-images"
            v-model="allowRemoteImages"
            label="Remote images"
          /></UTooltip>
      </div>
      <template #actions><UButton
          icon="i-lucide-flask-conical"
          color="neutral"
          variant="ghost"
          @click="source = example"
        >Example</UButton></template>
    </ToolToolbar>
    <div aria-live="polite" aria-atomic="true">
      <UAlert
        v-if="result.error"
        id="markdown-error"
        :title="result.error"
        color="error"
        variant="subtle"
        icon="i-lucide-circle-alert"
        class="preview-error"
      />
    </div>
    <div class="markdown-workspace">
      <ToolTextEditor
        id="markdown-source"
        v-model="source"
        label="Input"
        language="MARKDOWN"
        placeholder="Write Markdown..."
        :error="!!result.error"
        :error-id="result.error ? 'markdown-error' : undefined"
      />
      <section
        v-if="mode === 'preview'"
        class="preview-panel"
        aria-labelledby="markdown-preview-title"
      >
        <div class="preview-heading">
          <h2 id="markdown-preview-title">Preview</h2>
          <div class="preview-actions">
            <UBadge color="neutral" variant="soft" size="sm"
            >RENDERED</UBadge><CopyButton
              :value="result.html"
              label="Copy HTML"
            />
          </div>
        </div>
        <div
          v-if="result.html"
          id="markdown-preview"
          class="markdown-body"
          v-html="result.html"
        />
        <div v-else id="markdown-preview" class="markdown-body empty-preview">
          No preview
        </div>
      </section>
      <ToolTextEditor
        v-else
        id="markdown-html"
        :model-value="result.html"
        label="HTML output"
        language="HTML"
        readonly
      />
    </div>
    <footer class="markdown-footer">
      <span><UIcon name="i-lucide-lock-keyhole" />Local processing</span><span
      >{{
        allowRemoteImages ? "Remote image requests enabled" : "Remote images blocked"
      }}</span>
    </footer>
  </ToolPage>
</template>

<style scoped>
.preview-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}
.mode-control {
  width: 14rem;
  max-width: 100%;
}
.preview-error {
  margin-bottom: 1rem;
}
.markdown-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}
.preview-panel {
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--ui-border);
  border-radius: 0.5rem;
  background: var(--ui-bg);
}
.preview-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  border-bottom: 1px solid var(--ui-border);
  background: var(--ui-bg-muted);
}
.preview-heading h2 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.preview-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.markdown-body {
  min-width: 0;
  height: 22rem;
  min-height: 12rem;
  overflow: auto;
  padding: 1.25rem;
  font-size: 0.875rem;
  line-height: 1.8;
  overflow-wrap: anywhere;
  color: var(--ui-text);
}
.markdown-body :deep(> :first-child) {
  margin-top: 0;
}
.markdown-body :deep(> :last-child) {
  margin-bottom: 0;
}
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  margin-block: 1.25rem 0.65rem;
  line-height: 1.35;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.markdown-body :deep(h1) {
  font-size: 1.75rem;
}
.markdown-body :deep(h2) {
  font-size: 1.35rem;
}
.markdown-body :deep(h3) {
  font-size: 1.1rem;
}
.markdown-body :deep(p),
.markdown-body :deep(ul),
.markdown-body :deep(ol),
.markdown-body :deep(blockquote),
.markdown-body :deep(pre),
.markdown-body :deep(table),
.markdown-body :deep(details),
.markdown-body :deep(dl) {
  margin-block: 0.85rem;
}
.markdown-body :deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
}
.markdown-body :deep(ol) {
  list-style: decimal;
  padding-left: 1.5rem;
}
.markdown-body :deep(li:has(> input[type="checkbox"])) {
  list-style: none;
}
.markdown-body :deep(input[type="checkbox"]) {
  margin-right: 0.4rem;
  accent-color: var(--ui-primary);
}
.markdown-body :deep(blockquote) {
  margin-inline: 0;
  border-left: 3px solid var(--ui-primary);
  padding-left: 1rem;
  color: var(--ui-text-muted);
}
.markdown-body :deep(a) {
  color: var(--ui-primary);
  text-decoration: underline;
  text-underline-offset: 0.15em;
}
.markdown-body :deep(a:focus-visible),
.markdown-body :deep(summary:focus-visible) {
  outline: 2px solid var(--ui-primary);
  outline-offset: 3px;
}
.markdown-body :deep(code), .markdown-body :deep(kbd) {
  padding: 0.15rem 0.3rem;
  border-radius: 0.2rem;
  background: var(--ui-bg-muted);
  font-family: var(--font-mono, monospace);
  font-size: 0.8125rem;
}
.markdown-body :deep(pre) {
  padding: 1rem;
  overflow-x: auto;
  border: 1px solid var(--ui-border);
  border-radius: 0.375rem;
  background: var(--ui-bg-muted);
}
.markdown-body :deep(pre code) {
  padding: 0;
  border: 0;
  background: transparent;
}
.markdown-body :deep(table) {
  min-width: 100%;
  border-collapse: collapse;
}
.markdown-body :deep(th), .markdown-body :deep(td) {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--ui-border);
  text-align: left;
}
.markdown-body :deep(th) {
  background: var(--ui-bg-muted);
  font-weight: 600;
}
.markdown-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.25rem;
}
.markdown-body :deep(hr) {
  margin-block: 1.25rem;
  border: 0;
  border-top: 1px solid var(--ui-border);
}
.markdown-body :deep(summary) {
  cursor: pointer;
}
.markdown-body :deep(dd) {
  margin-left: 1.5rem;
}
.empty-preview {
  color: var(--ui-text-muted);
}
.markdown-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1rem;
  font-size: 0.6875rem;
  color: var(--ui-text-muted);
}
.markdown-footer > span:first-child {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
@media (min-width: 900px) {
  .markdown-workspace {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 639px) {
  .markdown-body {
    height: 16rem;
  }
}
@media (max-width: 479px) {
  .preview-controls, .mode-control {
    width: 100%;
  }
}
</style>
