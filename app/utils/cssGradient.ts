export interface GradientStop {
  color: string;
  position: number;
  opacity: number;
}
export interface GradientOptions {
  type: "linear" | "radial";
  angle: number;
  shape: "circle" | "ellipse";
  centerX: number;
  centerY: number;
  stops: GradientStop[];
}

export interface MeshPoint {
  color: string;
  x: number;
  y: number;
  opacity: number;
  spread: number;
}

export interface GradientAxis {
  start: { x: number; y: number };
  end: { x: number; y: number };
}

export function gradientStopAxis(
  options: Pick<GradientOptions, "type" | "angle" | "centerX" | "centerY">,
  width: number,
  height: number,
): GradientAxis {
  if (![width, height].every(Number.isFinite) || width <= 0 || height <= 0) {
    throw new Error("The gradient preview must have valid dimensions.");
  }
  const inset = Math.min(18, width / 4, height / 4);
  if (options.type === "radial") {
    const start = {
      x: inset + percentage(options.centerX, "Horizontal center") / 100 * (width - inset * 2),
      y: inset + percentage(options.centerY, "Vertical center") / 100 * (height - inset * 2),
    };
    return {
      start,
      end: { x: start.x <= width / 2 ? width - inset : inset, y: start.y <= height / 2 ? height - inset : inset },
    };
  }
  if (!Number.isFinite(options.angle)) throw new Error("Enter a valid angle.");
  const radians = options.angle * Math.PI / 180;
  const direction = { x: Math.sin(radians), y: -Math.cos(radians) };
  const reach = Math.min(
    Math.abs(direction.x) < 1e-10 ? Infinity : (width / 2 - inset) / Math.abs(direction.x),
    Math.abs(direction.y) < 1e-10 ? Infinity : (height / 2 - inset) / Math.abs(direction.y),
  );
  return {
    start: { x: width / 2 - direction.x * reach, y: height / 2 - direction.y * reach },
    end: { x: width / 2 + direction.x * reach, y: height / 2 + direction.y * reach },
  };
}

export function gradientStopPoint(axis: GradientAxis, position: number): { x: number; y: number } {
  const fraction = percentage(position, "Stop position") / 100;
  return {
    x: axis.start.x + (axis.end.x - axis.start.x) * fraction,
    y: axis.start.y + (axis.end.y - axis.start.y) * fraction,
  };
}

export function gradientStopPosition(axis: GradientAxis, x: number, y: number): number {
  const direction = { x: axis.end.x - axis.start.x, y: axis.end.y - axis.start.y };
  const lengthSquared = direction.x ** 2 + direction.y ** 2;
  if (![x, y, lengthSquared].every(Number.isFinite) || lengthSquared <= 0) {
    throw new Error("The gradient axis must have valid dimensions.");
  }
  const fraction = ((x - axis.start.x) * direction.x + (y - axis.start.y) * direction.y) / lengthSquared;
  return Math.max(0, Math.min(100, Math.round(fraction * 100)));
}

export const meshPreset: { name: string; background: string; points: MeshPoint[] } = {
  name: "Pastel mesh",
  background: "#ffffff",
  points: [
    { color: "#ffb87a", x: 25, y: 25, opacity: 100, spread: 80 },
    { color: "#1fddff", x: 80, y: 20, opacity: 100, spread: 80 },
    { color: "#6b66ff", x: 45, y: 80, opacity: 100, spread: 80 },
  ],
};

export const gradientPresets: { name: string; angle: number; colors: string[] }[] = [
  { name: "Coast", angle: 120, colors: ["#0284c7", "#2dd4bf"] },
  { name: "Signal", angle: 135, colors: ["#dc2626", "#fb923c", "#fde047"] },
  { name: "Orchard", angle: 90, colors: ["#14532d", "#84cc16", "#fef08a"] },
  { name: "Ink", angle: 150, colors: ["#0f172a", "#64748b", "#e2e8f0"] },
];

export function normalizeHex(value: string): string {
  const color = value.trim().toLowerCase();
  if (!/^#[a-f0-9]{3}(?:[a-f0-9]{3})?$/.test(color)) throw new Error("Use a 3- or 6-digit hex color, such as #0ea5e9.");
  return color.length === 4 ? `#${[...color.slice(1)].map(character => character + character).join("")}` : color;
}

function percentage(value: number, label: string): number {
  if (!Number.isFinite(value) || value < 0 || value > 100) throw new Error(`${label} must be between 0 and 100.`);
  return Number(value.toFixed(2));
}

export function meshPositionFromPointer(
  clientX: number,
  clientY: number,
  bounds: { left: number; top: number; width: number; height: number },
): { x: number; y: number } {
  if (
    ![clientX, clientY, bounds.left, bounds.top, bounds.width, bounds.height].every(Number.isFinite)
    || bounds.width <= 0 || bounds.height <= 0
  ) {
    throw new Error("The mesh preview must have valid dimensions.");
  }
  return {
    x: Math.max(0, Math.min(100, Math.round((clientX - bounds.left) / bounds.width * 100))),
    y: Math.max(0, Math.min(100, Math.round((clientY - bounds.top) / bounds.height * 100))),
  };
}

function colorWithOpacity(color: string, opacity: number): string {
  if (opacity === 100) return color;
  const channels = [0, 2, 4].map(offset => Number.parseInt(color.slice(offset + 1, offset + 3), 16));
  return `rgba(${channels.join(", ")}, ${Number((opacity / 100).toFixed(4))})`;
}

export function buildMeshGradient(
  options: { background: string; points: MeshPoint[] },
): { image: string; fallback: string; css: string } {
  const fallback = normalizeHex(options.background);
  if (options.points.length < 2 || options.points.length > 8) throw new Error("Use between 2 and 8 mesh points.");
  const layers = options.points.map(point => {
    const color = colorWithOpacity(normalizeHex(point.color), percentage(point.opacity, "Opacity"));
    const x = percentage(point.x, "Horizontal position");
    const y = percentage(point.y, "Vertical position");
    const spread = percentage(point.spread, "Spread");
    if (spread < 1) throw new Error("Point spread must be between 1 and 100.");
    return `radial-gradient(at ${x}% ${y}%, ${color} 0px, transparent ${spread}%)`;
  });
  const image = layers.join(",\n");
  return { image, fallback, css: `background-color: ${fallback};\nbackground-image:\n  ${layers.join(",\n  ")};` };
}

export function buildGradient(options: GradientOptions): { image: string; fallback: string; css: string } {
  if (options.type !== "linear" && options.type !== "radial") throw new Error("Choose a linear or radial gradient.");
  if (options.stops.length < 2 || options.stops.length > 8) throw new Error("Use between 2 and 8 color stops.");
  const stops = options.stops.map(stop => ({
    color: normalizeHex(stop.color),
    position: percentage(stop.position, "Stop position"),
    opacity: percentage(stop.opacity, "Opacity"),
  })).sort((first, second) => first.position - second.position);
  const colorAt = (stop: typeof stops[number]) => colorWithOpacity(stop.color, stop.opacity);
  const colors = stops.map(stop => `${colorAt(stop)} ${stop.position}%`).join(", ");
  let image: string;
  if (options.type === "linear") {
    if (!Number.isFinite(options.angle)) throw new Error("Enter a valid angle.");
    const angle = Number((((options.angle % 360) + 360) % 360).toFixed(2)) % 360;
    image = `linear-gradient(${angle}deg, ${colors})`;
  } else {
    if (options.shape !== "circle" && options.shape !== "ellipse") {
      throw new Error("Choose a circular or elliptical radial shape.");
    }
    image = `radial-gradient(${options.shape} at ${percentage(options.centerX, "Horizontal center")}% ${
      percentage(options.centerY, "Vertical center")
    }%, ${colors})`;
  }
  const fallback = colorAt(stops[0]!);
  return { image, fallback, css: `background: ${fallback};\nbackground: ${image};` };
}

export function reverseGradientStops<Stop extends GradientStop>(stops: Stop[]): Stop[] {
  return stops.map(stop => ({ ...stop, position: 100 - stop.position })).reverse();
}

export function stopsFromColors(colors: string[]): GradientStop[] {
  if (colors.length < 2 || colors.length > 8) throw new Error("Use between 2 and 8 colors.");
  return colors.map((color, index) => ({
    color: normalizeHex(color),
    position: Number((index / (colors.length - 1) * 100).toFixed(2)),
    opacity: 100,
  }));
}
