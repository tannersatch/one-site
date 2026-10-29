<script setup lang="ts">
const skills = [
  {
    title: "Languages",
    icon: "i-lucide-code-xml",
    items: ["JavaScript", "TypeScript", "HTML", "CSS", "Bash"],
  },
  {
    title: "Libraries & frameworks",
    icon: "i-lucide-blocks",
    items: ["React", "React Native", "Express", "Svelte", "SvelteKit"],
  },
  {
    title: "Tools & platforms",
    icon: "i-lucide-terminal",
    items: ["Git", "JIRA", "GCP", "Node.js", "Slack", "Bitbucket", "Postman"],
  },
  {
    title: "Databases",
    icon: "i-lucide-database",
    items: ["SQL", "MySQL", "Elasticsearch", "Redis", "PostgreSQL", "MongoDB"],
  },
];
</script>

<template>
  <section id="skills" class="portfolio-section" aria-labelledby="skills-title">
    <div class="portfolio-reveal mb-10">
      <p class="portfolio-eyebrow mb-4 text-muted">03 / THE TOOLKIT</p>
      <h2 id="skills-title" class="portfolio-title">
        Different tools. Same curiosity<span class="text-primary">.</span>
      </h2>
    </div>
    <div class="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-8 lg:grid-cols-4">
      <div
        v-for="(group, index) in skills"
        :key="group.title"
        class="portfolio-reveal border-t-2 border-inverted pt-5"
      >
        <div class="flex items-center justify-between text-xs text-muted">
          <UIcon :name="group.icon" class="size-6 text-primary" /><span>0{{
              index + 1
            }}</span>
        </div>
        <h3 class="mt-6 mb-4 min-h-12 font-semibold text-highlighted lg:min-h-0">
          {{ group.title }}
        </h3>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="skill in group.items"
            :key="skill"
            color="neutral"
            variant="soft"
            size="lg"
          >{{ skill }}</UBadge>
        </div>
      </div>
    </div>
  </section>
</template>
