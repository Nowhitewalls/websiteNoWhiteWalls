import { theme } from "@/lib/theme";

// Shown to every logged-out visitor, on every route (not just "/") — the
// real site stays invisible to the public until launch, per "the outside
// world will just see the placeholder."
export default function Placeholder() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: theme.paper,
        color: theme.ink,
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 440, textAlign: "center" }}>
        <h1 style={{ fontFamily: theme.fontSerif, fontWeight: "normal", fontSize: "clamp(28px, 6vw, 40px)", letterSpacing: "0.04em", margin: "0 0 8px" }}>
          No White Walls
        </h1>
        <p style={{ fontSize: 14, letterSpacing: "0.14em", textTransform: "uppercase", color: theme.muted, margin: "0 0 40px" }}>
          Vintage and contemporary art
        </p>
        <p style={{ fontSize: 17, margin: "0 0 32px" }}>Our new home for the collection is on its way.</p>
        <div style={{ width: 48, height: 1, background: theme.line, margin: "32px auto" }} />
        <p>
          In the meantime, say hello at
          <br />
          <a href="mailto:hello@nowhitewalls.gallery" style={{ color: theme.ink, textDecoration: "underline", textUnderlineOffset: 4 }}>
            hello@nowhitewalls.gallery
          </a>
        </p>
        <footer style={{ marginTop: 40, fontSize: 12, color: theme.muted }}>&copy; 2026 No White Walls</footer>
      </div>
    </main>
  );
}
