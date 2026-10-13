"use client";

import { useRef, useState } from "react";
import { theme } from "@/lib/theme";

const PencilButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 28,
      height: 28,
      marginLeft: 8,
      background: theme.paper,
      border: `1px solid ${theme.line}`,
      borderRadius: "50%",
      cursor: "pointer",
      color: theme.muted,
      verticalAlign: "middle",
    }}
  >
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  </button>
);

// Plain-text inline field (used for the About title) — pencil to edit,
// saves via the given server action on blur/submit.
export function InlineEditableTitle({
  value,
  action,
  fieldName,
  hiddenFields,
  style,
}: {
  value: string;
  action: (formData: FormData) => void;
  fieldName: string;
  hiddenFields: Record<string, string>;
  style?: React.CSSProperties;
}) {
  const [editing, setEditing] = useState(false);
  if (!editing) {
    return (
      <span>
        <span style={style}>{value}</span>
        <PencilButton label="Edit title" onClick={() => setEditing(true)} />
      </span>
    );
  }
  return (
    <form action={action} style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {Object.entries(hiddenFields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <input
        name={fieldName}
        defaultValue={value}
        autoFocus
        style={{ ...style, border: `1px solid ${theme.line}`, padding: "4px 8px", background: "#fff" }}
      />
      <button type="submit" style={{ fontSize: 12, color: theme.ink, background: "none", border: "none", cursor: "pointer" }}>
        Save
      </button>
      <button type="button" onClick={() => setEditing(false)} style={{ fontSize: 12, color: theme.muted, background: "none", border: "none", cursor: "pointer" }}>
        Cancel
      </button>
    </form>
  );
}

// Rich-ish text block (bold/italic only) for the About body — pencil to
// edit in place, minimal toolbar, saves as HTML via the server action.
export function InlineEditableBody({
  valueHtml,
  action,
  fieldName,
  hiddenFields,
  placeholder,
}: {
  valueHtml: string;
  action: (formData: FormData) => void;
  fieldName: string;
  hiddenFields: Record<string, string>;
  placeholder: string;
}) {
  const [editing, setEditing] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  if (!editing) {
    return (
      <div>
        {valueHtml ? (
          <div style={{ color: theme.ink, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: valueHtml }} />
        ) : (
          <p style={{ color: theme.muted }}>{placeholder}</p>
        )}
        <PencilButton label="Edit text" onClick={() => setEditing(true)} />
      </div>
    );
  }

  return (
    <form
      action={action}
      onSubmit={() => {
        if (hiddenInputRef.current && editableRef.current) {
          hiddenInputRef.current.value = editableRef.current.innerHTML;
        }
      }}
    >
      {Object.entries(hiddenFields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <input ref={hiddenInputRef} type="hidden" name={fieldName} />

      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => document.execCommand("bold")}
          style={{ width: 28, height: 28, border: `1px solid ${theme.line}`, background: "#fff", cursor: "pointer", fontWeight: "bold" }}
        >
          B
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => document.execCommand("italic")}
          style={{ width: 28, height: 28, border: `1px solid ${theme.line}`, background: "#fff", cursor: "pointer", fontStyle: "italic" }}
        >
          I
        </button>
      </div>

      <div
        ref={editableRef}
        contentEditable
        suppressContentEditableWarning
        dangerouslySetInnerHTML={{ __html: valueHtml }}
        style={{
          minHeight: 160,
          padding: 12,
          border: `1px solid ${theme.line}`,
          background: "#fff",
          lineHeight: 1.7,
          color: theme.ink,
        }}
      />

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button type="submit" style={{ fontSize: 13, color: theme.paper, background: theme.ink, border: "none", padding: "8px 16px", cursor: "pointer" }}>
          Save
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          style={{ fontSize: 13, color: theme.muted, background: "none", border: "none", cursor: "pointer" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
