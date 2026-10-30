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
    items: ["Vue", "Nuxt","React", "React Native", "Express", "Svelte", "SvelteKit"],
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
    <div v-reveal class="skills-heading">
      <p class="portfolio-eyebrow skills-eyebrow">03 / THE TOOLKIT</p>
      <h2 id="skills-title" class="portfolio-title">
        Different tools. Same curiosity<span class="skills-accent">.</span>
      </h2>
    </div>
    <div class="skills-grid">
      <div
        v-reveal="index * 80"
        v-for="(group, index) in skills"
        :key="group.title"
        class="skill-group"
      >
        <div class="skill-meta">
          <UIcon :name="group.icon" class="skill-icon" /><span>0{{
              index + 1
            }}</span>
        </div>
        <h3 class="skill-title">
          {{ group.title }}
        </h3>
        <div class="skill-tags">
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

<style scoped>
.skills-heading {
  margin-bottom: 2.5rem;
}
.skills-eyebrow {
  margin-bottom: 1rem;
  color: var(--ui-text-muted);
}
.skills-accent, .skill-icon {
  color: var(--ui-primary);
}
.skills-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem 1rem;
}
.skill-group {
  border-top: 2px solid var(--ui-border-inverted);
  padding-top: 1.25rem;
}
.skill-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--ui-text-muted);
}
.skill-icon {
  width: 1.5rem;
  height: 1.5rem;
}
.skill-title {
  margin-block: 1.5rem 1rem;
  min-height: 3rem;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
@media (min-width: 768px) {
  .skills-grid {
    gap: 2rem;
  }
}
@media (min-width: 1024px) {
  .skills-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .skill-title {
    min-height: 0;
  }
}
</style>
