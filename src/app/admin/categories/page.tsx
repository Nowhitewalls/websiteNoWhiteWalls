import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCategory, deleteCategory } from "./actions";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

const ERROR_MESSAGES: Record<string, string> = {
  "empty-name": "Category name can't be empty.",
  "in-use": "Can't delete a category that still has artworks in it. Move or delete those artworks first.",
};

export default async function CategoriesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await requireAdmin();
  const { error } = await searchParams;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { artworks: true } } },
  });

  return (
    <main style={{ position: "relative", minHeight: "100vh", background: "#f4f1eb", color: "#56534e" }}>
      <SiteHeader isAdmin adminUsername={session.u} />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "100px 24px 60px" }}>
        <h1 style={{ fontWeight: "normal", fontSize: 28, marginBottom: 24 }}>Categories</h1>

        {error && (
          <p style={{ color: "#a33", marginBottom: 16, fontSize: 14 }}>{ERROR_MESSAGES[error] ?? error}</p>
        )}

        <ul style={{ listStyle: "none", padding: 0, marginBottom: 32 }}>
          {categories.length === 0 && <li style={{ color: "#77716a" }}>No categories yet.</li>}
          {categories.map((c) => (
            <li
              key={c.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid #d9d3c9",
              }}
            >
              <span>
                {c.name}{" "}
                <span style={{ color: "#77716a", fontSize: 13 }}>
                  ({c._count.artworks} artwork{c._count.artworks === 1 ? "" : "s"})
                </span>
              </span>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={c.id} />
                <button
                  type="submit"
                  style={{ background: "none", border: "none", color: "#a33", cursor: "pointer", fontSize: 13 }}
                >
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>

        <h2 style={{ fontWeight: "normal", fontSize: 18, marginBottom: 12 }}>Add a category</h2>
        <form action={createCategory} style={{ display: "flex", gap: 8 }}>
          {/* key forces a fresh input after each add — otherwise the redirect
              back to this same URL reuses the DOM node and the typed text
              from before the successful submit sticks around. */}
          <input
            key={categories.length}
            name="name"
            type="text"
            placeholder="e.g. Vintage painting"
            required
            style={{ flex: 1, padding: "8px 12px", border: "1px solid #d9d3c9", fontSize: 15 }}
          />
          <button
            type="submit"
            style={{ padding: "8px 16px", background: "#56534e", color: "#f4f1eb", border: "none", cursor: "pointer" }}
          >
            Add
          </button>
        </form>
      </div>
    </main>
  );
}
