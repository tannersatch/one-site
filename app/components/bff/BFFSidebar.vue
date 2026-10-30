<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const avatar = {
  src: "https://github.com/benjamincanac.png",
  loading: "lazy" as const,
};

const items: NavigationMenuItem[][] = [[
  {
    label: "Home",
    icon: "i-lucide-home",
    to: "/tools",
  },
  {
    label: "JWT Decoder",
    icon: "i-lucide-braces",
    to: "/tools/jwt-decode",
  },
  {
    label: "Roman Numeral Converter",
    icon: "i-lucide-landmark",
    to: "/tools/roman-numeral-converter",
  },
], [{
  label: "Feedback",
  icon: "i-lucide-message-circle",
  to: "https://github.com/nuxt-ui-templates/dashboard",
  target: "_blank",
}, {
  label: "Help & Support",
  icon: "i-lucide-info",
  to: "https://github.com/nuxt/ui",
  target: "_blank",
}]];

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
  <UDashboardSidebar
    collapsible
    resizable
    class="sidebar"
    :ui="{ footer: 'sidebar-footer' }"
  >
    <template #default="{ collapsed, collapse }">
      <UButton
        v-if="collapsed"
        icon="i-lucide-search"
        aria-label="Expand sidebar to search"
        color="neutral"
        variant="outline"
        block
        square
        @click="collapse(false)"
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

      <div v-if="filteredItems[1]?.length" class="secondary-navigation">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="filteredItems[1]"
          orientation="vertical"
        />
      </div>
    </template>

    <template #footer="{ collapsed }">
      <UButton
        :avatar="avatar"
        :label="collapsed ? undefined : 'Benjamin'"
        color="neutral"
        variant="ghost"
        class="profile-button"
        :block="collapsed"
      />
    </template>
  </UDashboardSidebar>
</template>

<style scoped>
.sidebar-search {
  width: 100%;
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

.profile-button {
  width: 100%;
}
</style>
