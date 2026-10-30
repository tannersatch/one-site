import type { ObjectDirective } from "vue";
import { revealOnScroll } from "~/utils/reveal";

export default defineNuxtPlugin(nuxtApp => {
  const cleanups = new WeakMap<HTMLElement, () => void>();
  const reveal: ObjectDirective<HTMLElement, number | undefined> = {
    mounted(element, binding) {
      cleanups.set(element, revealOnScroll(element, binding.value));
    },
    beforeUnmount(element) {
      cleanups.get(element)?.();
      cleanups.delete(element);
    },
    getSSRProps() {
      return {};
    },
  };
  nuxtApp.vueApp.directive("reveal", reveal);
});
