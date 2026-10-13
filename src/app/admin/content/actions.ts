"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveUploadedImage } from "@/lib/uploads";

export async function updateContent(formData: FormData) {
  await requireAdmin();
  const key = String(formData.get("key") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/admin/content");
  if (!key) redirect(redirectTo);

  // Inline pencil-edit forms (on the live About page) each submit only the
  // one field they're editing — title, body, or image — so only touch a
  // field when it was actually present in this submission, otherwise a
  // single-field edit would null out the others.
  const data: { title?: string | null; body?: string | null; imageUrl?: string } = {};
  if (formData.has("title")) data.title = String(formData.get("title") ?? "").trim() || null;
  if (formData.has("body")) data.body = String(formData.get("body") ?? "").trim() || null;

  const file = formData.get("image");
  let imageError: string | undefined;
  if (file instanceof File && file.size > 0) {
    try {
      data.imageUrl = await saveUploadedImage(file);
    } catch (err) {
      imageError = err instanceof Error ? err.message : String(err);
    }
  }

  await prisma.siteContent.upsert({
    where: { key },
    create: { key, ...data },
    update: data,
  });

  if (imageError) {
    redirect(`/admin/content/${key}/edit?error=${encodeURIComponent(imageError)}`);
  }
  redirect(redirectTo);
}
