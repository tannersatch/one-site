<script setup lang="ts">
import CopyButton from "~/components/tools/CopyButton.vue";
import ToolPage from "~/components/tools/ToolPage.vue";
import ToolToolbar from "~/components/tools/ToolToolbar.vue";
import {
  formatDateTime,
  formatUnixTimestamp,
  parseDateTime,
  parseUnixTimestamp,
} from "~/utils/unixTimestamp";
import type { TimestampUnit, TimeZoneMode } from "~/utils/unixTimestamp";

definePageMeta({ title: "Unix Timestamp" });
useSeoMeta({
  title: "Unix Timestamp | Dev Tools",
  description:
    "Convert Unix seconds and milliseconds to UTC or local dates and back. Processing stays local.",
});

const unit = ref<TimestampUnit>("seconds");
const zone = ref<TimeZoneMode>("utc");
const instant = ref<number | null>(0);
const timestampInput = ref("0");
const dateInput = ref(formatDateTime(0));
const errorMessage = ref("");
const errorField = ref<"timestamp" | "date" | null>(null);
const now = ref<number | null>(null);
const localZone = ref("");
let clockTimer: ReturnType<typeof setInterval> | undefined;

const units = [{ label: "Seconds", value: "seconds" }, {
  label: "Milliseconds",
  value: "milliseconds",
}];
const zones = [{ label: "UTC", value: "utc", icon: "i-lucide-globe" }, {
  label: "Local",
  value: "local",
  icon: "i-lucide-map-pin",
}];
const currentSeconds = computed(() =>
  now.value === null ? "" : String(Math.floor(now.value / 1000))
);
const results = computed(() => {
  if (instant.value === null) return [];
  const date = new Date(instant.value);
  return [
    {
      id: "seconds",
      label: "Unix seconds",
      value: formatUnixTimestamp(instant.value),
    },
    {
      id: "milliseconds",
      label: "Unix milliseconds",
      value: formatUnixTimestamp(instant.value, "milliseconds"),
    },
    { id: "iso", label: "ISO 8601 (UTC)", value: date.toISOString() },
    {
      id: "local",
      label: localZone.value
        ? `Local (${localZone.value})`
        : "Local date and time",
      value: localZone.value
        ? date.toLocaleString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          fractionalSecondDigits: 3,
          timeZoneName: "short",
        })
        : "",
    },
  ];
});

function setInstant(value: number | null) {
  instant.value = value;
  timestampInput.value = value === null
    ? ""
    : formatUnixTimestamp(value, unit.value);
  dateInput.value = value === null ? "" : formatDateTime(value, zone.value);
  errorMessage.value = "";
  errorField.value = null;
}

function updateTimestamp(value: string | number) {
  timestampInput.value = String(value);
  errorMessage.value = "";
  errorField.value = null;
  try {
    instant.value = parseUnixTimestamp(timestampInput.value, unit.value);
    dateInput.value = instant.value === null
      ? ""
      : formatDateTime(instant.value, zone.value);
  } catch (error) {
    instant.value = null;
    dateInput.value = "";
    errorField.value = "timestamp";
    errorMessage.value = error instanceof Error
      ? error.message
      : "Unable to convert timestamp.";
  }
}

function updateDate(value: string | number) {
  dateInput.value = String(value);
  errorMessage.value = "";
  errorField.value = null;
  try {
    instant.value = parseDateTime(dateInput.value, zone.value);
    timestampInput.value = instant.value === null
      ? ""
      : formatUnixTimestamp(instant.value, unit.value);
  } catch (error) {
    instant.value = null;
    timestampInput.value = "";
    errorField.value = "date";
    errorMessage.value = error instanceof Error
      ? error.message
      : "Unable to convert date.";
  }
}

watch(unit, () => {
  if (instant.value !== null) {
    timestampInput.value = formatUnixTimestamp(instant.value, unit.value);
  } else if (timestampInput.value.trim()) updateTimestamp(timestampInput.value);
});
watch(zone, () => {
  if (instant.value !== null) {
    dateInput.value = formatDateTime(instant.value, zone.value);
  } else if (dateInput.value.trim()) updateDate(dateInput.value);
});

onMounted(() => {
  localZone.value = Intl.DateTimeFormat().resolvedOptions().timeZone
    || "Browser local time";
  now.value = Date.now();
  clockTimer = setInterval(() => {
    now.value = Date.now();
  }, 1000);
});
onBeforeUnmount(() => clearInterval(clockTimer));
</script>

<template>
  <ToolPage title="Unix Timestamp" icon="i-lucide-clock-3">
    <template v-if="instant !== null || errorMessage" #status><UBadge
        :color="errorMessage ? 'error' : 'neutral'"
        variant="subtle"
      >{{
        errorMessage ? "Unable to convert" : "Converted"
      }}</UBadge></template>
    <section class="current-time" aria-labelledby="current-time-title">
      <div>
        <h2 id="current-time-title">Current Unix time</h2>
        <p>{{ currentSeconds || "-" }}</p>
      </div><CopyButton
        :value="currentSeconds"
        label="Copy current timestamp"
      />
    </section>
    <ToolToolbar @clear="setInstant(null)">
      <div class="timestamp-options">
        <UFormField label="Timestamp unit" class="unit-field"><USelect
            id="timestamp-unit"
            v-model="unit"
            :items="units"
            aria-label="Timestamp unit"
            class="unit-select"
          /></UFormField>
        <fieldset class="zone-field">
          <legend>Time zone</legend><UTabs
            v-model="zone"
            :items="zones"
            :content="false"
            aria-label="Date time zone"
            class="zone-tabs"
          />
        </fieldset>
      </div>
      <template #actions><UButton
          icon="i-lucide-history"
          color="neutral"
          variant="ghost"
          @click="setInstant(0)"
        >Epoch</UButton><UButton
          icon="i-lucide-clock"
          color="neutral"
          variant="ghost"
          @click="setInstant(Date.now())"
        >Now</UButton></template>
    </ToolToolbar>
    <div aria-live="polite" aria-atomic="true">
      <UAlert
        v-if="errorMessage"
        id="timestamp-error"
        :title="errorMessage"
        color="error"
        variant="subtle"
        icon="i-lucide-circle-alert"
        class="timestamp-error"
      />
    </div>
    <div class="conversion-grid">
      <section class="conversion-field">
        <UFormField label="Unix timestamp"><UInput
            id="timestamp-input"
            :model-value="timestampInput"
            inputmode="decimal"
            autocomplete="off"
            placeholder="0"
            :maxlength="40"
            :aria-invalid="errorField === 'timestamp'"
            :aria-describedby="errorField === 'timestamp' ? 'timestamp-error' : undefined"
            class="conversion-input"
            @update:model-value="updateTimestamp"
          /></UFormField>
      </section>
      <section class="conversion-field">
        <UFormField
          :label="zone === 'utc' ? 'Date and time (UTC)' : 'Date and time (local)'"
        ><UInput
            id="date-time-input"
            :model-value="dateInput"
            autocomplete="off"
            placeholder="YYYY-MM-DDTHH:mm:ss.SSS"
            :maxlength="32"
            :spellcheck="false"
            :aria-invalid="errorField === 'date'"
            :aria-describedby="errorField === 'date' ? 'timestamp-error' : undefined"
            class="conversion-input"
            @update:model-value="updateDate"
          /></UFormField>
      </section>
    </div>
    <section class="results-section" aria-labelledby="timestamp-results-title">
      <h2 id="timestamp-results-title">Converted values</h2>
      <dl v-if="results.length" class="results-grid">
        <div v-for="result in results" :key="result.id" class="result-row">
          <dt>{{ result.label }}</dt>
          <dd>
            <code :id="`timestamp-result-${result.id}`">{{
              result.value || "-"
            }}</code><CopyButton
              :value="result.value"
              :label="`Copy ${result.label}`"
            />
          </dd>
        </div>
      </dl>
      <p v-else class="empty-state">No conversion</p>
    </section>
    <p v-if="zone === 'local'" class="timezone-note">
      {{ localZone }}. Daylight-saving overlaps use the earlier occurrence;
      nonexistent local times are rejected.
    </p>
    <footer class="timestamp-footer">
      <UIcon name="i-lucide-lock-keyhole" />Local processing
    </footer>
  </ToolPage>
</template>

<style scoped>
.current-time {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 0;
  border-top: 1px solid var(--ui-border);
}
h2 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.current-time h2 {
  font-size: 0.75rem;
  color: var(--ui-text-muted);
}
.current-time p {
  min-height: 2rem;
  margin-top: 0.5rem;
  font-family: var(--font-mono, monospace);
  font-size: 1.75rem;
  font-variant-numeric: tabular-nums;
  color: var(--ui-primary);
}
.timestamp-options {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.75rem;
  min-width: 0;
}
.timestamp-options :deep(.unit-select) {
  width: 10rem;
}
.zone-field {
  min-width: 0;
}
.zone-field legend {
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
}
.zone-tabs {
  width: 13rem;
  max-width: 100%;
}
.timestamp-error {
  margin-bottom: 1rem;
}
.conversion-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}
.conversion-field {
  min-width: 0;
}
.conversion-input {
  width: 100%;
}
.conversion-input :deep(input) {
  height: 3rem;
  font-family: var(--font-mono, monospace);
  font-size: 0.875rem;
}
.results-section {
  margin-top: 1.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--ui-border);
}
.results-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.25rem;
  margin-top: 1rem;
}
.result-row {
  min-width: 0;
}
.result-row dt {
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
  color: var(--ui-text-muted);
}
.result-row dd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-width: 0;
}
.result-row code {
  min-width: 0;
  font-size: 0.8125rem;
  line-height: 1.7;
  overflow-wrap: anywhere;
  color: var(--ui-text-highlighted);
}
.empty-state, .timezone-note {
  margin-top: 1rem;
  font-size: 0.75rem;
  line-height: 1.7;
  color: var(--ui-text-muted);
}
.timestamp-footer {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1.5rem;
  font-size: 0.6875rem;
  color: var(--ui-text-muted);
}
@media (min-width: 800px) {
  .conversion-grid, .results-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 479px) {
  .unit-field {
    width: 100%;
  }
  .timestamp-options,
  .zone-field,
  .zone-tabs,
  .timestamp-options :deep(.unit-select) {
    width: 100%;
  }
  .current-time p {
    font-size: 1.5rem;
  }
}
</style>
