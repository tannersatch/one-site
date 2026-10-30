<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";

definePageMeta({
  title: "Roman Numeral Calculator",
});

const schema = z.object({
  email: z.email("Invalid email"),
  password: z.string("Password is required").min(
    8,
    "Must be at least 8 characters",
  ),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined,
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: "Success",
    description: "The form has been submitted.",
    color: "success",
  });
  console.log(event.data);
}
</script>

<template>
  <UPageHeader title="Roman Numeral Calculator" />
  <UForm
    :schema="schema"
    :state="state"
    class="calculator-form"
    @submit="onSubmit"
  >
    <UFormField label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormField>

    <UFormField label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormField>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>

<style scoped>
.calculator-form > * + * {
  margin-top: 1rem;
}
</style>
