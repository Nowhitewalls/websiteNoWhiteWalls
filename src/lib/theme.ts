// Shared design tokens for the public site. "paper" is intentionally very
// subtly off-white (not the warmer cream used in early mockups) — Tori's
// explicit note: "background color ever so slightly off-white".
export const theme = {
  paper: "#fcfbfa",
  ink: "#56534e",
  muted: "#77716a",
  line: "#e9e6e0",
  // CSS variables set up in layout.tsx via next/font.
  fontSans: "var(--font-sans), sans-serif",
  fontSerif: "var(--font-serif), serif",
} as const;

// Not yet registered — fill in once Tori sets up the actual accounts.
export const SOCIAL_LINKS = {
  instagram: "",
  pinterest: "",
} as const;
