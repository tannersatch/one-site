export function revealOnScroll(element: HTMLElement, delay = 0): () => void {
  if (
    typeof window === "undefined"
    || typeof window.IntersectionObserver !== "function"
    || typeof window.matchMedia !== "function"
    || typeof element.animate !== "function"
  ) return () => {};

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (motion.matches || element.matches(":focus-within")) return () => {};

  let animation: Animation | undefined;
  let pending = true;
  const observer = new window.IntersectionObserver(entries => {
    if (!pending || !entries.some(entry => entry.isIntersecting)) return;
    pending = false;
    observer.disconnect();
    animation = element.animate(
      [
        { opacity: 0, translate: "0 18px" },
        { opacity: 1, translate: "0 0" },
      ],
      {
        duration: 600,
        delay: Math.min(Math.max(delay, 0), 240),
        easing: "cubic-bezier(0.2, 0.7, 0.2, 1)",
        fill: "backwards",
      },
    );
    animation.onfinish = cleanup;
  }, { threshold: 0 });

  function cleanup() {
    pending = false;
    observer.disconnect();
    animation?.cancel();
    motion.removeEventListener("change", onMotionChange);
    element.removeEventListener("focusin", cleanup);
  }

  function onMotionChange() {
    if (motion.matches) cleanup();
  }

  motion.addEventListener("change", onMotionChange);
  element.addEventListener("focusin", cleanup);
  observer.observe(element);
  return cleanup;
}
