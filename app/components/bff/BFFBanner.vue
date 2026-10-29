<script setup lang="ts">
import silhouette from "~/assets/images/branding/banner.svg?raw";

const icons = { silhouette };

withDefaults(
  defineProps<{
    name?: keyof typeof icons;
    alt?: string;
    size?: "sm" | "md" | "lg";
  }>(),
  {
    name: "silhouette",
    alt: "Organization icon",
    size: "md",
  },
);
</script>

<template>
  <span
    role="img"
    :aria-label="alt"
    :class="['org-icon', `org-icon--${size}`]"
    v-html="icons[name]"
  />
</template>

<style scoped>
.org-icon {
  display: block;
  flex: none;
  color: light-dark("black", "white");
}

.org-icon :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}

.org-icon--sm {
  width: 4rem;
  height: 1rem;
}

.org-icon--md {
  width: 12rem;
  height: 3rem;
}

.org-icon--lg {
  width: 20rem;
  height: 5rem;
}
</style>
