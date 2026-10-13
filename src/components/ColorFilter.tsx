"use client";

import { useState } from "react";
import Link from "next/link";
import { theme } from "@/lib/theme";
import { DOMINANT_COLORS } from "@/lib/constants";

type Swatch = (typeof DOMINANT_COLORS)[number];

export default function ColorFilter({
  colors,
  activeColor,
  categorySlug,
}: {
  colors: Swatch[];
  activeColor?: string;
  categorySlug?: string;
}) {
  const [open, setOpen] = useState(false);

  if (colors.length === 0) return null;

  const base = categorySlug ? `/gallery?category=${categorySlug}` : "/gallery";

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          background: "none",
          border: "none",
          borderBottom: activeColor ? `1px solid ${theme.ink}` : "1px solid transparent",
          padding: 0,
          paddingBottom: 2,
          fontSize: 13,
          color: activeColor ? theme.ink : theme.muted,
          cursor: "pointer",
        }}
      >
        Filter{activeColor ? ` · ${colors.find((c) => c.value === activeColor)?.label ?? ""}` : ""}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            zIndex: 5,
            background: theme.paper,
            border: `1px solid ${theme.line}`,
            padding: 16,
            minWidth: 160,
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          <p style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: theme.muted, margin: "0 0 10px" }}>
            Colour
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link
              href={base}
              onClick={() => setOpen(false)}
              style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, textDecoration: "none", color: !activeColor ? theme.ink : theme.muted }}
            >
              <span style={{ width: 14, height: 14, borderRadius: "50%", border: `1px solid ${theme.line}`, display: "inline-block" }} />
              All colours
            </Link>
            {colors.map((c) => (
              <Link
                key={c.value}
                href={`${base}${categorySlug ? "&" : "?"}color=${c.value}`}
                onClick={() => setOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, textDecoration: "none", color: activeColor === c.value ? theme.ink : theme.muted }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: c.swatch,
                    border: activeColor === c.value ? `2px solid ${theme.ink}` : `1px solid ${theme.line}`,
                    display: "inline-block",
                  }}
                />
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
