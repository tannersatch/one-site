<script setup lang="ts">
import { jwtDecode } from "jwt-decode";
import { sign } from "jwt-encode";

definePageMeta({
  title: "JWT Decode",
});

const process = ref<("decode" | "encode")>("decode");
const jwtValue = ref(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30",
);
const headerValue = ref("");
const payloadValue = ref("");
const signatureValue = ref("");
const decodeError = ref("");

const handleDecodeFocus = (event: FocusEvent) => {
  process.value = "decode";
};

const handleEncodeFocus = (event: FocusEvent) => {
  process.value = "encode";
};

const decodeJWT = (jwt: string) => {
  headerValue.value = "";
  payloadValue.value = "";
  signatureValue.value = "";
  decodeError.value = "";

  const token = jwt.trim();
  if (!token) return;

  const parts = token.split(".");
  if (parts.length !== 3 || !parts[0] || !parts[1]) {
    decodeError.value = "Expected a JWT in header.payload.signature format.";
    return;
  }

  try {
    const decodedHeader = jwtDecode(token, { header: true });
    const decodedPayload = jwtDecode(token);
    headerValue.value = JSON.stringify(decodedHeader, null, 2);
    payloadValue.value = JSON.stringify(decodedPayload, null, 2);
    signatureValue.value = parts[2] ?? "";
  } catch (error) {
    decodeError.value = error instanceof Error
      ? error.message
      : "Failed to decode JWT.";
  }
};

watch(jwtValue, (newJWT) => {
  if (process.value === "decode") {
    decodeJWT(newJWT);
  }
}, { immediate: true });

const encodeJWT = (payload: string, header: string, signature: string) => {
  try {
    const encodedJWT = sign(JSON.parse(payload), JSON.parse(header), signature);
    jwtValue.value = encodedJWT;
  } catch (error) {
    decodeError.value = error instanceof Error
      ? error.message
      : "Failed to encode JWT.";
  }
};

watch(
  [payloadValue, headerValue, signatureValue],
  ([newPayload, newHeader, newSignature]) => {
    if (process.value === "encode") {
      encodeJWT(newPayload, newHeader, newSignature);
    }
  },
  { immediate: true },
);
</script>

<template>
  <UPageHeader title="JWT Encode / Decode" />
  <UPageGrid class="jwt-grid">
    <section class="jwt-card">
      <UFormField label="JWT" :error="decodeError || undefined">
        <UTextarea
          v-model="jwtValue"
          :rows="36"
          class="jwt-input"
          @focus="handleDecodeFocus"
        />
      </UFormField>
    </section>
    <section class="jwt-card">
      <UFormField label="Header">
        <UTextarea
          :model-value="headerValue"
          :rows="12"
          class="jwt-input"
          @focus="handleEncodeFocus"
        />
      </UFormField>
    </section>
    <section class="jwt-card">
      <UFormField label="Payload">
        <UTextarea
          :model-value="payloadValue"
          :rows="12"
          class="jwt-input"
          @focus="handleEncodeFocus"
        />
      </UFormField>
    </section>
    <section class="jwt-card">
      <UFormField label="Signature">
        <UTextarea
          :model-value="signatureValue"
          :rows="12"
          class="jwt-input"
          @focus="handleEncodeFocus"
        />
      </UFormField>
    </section>
  </UPageGrid>
</template>

<style scoped>
.jwt-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  height: 100%;
  gap: 1rem;
}
.jwt-card {
  padding: 1rem;
  height: 100%;
}
.jwt-card:first-child {
  grid-row: span 3;
}
.jwt-input {
  width: 100%;
}
</style>
