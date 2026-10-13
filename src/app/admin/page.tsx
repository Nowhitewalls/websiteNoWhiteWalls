import Link from "next/link";
import { getSession } from "@/lib/auth";
import LoginForm from "./LoginForm";
import SiteHeader from "@/components/SiteHeader";

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f1eb",
          color: "#56534e",
          padding: 24,
        }}
      >
        <div style={{ width: "100%", maxWidth: 360 }}>
          <h1 style={{ textAlign: "center", fontWeight: "normal", fontSize: 26, marginBottom: 4 }}>
            No White Walls
          </h1>
          <p style={{ textAlign: "center", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#77716a", marginBottom: 32 }}>
            Admin sign in
          </p>
          <LoginForm />
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#f4f1eb",
        color: "#56534e",
      }}
    >
      <SiteHeader isAdmin adminUsername={session.u} />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "100px 24px 60px" }}>
        <h1 style={{ fontWeight: "normal", fontSize: 28, marginBottom: 4 }}>Welcome, {session.u}.</h1>
        <p style={{ color: "#77716a", marginBottom: 24 }}>Checkout, shipping and translations come next.</p>

        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <Link
            href="/admin/artworks"
            style={{ padding: "16px 20px", background: "#fff", border: "1px solid #d9d3c9", color: "#56534e", textDecoration: "none", flex: 1 }}
          >
            Artworks
          </Link>
          <Link
            href="/admin/categories"
            style={{ padding: "16px 20px", background: "#fff", border: "1px solid #d9d3c9", color: "#56534e", textDecoration: "none", flex: 1 }}
          >
            Categories
          </Link>
        </div>
        <p style={{ color: "#77716a", fontSize: 13 }}>
          Homepage photo and About text/image are now edited directly on those live pages — look for the pencil icons while signed in.
          Use the menu (top left) to view the live site or sign out.
        </p>
      </div>
    </main>
  );
}
