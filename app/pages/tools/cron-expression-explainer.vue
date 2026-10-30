<script setup lang="ts">
import ToolPage from "~/components/tools/ToolPage.vue";
import ToolToolbar from "~/components/tools/ToolToolbar.vue";
import { parseCronSchedule } from "~/utils/cronSchedule";

definePageMeta({ title: "Cron Expression Explainer" });
useSeoMeta({
  title: "Cron Expression Explainer | Dev Tools",
  description:
    "Explain cron schedules, validate expressions, and show upcoming run times locally.",
});

const example = "0 9 * * 1-5";
const expression = ref(example);
const zone = ref("UTC");
const count = ref("5");
const referenceDate = ref<Date | null>(null);
const localZone = ref("UTC");
const zones = computed(() => [
  { label: "UTC", value: "UTC", icon: "i-lucide-globe" },
  {
    label: `Local (${localZone.value})`,
    value: "local",
    icon: "i-lucide-map-pin",
  },
]);
const counts = ["3", "5", "10"].map(value => ({
  label: `${value} runs`,
  value,
}));
const result = computed(() => {
  if (!referenceDate.value || !expression.value.trim()) {
    return { schedule: null, error: "" };
  }
  try {
    return {
      schedule: parseCronSchedule(expression.value, {
        timeZone: zone.value === "local" ? localZone.value : "UTC",
        currentDate: referenceDate.value,
        count: Number(count.value),
      }),
      error: "",
    };
  } catch (reason) {
    return {
      schedule: null,
      error: reason instanceof Error
        ? reason.message
        : "Unable to parse this cron expression.",
    };
  }
});
const fieldHelp = [
  { name: "Second", range: "0-59" },
  { name: "Minute", range: "0-59" },
  { name: "Hour", range: "0-23" },
  { name: "Day of month", range: "1-31" },
  { name: "Month", range: "1-12" },
  { name: "Day of week", range: "0-7" },
];
function reset() {
  expression.value = "";
}
onMounted(() => {
  localZone.value = Intl.DateTimeFormat().resolvedOptions().timeZone
    || "Browser local time";
  referenceDate.value = new Date();
});
</script>

<template>
  <ToolPage title="Cron Expression Explainer" icon="i-lucide-calendar-clock">
    <template #status><UBadge
        :color="result.error ? 'error' : result.schedule ? 'success' : 'neutral'"
        variant="subtle"
      >{{
        result.error
        ? "Invalid expression"
        : result.schedule
        ? "Valid schedule"
        : "Enter a schedule"
      }}</UBadge></template>
    <ToolToolbar @clear="reset">
      <div class="cron-controls">
        <USelect
          v-model="zone"
          :items="zones"
          aria-label="Cron time zone"
          class="zone-select"
        /><USelect
          v-model="count"
          :items="counts"
          aria-label="Number of upcoming runs"
          class="count-select"
        />
      </div>
      <template #actions><UButton
          icon="i-lucide-flask-conical"
          color="neutral"
          variant="ghost"
          @click="expression = example"
        >Weekdays</UButton></template>
    </ToolToolbar>
    <UFormField
      label="Cron expression"
      :error="result.error || undefined"
      hint="Standard 5-field and seconds-first 6-field expressions; common @presets are supported."
    ><UInput
        id="cron-expression"
        v-model="expression"
        placeholder="*/15 * * * *"
        autocomplete="off"
        :spellcheck="false"
        class="expression-input"
      /></UFormField>
    <section v-if="result.schedule" class="schedule-result" aria-live="polite">
      <section
        class="description-section"
        aria-labelledby="cron-description-title"
      >
        <h2 id="cron-description-title">Schedule</h2>
        <p>{{ result.schedule.description }}</p>
      </section>
      <section
        v-if="result.schedule.fields.length > 1"
        class="field-section"
        aria-labelledby="cron-fields-title"
      >
        <h2 id="cron-fields-title">Expression fields</h2>
        <div class="field-grid">
          <div
            v-for="(field, index) in result.schedule.fields"
            :key="field.name"
            class="field-item"
          >
            <span>{{ field.name }}</span><code>{{ field.value }}</code><small>{{
              fieldHelp.find(item => item.name === field.name)?.range ?? "Named values"
            }}</small>
          </div>
        </div>
      </section>
      <section class="runs-section" aria-labelledby="cron-runs-title">
        <h2 id="cron-runs-title">
          Next {{ result.schedule.nextRuns.length }} runs · {{
            zone === "UTC" ? "UTC" : localZone
          }}
        </h2>
        <ol>
          <li
            v-for="(run, index) in result.schedule.nextRuns"
            :key="run.toISOString()"
          >
            <span>{{ index + 1 }}</span><time :datetime="run.toISOString()">{{
              run.toLocaleString(undefined, {
                timeZone: zone === "UTC" ? "UTC" : localZone,
                dateStyle: "medium",
                timeStyle: "long",
              })
            }}</time>
          </li>
        </ol>
      </section>
    </section>
    <p v-else-if="!result.error" class="empty-state">
      Enter a cron schedule to see its meaning and upcoming run times.
    </p>
    <p class="privacy-note">
      <UIcon name="i-lucide-lock-keyhole" />Schedule parsing runs locally. Cron
      day-of-month and day-of-week semantics can vary between schedulers; check
      your target system before deploying.
    </p>
  </ToolPage>
</template>

<style scoped>
.cron-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.zone-select {
  width: 13rem;
}
.count-select {
  width: 8rem;
}
.expression-input {
  width: 100%;
  max-width: 36rem;
  font-family: var(--font-mono, monospace);
}
.schedule-result {
  display: grid;
  gap: 1.5rem;
  margin-top: 1.5rem;
}
h2 {
  margin-bottom: 0.75rem;
  color: var(--ui-text-highlighted);
  font-size: 0.875rem;
  font-weight: 600;
}
.description-section p {
  margin: 0;
  padding: 1rem;
  border-left: 3px solid var(--ui-primary);
  background: var(--ui-bg-muted);
  color: var(--ui-text-highlighted);
  font-size: 1rem;
}
.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: 1px solid var(--ui-border);
}
.field-item {
  display: grid;
  gap: 0.35rem;
  padding: 0.75rem;
  border-bottom: 1px solid var(--ui-border);
}
.field-item span, .field-item small {
  color: var(--ui-text-muted);
  font-size: 0.6875rem;
}
.field-item code {
  color: var(--ui-text-highlighted);
  font-size: 0.875rem;
}
.runs-section ol {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--ui-border);
}
.runs-section li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 0.25rem;
  border-bottom: 1px solid var(--ui-border);
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
}
.runs-section li > span {
  display: grid;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: var(--ui-bg-muted);
  color: var(--ui-text-muted);
  font-size: 0.6875rem;
}
.empty-state {
  padding-block: 2rem;
  color: var(--ui-text-muted);
  text-align: center;
  font-size: 0.875rem;
}
.privacy-note {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.25rem;
  color: var(--ui-text-muted);
  font-size: 0.75rem;
}
.privacy-note :deep(.iconify) {
  flex-shrink: 0;
}
@media (min-width: 700px) {
  .field-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
