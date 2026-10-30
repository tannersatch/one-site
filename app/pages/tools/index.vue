<script setup lang="ts">
import ToolDirectoryItem from "~/components/tools/ToolDirectoryItem.vue";
import ToolPage from "~/components/tools/ToolPage.vue";
import { tools } from "~/data/tools";
import { decimalToRoman } from "~/utils/romanNumerals";

useSeoMeta({
  title: "Developer Tools | Tanner Satchwell",
  description:
    "A collection of practical developer utilities, including JWT encoding and decoding and Roman numeral conversion.",
});

const query = ref("");
const filteredTools = computed(() => {
  const search = query.value.trim().toLocaleLowerCase();
  return tools.filter(tool =>
    [
      tool.title,
      tool.description,
      tool.category,
      ...tool.keywords,
      ...tool.tags,
    ].join(" ").toLocaleLowerCase().includes(search)
  );
});
const romanExample = decimalToRoman("2026");
</script>

<template>
  <ToolPage title="Developer tools" icon="i-lucide-terminal">
    <template #status><UBadge color="neutral" variant="subtle">{{
          tools.length
        }} tools</UBadge></template>

    <section class="directory-toolbar" aria-label="Find a tool">
      <UInput
        v-model="query"
        icon="i-lucide-search"
        placeholder="Search tools..."
        aria-label="Search tools"
        autocomplete="off"
        size="lg"
        class="directory-search"
        @keydown.esc="query = ''"
      >
        <template v-if="query" #trailing><UButton
            icon="i-lucide-x"
            aria-label="Clear tool search"
            color="neutral"
            variant="ghost"
            size="xs"
            @click="query = ''"
          /></template>
      </UInput>
      <p class="result-count" role="status">
        {{ filteredTools.length }} {{
          filteredTools.length === 1 ? "tool" : "tools"
        }}{{ query.trim() ? " found" : " available" }}
      </p>
    </section>

    <section aria-labelledby="tools-title">
      <div class="directory-heading">
        <h2 id="tools-title">
          {{ query.trim() ? "Search results" : "All tools" }}
        </h2><span><UIcon name="i-lucide-lock-keyhole" />Local processing</span>
      </div>
      <div v-if="filteredTools.length" class="tool-grid">
        <ToolDirectoryItem
          v-for="tool in filteredTools"
          :key="tool.id"
          :tool="tool"
        >
          <template
            v-if="tool.id === 'jwt'"
            #preview
          ><div class="token-preview">
              <span>JWT / JSON</span><code>{ "name": "John Doe", "admin": true
                }</code>
            </div></template>
          <template
            v-else-if="tool.id === 'roman-numerals'"
            #preview
          ><div class="numeral-preview">
              <span>2026</span><UIcon name="i-lucide-arrow-left-right" /><strong
              >{{ romanExample }}</strong>
            </div></template>
        </ToolDirectoryItem>
      </div>
      <div v-else class="empty-results">
        <UIcon name="i-lucide-search-x" /><h3>No matching tools</h3><UButton
          icon="i-lucide-rotate-ccw"
          color="neutral"
          variant="outline"
          @click="query = ''"
        >Reset search</UButton>
      </div>
    </section>
  </ToolPage>
</template>

<style scoped>
.directory-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 1rem 1.5rem;
  border-top: 1px solid var(--ui-border);
}
.directory-search {
  width: 100%;
  max-width: 28rem;
}
.result-count {
  font-size: 0.75rem;
  color: var(--ui-text-muted);
}
.directory-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
h2 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.directory-heading > span {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.6875rem;
  color: var(--ui-text-muted);
}
.tool-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}
.token-preview {
  display: grid;
  gap: 0.65rem;
  width: 100%;
  min-width: 0;
}
.token-preview > span {
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--ui-text-muted);
}
.token-preview code {
  font-size: 0.75rem;
  line-height: 1.7;
  overflow-wrap: anywhere;
  color: var(--ui-text-highlighted);
}
.numeral-preview {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-family: var(--font-mono, monospace);
  font-size: 1.5rem;
}
.numeral-preview .iconify {
  width: 1rem;
  height: 1rem;
  color: var(--ui-text-muted);
}
.numeral-preview strong {
  font-weight: 600;
  color: var(--ui-primary);
}
.empty-results {
  display: grid;
  justify-items: center;
  gap: 1rem;
  padding: 3rem 1rem;
  border-block: 1px solid var(--ui-border);
  color: var(--ui-text-muted);
}
.empty-results > .iconify {
  width: 2rem;
  height: 2rem;
}
.empty-results h3 {
  font-size: 1rem;
  font-weight: 600;
}
@media (min-width: 700px) {
  .tool-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 479px) {
  .directory-toolbar {
    gap: 0.75rem;
  }
}
</style>
