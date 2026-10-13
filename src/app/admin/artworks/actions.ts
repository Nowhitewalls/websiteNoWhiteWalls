"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { saveUploadedImage } from "@/lib/uploads";
import type { ArtworkStatus } from "@prisma/client";

function readArtworkFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const provenance = String(formData.get("provenance") ?? "").trim() || null;
  const dateEra = String(formData.get("dateEra") ?? "").trim() || null;
  const dimensions = String(formData.get("dimensions") ?? "").trim() || null;
  const condition = String(formData.get("condition") ?? "").trim() || null;
  const priceRaw = String(formData.get("price") ?? "").trim();
  const dominantColor = String(formData.get("dominantColor") ?? "").trim() || null;
  const oversized = formData.get("oversized") === "on";
  const isFavorite = formData.get("isFavorite") === "on";
  const categoryIdRaw = String(formData.get("categoryId") ?? "").trim();

  return {
    title,
    description,
    provenance,
    dateEra,
    dimensions,
    condition,
    price: priceRaw ? Number(priceRaw) : 0,
    dominantColor,
    oversized,
    isFavorite,
    categoryId: categoryIdRaw ? Number(categoryIdRaw) : null,
  };
}

export async function createArtwork(formData: FormData) {
  await requireAdmin();
  const fields = readArtworkFields(formData);
  if (!fields.title) redirect("/admin/artworks/new?error=missing-title");

  const slug = slugify(fields.title) + "-" + Date.now().toString(36);

  const artwork = await prisma.artwork.create({
    data: { ...fields, slug },
  });

  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const failures: string[] = [];
  let position = 0;
  for (const file of files) {
    try {
      const url = await saveUploadedImage(file);
      await prisma.artworkImage.create({ data: { artworkId: artwork.id, url, position: position++ } });
    } catch (err) {
      failures.push(err instanceof Error ? err.message : String(err));
    }
  }

  // Artwork (and any images that did upload) are saved either way — only
  // redirect back to edit with an error if some image(s) specifically failed,
  // so a bad file never loses the rest of the submission.
  if (failures.length > 0) {
    redirect(`/admin/artworks/${artwork.id}/edit?error=${encodeURIComponent(failures.join("; "))}`);
  }
  redirect("/admin/artworks");
}

export async function updateArtwork(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const fields = readArtworkFields(formData);
  const status = String(formData.get("status") ?? "AVAILABLE") as ArtworkStatus;

  if (!fields.title) redirect(`/admin/artworks/${id}/edit?error=missing-title`);

  await prisma.artwork.update({
    where: { id },
    data: { ...fields, status },
  });

  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const failures: string[] = [];
  if (files.length > 0) {
    const maxPosition = await prisma.artworkImage.aggregate({
      where: { artworkId: id },
      _max: { position: true },
    });
    let position = (maxPosition._max.position ?? -1) + 1;
    for (const file of files) {
      try {
        const url = await saveUploadedImage(file);
        await prisma.artworkImage.create({ data: { artworkId: id, url, position: position++ } });
      } catch (err) {
        failures.push(err instanceof Error ? err.message : String(err));
      }
    }
  }

  if (failures.length > 0) {
    redirect(`/admin/artworks/${id}/edit?error=${encodeURIComponent(failures.join("; "))}`);
  }
  redirect("/admin/artworks");
}

// Quick toggle from the artworks list, so marking a piece as a favorite
// doesn't require opening the full edit form.
export async function toggleFavorite(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const current = String(formData.get("current")) === "true";
  await prisma.artwork.update({ where: { id }, data: { isFavorite: !current } });
  redirect("/admin/artworks");
}

export async function deleteArtworkImage(formData: FormData) {
  await requireAdmin();
  const imageId = Number(formData.get("imageId"));
  const artworkId = Number(formData.get("artworkId"));
  await prisma.artworkImage.delete({ where: { id: imageId } });
  redirect(`/admin/artworks/${artworkId}/edit`);
}

// Quick "add more photos" from the edit page's image strip — independent
// of the rest of the form, so adding a photo never risks the text fields.
export async function addArtworkImages(formData: FormData) {
  await requireAdmin();
  const artworkId = Number(formData.get("artworkId"));
  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);

  const maxPosition = await prisma.artworkImage.aggregate({
    where: { artworkId },
    _max: { position: true },
  });
  let position = (maxPosition._max.position ?? -1) + 1;

  const failures: string[] = [];
  for (const file of files) {
    try {
      const url = await saveUploadedImage(file);
      await prisma.artworkImage.create({ data: { artworkId, url, position: position++ } });
    } catch (err) {
      failures.push(err instanceof Error ? err.message : String(err));
    }
  }

  if (failures.length > 0) {
    redirect(`/admin/artworks/${artworkId}/edit?error=${encodeURIComponent(failures.join("; "))}`);
  }
  redirect(`/admin/artworks/${artworkId}/edit`);
}

// Swaps an image's position with its left/right neighbor — the reorder
// arrows on the edit page's thumbnail strip.
export async function moveArtworkImage(formData: FormData) {
  await requireAdmin();
  const imageId = Number(formData.get("imageId"));
  const artworkId = Number(formData.get("artworkId"));
  const direction = String(formData.get("direction"));

  const images = await prisma.artworkImage.findMany({
    where: { artworkId },
    orderBy: { position: "asc" },
  });
  const index = images.findIndex((img) => img.id === imageId);
  const swapWith = direction === "left" ? index - 1 : index + 1;

  if (index >= 0 && swapWith >= 0 && swapWith < images.length) {
    const a = images[index];
    const b = images[swapWith];
    await prisma.$transaction([
      prisma.artworkImage.update({ where: { id: a.id }, data: { position: b.position } }),
      prisma.artworkImage.update({ where: { id: b.id }, data: { position: a.position } }),
    ]);
  }

  redirect(`/admin/artworks/${artworkId}/edit`);
}

// "Archive" — moves a sold piece out of the active Gallery into the
// permanent back-catalogue. Distinct from deleteArtwork (full removal).
export async function archiveArtwork(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.artwork.update({ where: { id }, data: { status: "ARCHIVED" } });
  redirect("/admin/artworks");
}

// Full permanent removal — for cases where a client wants the artwork
// taken down completely, not just archived.
export async function deleteArtwork(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  await prisma.artwork.delete({ where: { id } });
  redirect("/admin/artworks");
}
