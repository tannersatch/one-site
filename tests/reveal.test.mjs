import assert from "node:assert/strict";
import { test } from "node:test";
import { revealOnScroll } from "../app/utils/reveal.ts";

function setup(t, reducedMotion = false) {
  const previous = globalThis.window;
  const motion = new EventTarget();
  motion.matches = reducedMotion;
  const animations = [];
  const observers = [];
  const element = new EventTarget();
  element.matches = () => false;
  element.animate = (frames, options) => {
    const animation = {
      frames,
      options,
      cancelled: false,
      cancel() {
        this.cancelled = true;
      },
    };
    animations.push(animation);
    return animation;
  };
  globalThis.window = {
    matchMedia: () => motion,
    IntersectionObserver: class {
      constructor(callback, options) {
        Object.assign(this, { callback, options, disconnected: false });
        observers.push(this);
      }
      observe(target) {
        this.target = target;
      }
      disconnect() {
        this.disconnected = true;
      }
    },
  };
  t.after(() => {
    if (previous === undefined) delete globalThis.window;
    else globalThis.window = previous;
  });
  return { element, motion, animations, observers };
}

test("reveals only when entering the viewport and leaves final styles to the page", t => {
  const { element, animations, observers } = setup(t);
  const cleanup = revealOnScroll(element, 80);
  const observer = observers[0];
  assert.equal(observer.target, element);
  assert.equal(observer.options.threshold, 0);
  observer.callback([{ isIntersecting: false }]);
  assert.equal(animations.length, 0);
  observer.callback([{ isIntersecting: true }]);
  observer.callback([{ isIntersecting: true }]);
  assert.equal(animations.length, 1);
  assert.equal(observer.disconnected, true);
  assert.equal(animations[0].options.delay, 80);
  assert.equal(animations[0].options.fill, "backwards");
  assert.deepEqual(animations[0].frames.at(-1), { opacity: 1, translate: "0 0" });
  animations[0].onfinish();
  assert.equal(animations[0].cancelled, true);
  cleanup();
});

test("caps stagger delays so content is not held back by long lists", t => {
  const { element, animations, observers } = setup(t);
  const cleanup = revealOnScroll(element, 5000);
  observerEnter(observers);
  assert.equal(animations[0].options.delay, 240);
  cleanup();
});

function observerEnter(observers) {
  observers[0].callback([{ isIntersecting: true }]);
}

test("skips animation for reduced motion", t => {
  const { element, animations, observers } = setup(t, true);
  revealOnScroll(element)();
  assert.equal(observers.length, 0);
  assert.equal(animations.length, 0);
});

test("cancels animations when reduced motion is enabled at runtime", t => {
  const { element, motion, animations, observers } = setup(t);
  revealOnScroll(element);
  observerEnter(observers);
  motion.matches = true;
  motion.dispatchEvent(new Event("change"));
  assert.equal(animations[0].cancelled, true);
});

test("keyboard focus immediately cancels a reveal, including its delay", t => {
  const { element, animations, observers } = setup(t);
  revealOnScroll(element, 240);
  observerEnter(observers);
  element.dispatchEvent(new Event("focusin"));
  assert.equal(animations[0].cancelled, true);
});

test("already focused content is not animated", t => {
  const { element, observers } = setup(t);
  element.matches = () => true;
  revealOnScroll(element)();
  assert.equal(observers.length, 0);
});

test("unmount cleanup disconnects observers and removes listeners", t => {
  const { element, observers } = setup(t);
  let removals = 0;
  const remove = element.removeEventListener.bind(element);
  element.removeEventListener = (...args) => {
    removals++;
    remove(...args);
  };
  const cleanup = revealOnScroll(element);
  cleanup();
  assert.equal(observers[0].disconnected, true);
  assert.equal(removals, 1);
});

test("focus before intersection prevents a later queued reveal", t => {
  const { element, animations, observers } = setup(t);
  revealOnScroll(element);
  element.dispatchEvent(new Event("focusin"));
  observerEnter(observers);
  assert.equal(animations.length, 0);
});

test("unsupported browsers keep content visible without observers", t => {
  const { element, observers } = setup(t);
  delete element.animate;
  revealOnScroll(element)();
  assert.equal(observers.length, 0);
  delete window.IntersectionObserver;
  revealOnScroll(element)();
});

test("server rendering does not access browser APIs", () => {
  const cleanup = revealOnScroll({});
  cleanup();
});
