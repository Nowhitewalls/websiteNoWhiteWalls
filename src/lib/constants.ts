// Preset dominant-color swatches for artwork filtering (manually tagged by
// Tori per piece, not auto-detected from the image). Keep this editable
// in code rather than the DB schema, since the palette may evolve.
export const DOMINANT_COLORS = [
  { value: "warm-neutral", label: "Warm neutral", swatch: "#c9b79c" },
  { value: "cool-neutral", label: "Cool neutral", swatch: "#b8bcc2" },
  { value: "black-dark", label: "Black / dark", swatch: "#2a2a2a" },
  { value: "white-cream", label: "White / cream", swatch: "#f4f1eb" },
  { value: "blue", label: "Blue", swatch: "#3b5c82" },
  { value: "green", label: "Green", swatch: "#4b6b4f" },
  { value: "red-pink", label: "Red / pink", swatch: "#a84c4c" },
  { value: "yellow-orange", label: "Yellow / orange", swatch: "#d19a3d" },
  { value: "multicolor", label: "Multicolor", swatch: "conic-gradient(red, orange, yellow, green, blue, violet, red)" },
] as const;

export type DominantColor = (typeof DOMINANT_COLORS)[number]["value"];
