<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100),
  email: z.email("Please enter a valid email address.").max(254),
  message: z.string().trim().min(1, "Please enter a message.").max(5000),
});
const state = reactive({ name: "", email: "", message: "" });
const submitting = ref(false);
const status = ref<"success" | "error" | null>(null);
const botcheck = ref(false);
const socials = [
  {
    label: "GitHub",
    icon: "i-lucide-github",
    to: "https://github.com/tannersatch",
  },
  {
    label: "LinkedIn",
    icon: "i-lucide-linkedin",
    to: "https://www.linkedin.com/in/tannersatch",
  },
  {
    label: "DEV Community",
    icon: "i-lucide-square-code",
    to: "https://dev.to/tannersatch",
  },
];

async function submit(event: FormSubmitEvent<z.output<typeof schema>>) {
  if (submitting.value || botcheck.value) return;
  submitting.value = true;
  status.value = null;

  try {
    const response = await $fetch<{ success: boolean }>(
      "https://api.web3forms.com/submit",
      {
        method: "POST",
        timeout: 15000,
        body: {
          ...event.data,
          access_key: "a40b494a-1c1d-4b85-88f5-126cec361b7e",
          subject: "New portfolio message",
          botcheck: botcheck.value,
        },
      },
    );
    if (!response.success) throw new Error("Message not accepted");
    status.value = "success";
    Object.assign(state, { name: "", email: "", message: "" });
  } catch {
    status.value = "error";
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <section
    id="contact"
    class="mb-8 scroll-mt-24 bg-muted px-5 py-8 sm:p-12"
    aria-labelledby="contact-title"
  >
    <p class="portfolio-eyebrow text-muted">04 / LET'S CONNECT</p>
    <div class="my-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
      <h2
        id="contact-title"
        class="text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl"
      >
        Have something<br>in mind<span class="text-primary">?</span>
      </h2>
      <p class="leading-relaxed text-muted">
        I'd love to hear about it.<br>Let's make something good.
      </p>
    </div>
    <UForm
      :schema="schema"
      :state="state"
      :disabled="submitting"
      class="mb-8 grid gap-5"
      @submit="submit"
    >
      <div class="grid gap-5 sm:grid-cols-2">
        <UFormField label="Name" name="name" required>
          <UInput
            id="portfolio-contact-name"
            v-model="state.name"
            autocomplete="name"
            placeholder="Your name"
            maxlength="100"
            class="w-full"
            size="lg"
          />
        </UFormField>
        <UFormField label="Email" name="email" required>
          <UInput
            id="portfolio-contact-email"
            v-model="state.email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            maxlength="254"
            class="w-full"
            size="lg"
          />
        </UFormField>
      </div>
      <UFormField label="Message" name="message" required>
        <UTextarea
          id="portfolio-contact-message"
          v-model="state.message"
          placeholder="What's on your mind?"
          :rows="4"
          maxlength="5000"
          autoresize
          class="w-full"
          size="lg"
        />
      </UFormField>
      <input
        v-model="botcheck"
        type="checkbox"
        name="botcheck"
        class="hidden"
        tabindex="-1"
        autocomplete="off"
        aria-hidden="true"
      >
      <div aria-live="polite" aria-atomic="true">
        <UAlert
          v-if="status === 'success'"
          title="Message sent. Thanks for getting in touch!"
          color="success"
          variant="subtle"
          icon="i-lucide-circle-check"
        />
        <UAlert
          v-else-if="status === 'error'"
          title="Your message couldn't be sent."
          description="Please try again, or reach out on LinkedIn below."
          color="error"
          variant="subtle"
          icon="i-lucide-circle-alert"
        />
      </div>
      <UButton
        type="submit"
        :loading="submitting"
        :disabled="submitting"
        trailing-icon="i-lucide-send"
        size="lg"
        class="justify-self-start"
      >Send message</UButton>
    </UForm>
    <div class="flex flex-wrap items-center justify-between gap-4 border-t border-default pt-6">
      <p class="text-sm text-muted">Code, craft, or a good conversation.</p>
      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="social in socials"
          :key="social.label"
          :to="social.to"
          :icon="social.icon"
          target="_blank"
          color="neutral"
          variant="link"
          trailing-icon="i-lucide-arrow-up-right"
        >{{ social.label }}</UButton>
      </div>
    </div>
  </section>
</template>
