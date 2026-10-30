<script setup lang="ts">
import { jwtDecode } from "jwt-decode";
import sign from "jwt-encode";
import JwtEditor from "~/components/tools/JwtEditor.vue";

definePageMeta({
  title: "JWT Encode / Decode",
});

useSeoMeta({ title: "JWT Encode / Decode | Dev Tools" });

const exampleToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";
const modes = [
  { label: "Decode", value: "decode", icon: "i-lucide-scan-text" },
  { label: "Encode", value: "encode", icon: "i-lucide-key-round" },
];
const mode = ref("decode");
const jwtValue = ref(exampleToken);
const headerValue = ref("");
const payloadValue = ref("");
const signatureValue = ref("");
const secretValue = ref("");
const showSecret = ref(false);
const errorMessage = ref("");

function decodeJWT(jwt: string) {
  headerValue.value = "";
  payloadValue.value = "";
  signatureValue.value = "";
  errorMessage.value = "";

  const token = jwt.trim();
  if (!token) return;

  const parts = token.split(".");
  if (parts.length !== 3 || !parts[0] || !parts[1]) {
    errorMessage.value = "Expected a JWT in header.payload.signature format.";
    return;
  }

  try {
    headerValue.value = JSON.stringify(
      jwtDecode(token, { header: true }),
      null,
      2,
    );
    payloadValue.value = JSON.stringify(jwtDecode(token), null, 2);
    signatureValue.value = parts[2] ?? "";
  } catch (error) {
    headerValue.value = "";
    payloadValue.value = "";
    errorMessage.value = error instanceof Error
      ? error.message
      : "Failed to decode JWT.";
  }
}

watch(jwtValue, (newJWT) => {
  if (mode.value === "decode") decodeJWT(newJWT);
}, { immediate: true });

watch(mode, (value) => {
  errorMessage.value = "";
  if (value === "encode") {
    jwtValue.value = "";
    signatureValue.value = "";
  } else {
    decodeJWT(jwtValue.value);
  }
});

watch([headerValue, payloadValue, secretValue], () => {
  if (mode.value !== "encode") return;
  jwtValue.value = "";
  signatureValue.value = "";
  errorMessage.value = "";
});

function parseObject(value: string, label: string): Record<string, unknown> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error(`${label} must contain valid JSON.`);
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${label} must contain a JSON object.`);
  }
  return parsed as Record<string, unknown>;
}

function encodeJWT() {
  errorMessage.value = "";
  try {
    const header = parseObject(headerValue.value, "Header");
    const payload = parseObject(payloadValue.value, "Payload");
    if (header.alg !== "HS256") {
      throw new Error("Signing supports the HS256 algorithm only.");
    }
    const options: Record<string, string> = {};
    for (const [key, value] of Object.entries(header)) {
      if (typeof value !== "string") {
        throw new Error("Signing header values must be strings.");
      }
      options[key] = value;
    }
    if (!secretValue.value) throw new Error("Enter a signing secret.");
    jwtValue.value = sign(payload, secretValue.value, options);
    signatureValue.value = jwtValue.value.split(".")[2] ?? "";
  } catch (error) {
    jwtValue.value = "";
    signatureValue.value = "";
    errorMessage.value = error instanceof Error
      ? error.message
      : "Failed to encode JWT.";
  }
}

function loadExample() {
  mode.value = "decode";
  jwtValue.value = exampleToken;
}

function clear() {
  jwtValue.value = "";
  headerValue.value = "";
  payloadValue.value = "";
  signatureValue.value = "";
  secretValue.value = "";
  showSecret.value = false;
  errorMessage.value = "";
}
</script>

<template>
  <main class="jwt-tool">
    <header class="tool-heading">
      <div class="tool-title">
        <div class="tool-icon"><UIcon name="i-lucide-braces" /></div>
        <div>
          <p class="tool-category">DEVELOPER TOOLS</p>
          <h1>JWT Encode / Decode</h1>
        </div>
      </div>
      <UBadge
        v-if="jwtValue && !errorMessage"
        color="warning"
        variant="subtle"
        icon="i-lucide-shield-alert"
      >Signature unverified</UBadge>
    </header>

    <div class="tool-toolbar">
      <UTabs
        v-model="mode"
        :items="modes"
        :content="false"
        class="mode-control"
        aria-label="JWT mode"
      />
      <div class="toolbar-actions">
        <UButton
          icon="i-lucide-flask-conical"
          color="neutral"
          variant="ghost"
          @click="loadExample"
        >Example</UButton>
        <UButton
          icon="i-lucide-eraser"
          color="neutral"
          variant="ghost"
          @click="clear"
        >Clear</UButton>
      </div>
    </div>

    <div aria-live="polite" aria-atomic="true">
      <UAlert
        v-if="errorMessage"
        :title="errorMessage"
        color="error"
        variant="subtle"
        icon="i-lucide-circle-alert"
        class="tool-error"
      />
    </div>

    <div class="jwt-workspace">
      <div class="token-column">
        <JwtEditor
          id="jwt-token"
          v-model="jwtValue"
          label="Token"
          format="JWT"
          icon="i-lucide-fingerprint"
          :readonly="mode === 'encode'"
          :rows="10"
          placeholder="eyJhbGciOi..."
          class="token-editor"
        />
        <div class="token-meta">
          <span>{{ jwtValue.trim().length }} characters</span><span>{{
            mode === "decode" ? "Encoded token" : "Signed output"
          }}</span>
        </div>
      </div>
      <div class="decoded-column">
        <JwtEditor
          id="jwt-header"
          v-model="headerValue"
          label="Header"
          format="JSON"
          icon="i-lucide-braces"
          :readonly="mode === 'decode'"
          :rows="4"
          placeholder='{"alg": "HS256", "typ": "JWT"}'
        />
        <JwtEditor
          id="jwt-payload"
          v-model="payloadValue"
          label="Payload"
          format="JSON"
          icon="i-lucide-file-json"
          :readonly="mode === 'decode'"
          :rows="8"
          placeholder='{"sub": "1234567890"}'
        />
        <form
          v-if="mode === 'encode'"
          class="signing-controls"
          @submit.prevent="encodeJWT"
        >
          <div class="signing-heading">
            <h2>Signing</h2><UBadge color="neutral" variant="soft" size="sm"
            >HS256</UBadge>
          </div>
          <UFormField label="Secret" name="secret">
            <UInput
              id="jwt-secret"
              v-model="secretValue"
              :type="showSecret ? 'text' : 'password'"
              autocomplete="off"
              placeholder="Signing secret"
              class="secret-input"
            >
              <template #trailing><UTooltip
                  :text="showSecret ? 'Hide secret' : 'Show secret'"
                ><UButton
                    :icon="showSecret ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                    :aria-label="showSecret ? 'Hide secret' : 'Show secret'"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    @click="showSecret = !showSecret"
                  /></UTooltip></template>
            </UInput>
          </UFormField>
          <UButton type="submit" icon="i-lucide-key-round" class="sign-button"
          >Sign token</UButton>
        </form>
        <JwtEditor
          id="jwt-signature"
          v-model="signatureValue"
          label="Signature"
          format="BASE64URL"
          icon="i-lucide-shield"
          readonly
          :rows="3"
        />
      </div>
    </div>
    <footer class="tool-footer">
      <span><UIcon name="i-lucide-lock-keyhole" />Local processing</span><span
      >Signature verification not performed</span>
    </footer>
  </main>
</template>

<style scoped>
.jwt-tool {
  width: 100%;
  max-width: 1400px;
  min-width: 0;
  margin-inline: auto;
  padding: 0.5rem;
}
.tool-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1.5rem;
}
.tool-title {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 0;
}
.tool-icon {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  flex-shrink: 0;
  border: 1px solid var(--ui-border);
  border-radius: 0.5rem;
  background: var(--ui-bg-muted);
  color: var(--ui-primary);
}
.tool-icon .iconify {
  width: 1.4rem;
  height: 1.4rem;
}
.tool-category {
  margin-bottom: 0.2rem;
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--ui-text-muted);
}
h1 {
  font-size: 1.5rem;
  line-height: 1.25;
  font-weight: 600;
  color: var(--ui-text-highlighted);
}
.tool-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-block: 1rem;
  margin-bottom: 1.25rem;
  border-block: 1px solid var(--ui-border);
}
.mode-control {
  width: 15rem;
  max-width: 100%;
}
.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.tool-error {
  margin-bottom: 1rem;
}
.jwt-workspace {
  display: grid;
  gap: 1rem;
  min-width: 0;
}
.token-column {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.token-editor {
  flex: 1;
}
.token-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.65rem 0.25rem 0;
  font-size: 0.6875rem;
  color: var(--ui-text-muted);
}
.decoded-column {
  display: grid;
  gap: 1rem;
  min-width: 0;
}
.signing-controls {
  display: grid;
  gap: 0.85rem;
  border: 1px solid var(--ui-border);
  border-radius: 0.5rem;
  padding: 1rem;
  background: var(--ui-bg-muted);
}
.signing-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.signing-heading h2 {
  font-size: 0.875rem;
  font-weight: 600;
}
.secret-input {
  width: 100%;
}
.sign-button {
  justify-self: start;
}
.tool-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 1.25rem;
  font-size: 0.6875rem;
  color: var(--ui-text-muted);
}
.tool-footer > span:first-child {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
@media (min-width: 900px) {
  .jwt-workspace {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: stretch;
  }
}
@media (min-width: 1280px) {
  .jwt-tool {
    padding: 1rem;
  }
  h1 {
    font-size: 1.75rem;
  }
}
@media (max-width: 479px) {
  .jwt-tool {
    padding: 0;
  }
  h1 {
    font-size: 1.25rem;
  }
  .tool-toolbar {
    align-items: stretch;
  }
  .mode-control {
    width: 100%;
  }
  .toolbar-actions {
    justify-content: flex-end;
    width: 100%;
  }
}
</style>
