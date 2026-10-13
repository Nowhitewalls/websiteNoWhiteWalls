import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ArtworkForm from "../ArtworkForm";
import { createArtwork } from "../actions";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

export default async function NewArtworkPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await requireAdmin();
  const { error } = await searchParams;
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <main style={{ position: "relative", minHeight: "100vh", background: "#f4f1eb", color: "#56534e" }}>
      <SiteHeader isAdmin adminUsername={session.u} />
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "100px 24px 60px" }}>
        <p style={{ marginBottom: 24 }}>
          <Link href="/admin/artworks" style={{ color: "#56534e" }}>
            ← Artworks
          </Link>
        </p>
        <h1 style={{ fontWeight: "normal", fontSize: 28, marginBottom: 8 }}>New artwork</h1>
        <ArtworkForm action={createArtwork} categories={categories} error={error} />
      </div>
    </main>
  );
}
