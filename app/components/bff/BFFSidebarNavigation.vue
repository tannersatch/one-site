<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { tools } from "~/data/tools";

withDefaults(defineProps<{ collapsed?: boolean }>(), {
  collapsed: false,
});
defineEmits<{ expand: [] }>();

const home: NavigationMenuItem = {
  label: "Home",
  icon: "i-lucide-home",
  to: "/tools",
  exact: true,
};
const supportItems: NavigationMenuItem[] = [
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
];

const searchQuery = ref("");
const navigation = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase();
  const matches = (value: string) => value.toLocaleLowerCase().includes(query);
  const categories = [...new Set(tools.map(tool => tool.category))].sort((
    first,
    second,
  ) => first.localeCompare(second));
  const groups: NavigationMenuItem[][] = matches(home.label ?? "")
    ? [[home]]
    : [];
  for (const category of categories) {
    const links = tools.filter(tool =>
      tool.category === category
      && (matches(category) || matches(tool.navigationLabel ?? tool.title)
        || matches(tool.title))
    )
      .sort((first, second) =>
        (first.navigationLabel ?? first.title).localeCompare(
          second.navigationLabel ?? second.title,
        )
      )
      .map(tool => ({
        label: tool.navigationLabel ?? tool.title,
        icon: tool.icon,
        to: tool.to,
        exact: true,
      }));
    if (links.length) {
      groups.push([{ label: category, type: "label" }, ...links]);
    }
  }
  return {
    groups,
    support: supportItems.filter(item => matches(item.label ?? "")),
  };
});
const hasResults = computed(() =>
  navigation.value.groups.length > 0 || navigation.value.support.length > 0
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
      v-if="navigation.groups.length"
      :collapsed="collapsed"
      :items="navigation.groups"
      orientation="vertical"
    />
    <p v-if="!hasResults" class="search-empty" role="status">
      No matching links.
    </p>

    <div class="secondary-navigation">
      <UNavigationMenu
        v-if="navigation.support.length"
        :collapsed="collapsed"
        :items="navigation.support"
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
