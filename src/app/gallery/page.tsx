import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { theme } from "@/lib/theme";
import { DOMINANT_COLORS } from "@/lib/constants";
import Placeholder from "@/components/Placeholder";
import SiteHeader from "@/components/SiteHeader";
import ColorFilter from "@/components/ColorFilter";
import type { ArtworkStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; color?: string }>;
}) {
  const session = await getSession();
  if (!session) return <Placeholder />;

  const { category, color } = await searchParams;

  // Archived pieces have their own back-catalogue page (not built yet) —
  // the live Gallery only ever shows available and sold work.
  const visibleWhere = { status: { in: ["AVAILABLE", "SOLD"] as ArtworkStatus[] }, published: true };

  const [artworks, categoriesWithCounts] = await Promise.all([
    prisma.artwork.findMany({
      where: {
        ...visibleWhere,
        ...(category ? { category: { slug: category } } : {}),
        ...(color ? { dominantColor: color } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: { images: { orderBy: { position: "asc" }, take: 1 }, category: true },
    }),
    prisma.category.findMany({
      where: { artworks: { some: visibleWhere } },
      orderBy: { name: "asc" },
    }),
  ]);

  // Only offer color swatches that at least one visible artwork actually
  // uses — same "don't show empty filters" rule as categories.
  const usedColors = new Set(
    (await prisma.artwork.findMany({ where: visibleWhere, select: { dominantColor: true } }))
      .map((a) => a.dominantColor)
      .filter((c): c is string => Boolean(c))
  );

  const filterLinkStyle = (active: boolean): React.CSSProperties => ({
    fontSize: 13,
    color: active ? theme.ink : theme.muted,
    textDecoration: "none",
    borderBottom: active ? `1px solid ${theme.ink}` : "1px solid transparent",
    paddingBottom: 2,
  });

  return (
    <main style={{ minHeight: "100vh", background: theme.paper }}>
      <SiteHeader isAdmin adminUsername={session.u} />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "100px 24px 60px" }}>
        <h1 style={{ fontFamily: theme.fontSerif, fontWeight: "normal", fontSize: 32, color: theme.ink, marginBottom: 12 }}>Gallery</h1>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link href="/gallery" style={filterLinkStyle(!category)}>
              All works
            </Link>
            {categoriesWithCounts.map((c) => (
              <Link
                key={c.id}
                href={`/gallery?category=${c.slug}${color ? `&color=${color}` : ""}`}
                style={filterLinkStyle(category === c.slug)}
              >
                {c.name}
              </Link>
            ))}
          </div>

          <ColorFilter
            colors={DOMINANT_COLORS.filter((c) => usedColors.has(c.value))}
            activeColor={color}
            categorySlug={category}
          />
        </div>

        {artworks.length === 0 && <p style={{ color: theme.muted }}>No works to show yet.</p>}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
          {artworks.map((a) => (
            <Link
              key={a.id}
              href={`/gallery/${a.slug}`}
              style={{ position: "relative", display: "block", textDecoration: "none" }}
            >
              <div style={{ position: "relative", aspectRatio: "1 / 1", background: theme.line, overflow: "hidden" }}>
                {a.images[0]?.url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.images[0].url} alt={a.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
                {a.status === "SOLD" && (
                  <span
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      background: theme.paper,
                      color: theme.ink,
                      fontSize: 11,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "3px 8px",
                    }}
                  >
                    Sold
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
