import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildGradient,
  buildMeshGradient,
  gradientPresets,
  gradientStopAxis,
  gradientStopPoint,
  gradientStopPosition,
  meshPositionFromPointer,
  meshPreset,
  normalizeHex,
  reverseGradientStops,
  stopsFromColors,
} from "../app/utils/cssGradient.ts";

const options = overrides => ({
  type: "linear",
  angle: 90,
  shape: "ellipse",
  centerX: 50,
  centerY: 50,
  stops: stopsFromColors(["#000000", "#ffffff"]),
  ...overrides,
});

test("generates linear CSS with a solid fallback", () => {
  const result = buildGradient(options());
  assert.equal(result.image, "linear-gradient(90deg, #000000 0%, #ffffff 100%)");
  assert.equal(result.css, "background: #000000;\nbackground: linear-gradient(90deg, #000000 0%, #ffffff 100%);");
});

test("normalizes hex colors and rejects arbitrary CSS values", () => {
  assert.equal(normalizeHex(" #AbC "), "#aabbcc");
  for (const value of ["red", "#12", "#12345g", "#12345678", "url(https://example.com)", "#000; color:red"]) {
    assert.throws(() => normalizeHex(value));
  }
});

test("generates radial gradients with the requested shape and center", () => {
  assert.equal(
    buildGradient(options({ type: "radial", shape: "circle", centerX: 25, centerY: 75 })).image,
    "radial-gradient(circle at 25% 75%, #000000 0%, #ffffff 100%)",
  );
});

test("formats alpha without dropping transparent stops", () => {
  const result = buildGradient(
    options({ stops: [{ color: "#f00", position: 0, opacity: 0 }, { color: "#00f", position: 100, opacity: 50 }] }),
  );
  assert.match(result.image, /rgba\(255, 0, 0, 0\) 0%/);
  assert.match(result.image, /rgba\(0, 0, 255, 0.5\) 100%/);
});

test("sorts stops without mutating input and retains hard transitions", () => {
  const stops = [{ color: "#fff", position: 100, opacity: 100 }, { color: "#f00", position: 40, opacity: 100 }, {
    color: "#00f",
    position: 40,
    opacity: 100,
  }];
  const result = buildGradient(options({ stops }));
  assert.match(result.image, /#ff0000 40%, #0000ff 40%, #ffffff 100%/);
  assert.equal(stops[0].position, 100);
});

test("normalizes negative and overflowing angles", () => {
  assert.match(buildGradient(options({ angle: -90 })).image, /270deg/);
  assert.match(buildGradient(options({ angle: 720 })).image, /0deg/);
  assert.match(buildGradient(options({ angle: 359.999 })).image, /0deg/);
});

test("rejects invalid counts, percentages, settings, and non-finite numbers", () => {
  assert.throws(() => buildGradient(options({ stops: [] })));
  assert.throws(() => buildGradient(options({ stops: Array(9).fill({ color: "#000", position: 0, opacity: 100 }) })));
  for (const value of [-1, 101, NaN, Infinity]) {
    assert.throws(() =>
      buildGradient(
        options({
          stops: [{ color: "#000", position: value, opacity: 100 }, { color: "#fff", position: 100, opacity: 100 }],
        }),
      )
    );
    assert.throws(() => buildGradient(options({ type: "radial", centerX: value })));
    assert.throws(() =>
      buildGradient(
        options({
          stops: [{ color: "#000", position: 0, opacity: value }, { color: "#fff", position: 100, opacity: 100 }],
        }),
      )
    );
  }
  assert.throws(() => buildGradient(options({ angle: NaN })));
  assert.throws(() => buildGradient(options({ type: "invalid" })));
  assert.throws(() => buildGradient(options({ type: "radial", shape: "invalid" })));
});

test("reverses positions and color order without mutating the stops", () => {
  const stops = [{ color: "#000000", position: 10, opacity: 100 }, { color: "#ffffff", position: 70, opacity: 50 }];
  assert.deepEqual(reverseGradientStops(stops), [{ color: "#ffffff", position: 30, opacity: 50 }, {
    color: "#000000",
    position: 90,
    opacity: 100,
  }]);
  assert.equal(stops[0].position, 10);
});

test("spreads preset stops evenly and every preset generates valid settings", () => {
  assert.deepEqual(stopsFromColors(["#000", "#f00", "#fff"]).map(stop => stop.position), [0, 50, 100]);
  assert.throws(() => stopsFromColors(["#000"]));
  for (const preset of gradientPresets) {
    assert.ok(buildGradient(options({ angle: preset.angle, stops: stopsFromColors(preset.colors) })).image);
  }
});

test("generates layered mesh gradients and an independent base color", () => {
  const result = buildMeshGradient({
    background: "#fff",
    points: [
      { color: "#f00", x: 40, y: 20, opacity: 100, spread: 50 },
      { color: "#00f", x: 80, y: 0, opacity: 100, spread: 60 },
    ],
  });
  assert.equal(
    result.image,
    "radial-gradient(at 40% 20%, #ff0000 0px, transparent 50%),\nradial-gradient(at 80% 0%, #0000ff 0px, transparent 60%)",
  );
  assert.equal(result.fallback, "#ffffff");
  assert.match(result.css, /^background-color: #ffffff;\nbackground-image:\n  radial-gradient/);
  assert.ok(result.css.endsWith("transparent 60%);"));
});

test("mesh preserves front-to-back layer order without mutating points", () => {
  const points = meshPreset.points.map(point => ({ ...point }));
  const before = structuredClone(points);
  const result = buildMeshGradient({ background: meshPreset.background, points });
  assert.equal((result.image.match(/radial-gradient\(/g) ?? []).length, 3);
  assert.ok(result.image.indexOf(points[0].color) < result.image.indexOf(points[1].color));
  assert.deepEqual(points, before);
});

test("mesh supports transparent and semi-transparent points", () => {
  const points = meshPreset.points.slice(0, 2).map((point, index) => ({ ...point, opacity: index ? 50 : 0 }));
  const result = buildMeshGradient({ background: "#fff", points });
  assert.match(result.image, /rgba\(255, 184, 122, 0\)/);
  assert.match(result.image, /rgba\(31, 221, 255, 0.5\)/);
});

test("mesh rejects invalid counts, colors, positions, opacity, and spread", () => {
  const create = overrides => ({ ...meshPreset.points[0], ...overrides });
  assert.throws(() => buildMeshGradient({ background: "#fff", points: [] }));
  assert.throws(() => buildMeshGradient({ background: "#fff", points: Array(9).fill(create({})) }));
  assert.throws(() => buildMeshGradient({ background: "red; color:blue", points: meshPreset.points }));
  for (
    const patch of [
      { color: "url(example)" },
      { x: -1 },
      { y: 101 },
      { x: NaN },
      { opacity: Infinity },
      { spread: 0 },
      { spread: 101 },
    ]
  ) {
    assert.throws(() => buildMeshGradient({ background: "#fff", points: [create(patch), create({})] }));
  }
});

test("the default mesh contains exactly three distinct colors", () => {
  assert.equal(meshPreset.points.length, 3);
  assert.equal(new Set(meshPreset.points.map(point => point.color)).size, 3);
});

test("maps pointer coordinates to rounded, clamped percentages at any preview size", () => {
  const bounds = { left: 100, top: 200, width: 400, height: 250 };
  assert.deepEqual(meshPositionFromPointer(300, 325, bounds), { x: 50, y: 50 });
  assert.deepEqual(meshPositionFromPointer(0, 900, bounds), { x: 0, y: 100 });
  assert.deepEqual(meshPositionFromPointer(180, 225, bounds), { x: 20, y: 10 });
  assert.deepEqual(meshPositionFromPointer(200, 262.5, { ...bounds, width: 200, height: 125 }), { x: 50, y: 50 });
  assert.throws(() => meshPositionFromPointer(0, 0, { ...bounds, width: 0 }));
  assert.throws(() => meshPositionFromPointer(NaN, 0, bounds));
});

test("linear stop guides follow CSS angles and keep endpoints inside non-square previews", () => {
  for (const [width, height] of [[640, 400], [280, 180], [180, 400]]) {
    for (const angle of [0, 45, 90, 120, 180, 270, 360, -45]) {
      const axis = gradientStopAxis(options({ angle }), width, height);
      const direction = { x: Math.sin(angle * Math.PI / 180), y: -Math.cos(angle * Math.PI / 180) };
      const delta = { x: axis.end.x - axis.start.x, y: axis.end.y - axis.start.y };
      assert.ok(Math.abs(delta.x * direction.y - delta.y * direction.x) < 1e-8);
      assert.ok(delta.x * direction.x + delta.y * direction.y > 0);
      for (const point of [axis.start, axis.end]) {
        assert.ok(point.x >= 18 - 1e-8 && point.x <= width - 18 + 1e-8);
        assert.ok(point.y >= 18 - 1e-8 && point.y <= height - 18 + 1e-8);
      }
      const midpoint = gradientStopPoint(axis, 50);
      assert.ok(Math.abs(midpoint.x - width / 2) < 1e-8);
      assert.ok(Math.abs(midpoint.y - height / 2) < 1e-8);
    }
  }
});

test("stop dragging projects onto the axis, ignores perpendicular movement, and clamps endpoints", () => {
  for (const angle of [0, 45, 90, 120, 270]) {
    const axis = gradientStopAxis(options({ angle }), 640, 400);
    for (const position of [0, 25, 50, 75, 100]) {
      const point = gradientStopPoint(axis, position);
      assert.equal(gradientStopPosition(axis, point.x, point.y), position);
      assert.equal(
        gradientStopPosition(axis, point.x - (axis.end.y - axis.start.y), point.y + (axis.end.x - axis.start.x)),
        position,
      );
    }
    assert.equal(gradientStopPosition(axis, 2 * axis.start.x - axis.end.x, 2 * axis.start.y - axis.end.y), 0);
    assert.equal(gradientStopPosition(axis, 2 * axis.end.x - axis.start.x, 2 * axis.end.y - axis.start.y), 100);
  }
});

test("radial stop guides run outward from the configured center and remain usable at the edges", () => {
  for (const [centerX, centerY] of [[50, 50], [0, 0], [100, 100], [25, 75]]) {
    const axis = gradientStopAxis(options({ type: "radial", centerX, centerY }), 640, 400);
    assert.deepEqual(axis.start, { x: 18 + centerX / 100 * 604, y: 18 + centerY / 100 * 364 });
    assert.ok(Math.hypot(axis.end.x - axis.start.x, axis.end.y - axis.start.y) > 0);
    for (const position of [0, 30, 100]) {
      const point = gradientStopPoint(axis, position);
      assert.equal(gradientStopPosition(axis, point.x, point.y), position);
    }
  }
});

test("stop guide geometry rejects invalid sizes, positions, and pointers", () => {
  assert.throws(() => gradientStopAxis(options(), 0, 400));
  assert.throws(() => gradientStopAxis(options(), 640, NaN));
  assert.throws(() => gradientStopAxis(options({ angle: NaN }), 640, 400));
  assert.throws(() => gradientStopAxis(options({ type: "radial", centerX: 101 }), 640, 400));
  const axis = gradientStopAxis(options(), 640, 400);
  assert.throws(() => gradientStopPoint(axis, 101));
  assert.throws(() => gradientStopPosition(axis, NaN, 0));
  assert.throws(() => gradientStopPosition({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } }, 0, 0));
});
