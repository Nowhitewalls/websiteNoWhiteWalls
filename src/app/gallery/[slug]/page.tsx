import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { theme } from "@/lib/theme";
import Placeholder from "@/components/Placeholder";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

const FACT_LABELS: Record<string, string> = {
  provenance: "Provenance",
  dateEra: "Date / era",
  dimensions: "Dimensions",
  condition: "Condition",
};

export default async function ArtworkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await getSession();
  if (!session) return <Placeholder />;

  const { slug } = await params;
  const artwork = await prisma.artwork.findUnique({
    where: { slug },
    include: { images: { orderBy: { position: "asc" } }, categories: true },
  });

  if (!artwork || artwork.status === "ARCHIVED") notFound();

  const facts = (["provenance", "dateEra", "dimensions", "condition"] as const).filter(
    (key) => artwork[key]
  );

  return (
    <main style={{ minHeight: "100vh", background: theme.paper }}>
      <SiteHeader isAdmin adminUsername={session.u} />
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "100px 24px 60px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
        }}
      >
        <div>
          {artwork.images[0]?.url ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {artwork.images.map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={img.id} src={img.url} alt={artwork.title} style={{ width: "100%", display: "block" }} />
              ))}
            </div>
          ) : (
            <div style={{ aspectRatio: "1 / 1", background: theme.line }} />
          )}
        </div>

        <div>
          <h1 style={{ fontFamily: theme.fontSerif, fontWeight: "normal", fontSize: 28, color: theme.ink, margin: "0 0 4px" }}>{artwork.title}</h1>
          {artwork.categories.length > 0 && (
            <p style={{ fontSize: 13, color: theme.muted, marginBottom: 20 }}>
              {artwork.categories.map((c) => c.name).join(", ")}
            </p>
          )}

          {artwork.description && <p style={{ color: theme.ink, marginBottom: 24 }}>{artwork.description}</p>}

          {facts.length > 0 && (
            <dl style={{ marginBottom: 24 }}>
              {facts.map((key) => (
                <div key={key} style={{ display: "flex", gap: 8, fontSize: 14, marginBottom: 8 }}>
                  <dt style={{ color: theme.muted, minWidth: 120 }}>{FACT_LABELS[key]}</dt>
                  <dd style={{ margin: 0, color: theme.ink }}>{artwork[key]}</dd>
                </div>
              ))}
            </dl>
          )}

          {/* Price (and purchase) is hidden from the frontend entirely once
              sold — only visible in the admin from that point on. */}
          {artwork.status === "AVAILABLE" && (
            <>
              <p style={{ fontSize: 20, color: theme.ink, marginBottom: 20 }}>
                {artwork.price != null ? `€${String(artwork.price)}` : "Price not set"}
              </p>
              <p style={{ fontSize: 13, color: theme.muted }}>
                {artwork.oversized
                  ? "This piece is oversized — purchase enquiry coming soon."
                  : "Checkout coming soon."}
              </p>
            </>
          )}
          {artwork.status === "SOLD" && (
            <p style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", color: theme.muted }}>Sold</p>
          )}
        </div>
      </div>
    </main>
  );
}
