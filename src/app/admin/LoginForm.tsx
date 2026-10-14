"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { login } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        width: "100%",
        padding: "12px 0",
        background: "#56534e",
        color: "#f4f1eb",
        border: "none",
        fontSize: 14,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        cursor: pending ? "default" : "pointer",
        opacity: pending ? 0.7 : 1,
      }}
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useFormState(login, undefined);
  // Visible by default — type="password" triggers Safari/iOS's Keychain
  // overlay, which can block normal copy/paste and swallow taps on nearby
  // buttons. Plain text avoids that; the toggle below can still mask it.
  const [showPassword, setShowPassword] = useState(true);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d9d3c9",
    background: "#fff",
    fontSize: 15,
    boxSizing: "border-box",
  };

  return (
    <form action={formAction} style={{ maxWidth: 320, margin: "0 auto" }}>
      <label style={{ display: "block", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#77716a", marginBottom: 6 }}>
        Username
      </label>
      <input name="username" type="text" autoComplete="username" required style={{ ...inputStyle, marginBottom: 14 }} />

      <label style={{ display: "block", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#77716a", marginBottom: 6 }}>
        Password
      </label>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          required
          style={{ ...inputStyle, flex: 1 }}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-pressed={showPassword}
          style={{
            padding: "0 14px",
            border: "1px solid #d9d3c9",
            background: "#fff",
            color: "#56534e",
            fontSize: 12,
            letterSpacing: "0.04em",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      {state?.error && (
        <p style={{ color: "#a33", fontSize: 13, marginTop: -4, marginBottom: 14 }}>{state.error}</p>
      )}

      <SubmitButton />
    </form>
  );
}
