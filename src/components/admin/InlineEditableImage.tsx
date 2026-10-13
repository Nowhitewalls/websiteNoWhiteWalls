"use client";

import { useRef } from "react";
import { theme } from "@/lib/theme";

// Default variant: a block <img> with a pencil in the corner (used on the
// About page). "background" variant: a full-bleed CSS background-image
// with arbitrary children on top (used for the homepage hero, which needs
// to fill the viewport rather than sit as an inline <img>).
export default function InlineEditableImage({
  imageUrl,
  action,
  hiddenFields,
  variant = "block",
  children,
  minHeight,
}: {
  imageUrl: string | null;
  action: (formData: FormData) => void;
  hiddenFields: Record<string, string>;
  variant?: "block" | "background";
  children?: React.ReactNode;
  minHeight?: string | number;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  if (variant === "background") {
    return (
      <form
        ref={formRef}
        action={action}
        encType="multipart/form-data"
        style={{
          position: "relative",
          minHeight,
          backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {Object.entries(hiddenFields).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
        {children}
        <label
          title="Change image"
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            zIndex: 11,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            background: theme.paper,
            border: `1px solid ${theme.line}`,
            borderRadius: "50%",
            cursor: "pointer",
            color: theme.muted,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          <input
            type="file"
            name="image"
            accept="image/*"
            style={{ display: "none" }}
            onChange={() => formRef.current?.requestSubmit()}
          />
        </label>
      </form>
    );
  }

  return (
    <form ref={formRef} action={action} encType="multipart/form-data" style={{ position: "relative", marginBottom: 24 }}>
      {Object.entries(hiddenFields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}

      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" style={{ width: "100%", display: "block" }} />
      ) : (
        <div style={{ width: "100%", aspectRatio: "16 / 9", background: theme.line }} />
      )}

      <label
        title="Change image"
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          background: theme.paper,
          border: `1px solid ${theme.line}`,
          borderRadius: "50%",
          cursor: "pointer",
          color: theme.muted,
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
        <input
          type="file"
          name="image"
          accept="image/*"
          style={{ display: "none" }}
          onChange={() => formRef.current?.requestSubmit()}
        />
      </label>
    </form>
  );
}
