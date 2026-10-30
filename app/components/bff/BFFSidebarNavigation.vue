<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

withDefaults(defineProps<{ collapsed?: boolean }>(), {
  collapsed: false,
});
defineEmits<{ expand: [] }>();

const items: NavigationMenuItem[][] = [[
  { label: "Home", icon: "i-lucide-home", to: "/tools" },
  { label: "JWT Decoder", icon: "i-lucide-braces", to: "/tools/jwt-decode" },
  {
    label: "Roman Numeral Converter",
    icon: "i-lucide-landmark",
    to: "/tools/roman-numeral-converter",
  },
], [
  {
    label: "Feedback",
    icon: "i-lucide-message-circle",
    to: "https://github.com/nuxt-ui-templates/dashboard",
    target: "_blank",
  },
  {
    label: "Help & Support",
    icon: "i-lucide-info",
    to: "https://github.com/nuxt/ui",
    target: "_blank",
  },
]];

const searchQuery = ref("");
const filteredItems = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase();
  return items.map(group =>
    group.filter(item =>
      !query || item.label?.toLocaleLowerCase().includes(query)
    )
  );
});
const hasResults = computed(() =>
  filteredItems.value.some(group => group.length > 0)
);
</script>

<template>
  <div class="sidebar-navigation">
    <UButton
      v-if="collapsed"
      icon="i-lucide-search"
      aria-label="Expand sidebar to search"
      color="neutral"
      variant="outline"
      block
      square
      @click="$emit('expand')"
    />
    <UInput
      v-else
      v-model="searchQuery"
      icon="i-lucide-search"
      placeholder="Search links..."
      aria-label="Search sidebar links"
      autocomplete="off"
      class="sidebar-search"
      @keydown.esc="searchQuery = ''"
    >
      <template v-if="searchQuery" #trailing>
        <UButton
          icon="i-lucide-x"
          aria-label="Clear sidebar search"
          color="neutral"
          variant="ghost"
          size="xs"
          @click="searchQuery = ''"
        />
      </template>
    </UInput>

    <UNavigationMenu
      v-if="filteredItems[0]?.length"
      :collapsed="collapsed"
      :items="filteredItems[0]"
      orientation="vertical"
    />
    <p v-if="!hasResults" class="search-empty" role="status">
      No matching links.
    </p>

    <div class="secondary-navigation">
      <UNavigationMenu
        v-if="filteredItems[1]?.length"
        :collapsed="collapsed"
        :items="filteredItems[1]"
        orientation="vertical"
      />
    </div>
  </div>
</template>

<style scoped>
.sidebar-navigation {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  gap: 1rem;
}
.sidebar-search {
  width: 100%;
  flex-shrink: 0;
}
.search-empty {
  margin: 0;
  padding: 0.5rem;
  font-size: 0.875rem;
  color: var(--ui-text-muted);
}
.secondary-navigation {
  margin-top: auto;
  flex-shrink: 0;
}
</style>
