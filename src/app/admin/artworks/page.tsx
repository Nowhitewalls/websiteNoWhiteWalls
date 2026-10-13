import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { archiveArtwork, deleteArtwork, toggleFavorite } from "./actions";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: "Available",
  SOLD: "Sold",
  ARCHIVED: "Archived",
};

export default async function ArtworksAdminPage() {
  const session = await requireAdmin();

  const artworks = await prisma.artwork.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, images: { orderBy: { position: "asc" }, take: 1 } },
  });

  return (
    <main style={{ position: "relative", minHeight: "100vh", background: "#f4f1eb", color: "#56534e" }}>
      <SiteHeader isAdmin adminUsername={session.u} />
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "100px 24px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 style={{ fontWeight: "normal", fontSize: 28 }}>Artworks</h1>
          <Link
            href="/admin/artworks/new"
            style={{ padding: "8px 16px", background: "#56534e", color: "#f4f1eb", fontSize: 14, textDecoration: "none" }}
          >
            + New artwork
          </Link>
        </div>

        {artworks.length === 0 && <p style={{ color: "#77716a" }}>No artworks yet.</p>}

        <ul style={{ listStyle: "none", padding: 0 }}>
          {artworks.map((a) => (
            <li
              key={a.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 0",
                borderBottom: "1px solid #d9d3c9",
              }}
            >
              {/* An empty src="" makes the browser re-request the current
                  page as an "image", which always fails — so only render
                  an <img> when there's actually a URL, otherwise show a
                  plain placeholder box. */}
              {a.images[0]?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={a.images[0].url}
                  alt=""
                  style={{ width: 56, height: 56, objectFit: "cover", background: "#e8e4db", flexShrink: 0 }}
                />
              ) : (
                <div style={{ width: 56, height: 56, background: "#e8e4db", flexShrink: 0 }} />
              )}
              <div style={{ flex: 1 }}>
                <div>{a.title}</div>
                <div style={{ fontSize: 13, color: "#77716a" }}>
                  {a.category?.name ?? "No category"} · €{String(a.price)} · {STATUS_LABEL[a.status]}
                </div>
              </div>
              <Link href={`/admin/artworks/${a.id}/edit`} style={{ color: "#56534e", fontSize: 13 }}>
                Edit
              </Link>
              <form action={toggleFavorite}>
                <input type="hidden" name="id" value={a.id} />
                <input type="hidden" name="current" value={String(a.isFavorite)} />
                <button
                  type="submit"
                  title={a.isFavorite ? "Remove from Tori's Favorites" : "Add to Tori's Favorites"}
                  style={{ background: "none", border: "none", color: a.isFavorite ? "#56534e" : "#c9c2b6", fontSize: 18, cursor: "pointer", lineHeight: 1 }}
                >
                  {a.isFavorite ? "★" : "☆"}
                </button>
              </form>
              {a.status !== "ARCHIVED" && (
                <form action={archiveArtwork}>
                  <input type="hidden" name="id" value={a.id} />
                  <button type="submit" style={{ background: "none", border: "none", color: "#56534e", fontSize: 13, cursor: "pointer" }}>
                    Archive
                  </button>
                </form>
              )}
              <form action={deleteArtwork}>
                <input type="hidden" name="id" value={a.id} />
                <button type="submit" style={{ background: "none", border: "none", color: "#a33", fontSize: 13, cursor: "pointer" }}>
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
