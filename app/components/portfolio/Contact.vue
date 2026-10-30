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
    class="contact"
    aria-labelledby="contact-title"
  >
    <p class="portfolio-eyebrow contact-eyebrow">04 / LET'S CONNECT</p>
    <div class="contact-heading">
      <h2
        id="contact-title"
        class="contact-title"
      >
        Have something<br>in mind<span>?</span>
      </h2>
      <p class="contact-intro">
        I'd love to hear about it.<br>Let's make something good.
      </p>
    </div>
    <UForm
      :schema="schema"
      :state="state"
      :disabled="submitting"
      class="contact-form"
      @submit="submit"
    >
      <div class="contact-fields">
        <UFormField label="Name" name="name" required>
          <UInput
            id="portfolio-contact-name"
            v-model="state.name"
            autocomplete="name"
            placeholder="Your name"
            maxlength="100"
            class="contact-input"
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
            class="contact-input"
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
          class="contact-input"
          size="lg"
        />
      </UFormField>
      <input
        v-model="botcheck"
        type="checkbox"
        name="botcheck"
        class="botcheck"
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
        class="send-button"
      >Send message</UButton>
    </UForm>
    <div class="contact-footer">
      <p>Code, craft, or a good conversation.</p>
      <div class="social-links">
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

<style scoped>
.contact {
  margin-bottom: 2rem;
  scroll-margin-top: 6rem;
  background: var(--ui-bg-muted);
  padding: 2rem 1.25rem;
}
.contact-eyebrow, .contact-intro, .contact-footer > p {
  color: var(--ui-text-muted);
}
.contact-heading {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
  margin-block: 2rem;
}
.contact-title {
  font-size: 2.25rem;
  line-height: 1.25;
  font-weight: 600;
}
.contact-title span {
  color: var(--ui-primary);
}
.contact-intro {
  line-height: 1.625;
}
.contact-form {
  display: grid;
  gap: 1.25rem;
  margin-bottom: 2rem;
}
.contact-fields {
  display: grid;
  gap: 1.25rem;
}
.contact-input {
  width: 100%;
}
.botcheck {
  display: none;
}
.send-button {
  justify-self: start;
}
.contact-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--ui-border);
}
.contact-footer > p {
  font-size: 0.875rem;
}
.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
@media (min-width: 640px) {
  .contact {
    padding: 3rem;
  }
  .contact-heading {
    flex-direction: row;
    align-items: center;
  }
  .contact-title {
    font-size: 3rem;
  }
  .contact-fields {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .contact-title {
    font-size: 3.75rem;
  }
}
</style>
