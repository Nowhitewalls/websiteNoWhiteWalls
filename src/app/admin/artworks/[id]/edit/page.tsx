import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ArtworkForm from "../../ArtworkForm";
import { updateArtwork } from "../../actions";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

export default async function EditArtworkPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;

  const [artwork, categories] = await Promise.all([
    prisma.artwork.findUnique({
      where: { id: Number(id) },
      include: { images: { orderBy: { position: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!artwork) notFound();

  return (
    <main style={{ position: "relative", minHeight: "100vh", background: "#f4f1eb", color: "#56534e" }}>
      <SiteHeader isAdmin adminUsername={session.u} />
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "100px 24px 60px" }}>
        <p style={{ marginBottom: 24 }}>
          <Link href="/admin/artworks" style={{ color: "#56534e" }}>
            ← Artworks
          </Link>
        </p>
        <h1 style={{ fontWeight: "normal", fontSize: 28, marginBottom: 8 }}>Edit artwork</h1>
        <ArtworkForm action={updateArtwork} categories={categories} artwork={artwork} error={error} />
      </div>
    </main>
  );
}
