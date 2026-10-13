"use client";

import { useState } from "react";
import Link from "next/link";
import { theme, SOCIAL_LINKS } from "@/lib/theme";
import { logout } from "@/app/admin/actions";

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

// Single menu used everywhere, public pages and admin alike, so there's
// only ever one navigation language on the site. When isAdmin is true it
// grows a couple of extra affordances: a pencil next to the pages that
// have inline editing (Home, About), and a "Welcome, {name}" section
// below the normal links with the backoffice shortcuts and sign out.
export default function SiteHeader({
  transparent = false,
  isAdmin = false,
  adminUsername,
}: {
  transparent?: boolean;
  isAdmin?: boolean;
  adminUsername?: string;
}) {
  const [open, setOpen] = useState(false);

  const navLinkStyle: React.CSSProperties = {
    fontSize: "clamp(22px, 5.5vw, 28px)",
    color: theme.ink,
    textDecoration: "none",
    fontFamily: theme.fontSerif,
    display: "flex",
    alignItems: "center",
    gap: 10,
  };

  return (
    <>
      <header
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          padding: "20px 24px",
          background: transparent ? "transparent" : theme.paper,
        }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          style={{ justifySelf: "start", background: "none", border: "none", padding: 8, cursor: "pointer" }}
        >
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
            <line x1="0" y1="1" x2="22" y2="1" stroke={theme.ink} strokeWidth="1.5" />
            <line x1="0" y1="8" x2="22" y2="8" stroke={theme.ink} strokeWidth="1.5" />
            <line x1="0" y1="15" x2="22" y2="15" stroke={theme.ink} strokeWidth="1.5" />
          </svg>
        </button>

        <Link href="/" style={{ justifySelf: "center", textAlign: "center", textDecoration: "none" }}>
          <div style={{ fontFamily: theme.fontSerif, fontSize: 17, letterSpacing: "0.1em", color: theme.ink }}>
            No White Walls
          </div>
          <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: theme.muted, marginTop: 2 }}>
            Vintage and contemporary art
          </div>
        </Link>

        <div style={{ justifySelf: "end", display: "flex", gap: 16 }}>
          {/* Hrefs are placeholders until the accounts are registered —
              SOCIAL_LINKS in @/lib/theme. */}
          <a href={SOCIAL_LINKS.instagram || "#"} aria-label="Instagram" style={{ color: theme.ink }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a href={SOCIAL_LINKS.pinterest || "#"} aria-label="Pinterest" style={{ color: theme.ink }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M9 18c1-3 1.5-5.5 2-8.5a2.5 2.5 0 1 1 3 2c0 1.5-1 3-2.5 3" />
            </svg>
          </a>
        </div>
      </header>

      {open && (
        <>
          {/* Backdrop over the rest of the page — click to dismiss. */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 19, background: "rgba(0,0,0,0.25)" }}
          />
          {/* Side panel — full width on narrow phones, caps at 420px so it
              reads as "half page" on anything wider, per Tori's feedback
              that a full-screen menu felt too intrusive. */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: "90%",
              maxWidth: 420,
              zIndex: 20,
              background: theme.paper,
              boxShadow: "4px 0 24px rgba(0,0,0,0.1)",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              padding: "80px 24px 40px",
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", fontSize: 28, color: theme.ink, cursor: "pointer" }}
            >
              ×
            </button>

            {/* Archive, Contact and Shipping/Returns join this list once those pages exist. */}
            <Link href="/" onClick={() => setOpen(false)} style={navLinkStyle}>
              Home
              {isAdmin && <PencilIcon />}
            </Link>
            <Link href="/gallery" onClick={() => setOpen(false)} style={navLinkStyle}>
              Gallery
            </Link>
            <Link href="/about" onClick={() => setOpen(false)} style={navLinkStyle}>
              About
              {isAdmin && <PencilIcon />}
            </Link>

            {isAdmin && (
              <>
                <div style={{ width: 48, height: 1, background: theme.line, margin: "10px 0" }} />
                <p style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: theme.muted, margin: 0 }}>
                  Welcome, {adminUsername}
                </p>
                <Link href="/admin" onClick={() => setOpen(false)} style={{ fontSize: 15, color: theme.muted, textDecoration: "none" }}>
                  Dashboard
                </Link>
                <Link href="/admin/artworks" onClick={() => setOpen(false)} style={{ fontSize: 15, color: theme.muted, textDecoration: "none" }}>
                  Artworks
                </Link>
                <Link href="/admin/categories" onClick={() => setOpen(false)} style={{ fontSize: 15, color: theme.muted, textDecoration: "none" }}>
                  Categories
                </Link>
                <form action={logout}>
                  <button type="submit" style={{ fontSize: 15, color: theme.muted, background: "none", border: "none", cursor: "pointer" }}>
                    Sign out
                  </button>
                </form>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
