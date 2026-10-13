"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) redirect("/admin/categories?error=empty-name");

  const slug = slugify(name);
  await prisma.category.create({ data: { name, slug } });
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));

  const artworkCount = await prisma.artwork.count({ where: { categoryId: id } });
  if (artworkCount > 0) {
    redirect("/admin/categories?error=in-use");
  }

  await prisma.category.delete({ where: { id } });
  redirect("/admin/categories");
}
