"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession, verifyCredentials } from "@/lib/auth";

export async function login(_prevState: { error?: string } | undefined, formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!verifyCredentials(username, password)) {
    return { error: "Incorrect username or password." };
  }

  await createSession(username);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/");
}
