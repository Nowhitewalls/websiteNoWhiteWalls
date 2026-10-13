import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { theme } from "@/lib/theme";
import Placeholder from "@/components/Placeholder";
import SiteHeader from "@/components/SiteHeader";
import InlineEditableImage from "@/components/admin/InlineEditableImage";
import { updateContent } from "@/app/admin/content/actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getSession();
  if (!session) return <Placeholder />;

  const [hero, favorites] = await Promise.all([
    prisma.siteContent.findUnique({ where: { key: "homepage" } }),
    prisma.artwork.findMany({
      where: { isFavorite: true, status: { in: ["AVAILABLE", "SOLD"] }, published: true },
      orderBy: { updatedAt: "desc" },
      take: 6,
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
    }),
  ]);

  return (
    <main style={{ position: "relative", minHeight: "100vh", background: theme.paper }}>
      <SiteHeader transparent={Boolean(hero?.imageUrl)} isAdmin adminUsername={session.u} />

      <InlineEditableImage
        imageUrl={hero?.imageUrl ?? null}
        action={updateContent}
        hiddenFields={{ key: "homepage", redirectTo: "/" }}
        variant="background"
        minHeight="100vh"
      >
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!hero?.imageUrl && (
          <p style={{ position: "absolute", top: 80, color: theme.muted, fontSize: 13 }}>
            No homepage photo set yet — click the pencil (bottom right) to add one.
          </p>
        )}

        <div
          style={{
            background: theme.paper,
            padding: "32px 40px",
            textAlign: "center",
            boxShadow: hero?.imageUrl ? "0 2px 24px rgba(0,0,0,0.12)" : "none",
          }}
        >
          <h1 style={{ fontFamily: theme.fontSerif, fontWeight: "normal", fontSize: "clamp(28px, 5vw, 44px)", letterSpacing: "0.04em", margin: "0 0 8px", color: theme.ink }}>
            No White Walls
          </h1>
          <p style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: theme.muted, margin: "0 0 24px" }}>
            Vintage and contemporary art
          </p>
          <Link
            href="/gallery"
            style={{
              display: "inline-block",
              padding: "12px 28px",
              background: theme.ink,
              color: theme.paper,
              textDecoration: "none",
              fontSize: 13,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Enter Gallery
          </Link>
        </div>
      </div>
      </InlineEditableImage>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 24px" }}>
        <h2 style={{ fontFamily: theme.fontSerif, fontWeight: "normal", fontSize: 24, color: theme.ink, textAlign: "center", marginBottom: 32 }}>
          Tori&apos;s Favorites
        </h2>

        {favorites.length === 0 ? (
          <p style={{ color: theme.muted, textAlign: "center", fontSize: 13 }}>
            No favorites picked yet — mark some in Admin → Artworks.
          </p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {favorites.map((a) => (
              <Link key={a.id} href={`/gallery/${a.slug}`} style={{ display: "block", textDecoration: "none" }}>
                <div style={{ aspectRatio: "1 / 1", background: theme.line, overflow: "hidden" }}>
                  {a.images[0]?.url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.images[0].url} alt={a.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
