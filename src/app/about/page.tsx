import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { theme } from "@/lib/theme";
import Placeholder from "@/components/Placeholder";
import SiteHeader from "@/components/SiteHeader";
import { InlineEditableTitle, InlineEditableBody } from "@/components/admin/InlineEditableText";
import InlineEditableImage from "@/components/admin/InlineEditableImage";
import { updateContent } from "@/app/admin/content/actions";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const session = await getSession();
  if (!session) return <Placeholder />;

  const content = await prisma.siteContent.findUnique({ where: { key: "about" } });
  const hidden = { key: "about", redirectTo: "/about" };

  return (
    <main style={{ minHeight: "100vh", background: theme.paper }}>
      <SiteHeader isAdmin adminUsername={session.u} />
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "100px 24px 60px",
        }}
      >
        <h1 style={{ fontWeight: "normal", fontSize: 32, color: theme.ink, marginBottom: 24 }}>
          <InlineEditableTitle
            value={content?.title || "About"}
            action={updateContent}
            fieldName="title"
            hiddenFields={hidden}
            style={{ fontFamily: theme.fontSerif, fontWeight: "normal", fontSize: 32, color: theme.ink }}
          />
        </h1>

        <InlineEditableImage imageUrl={content?.imageUrl ?? null} action={updateContent} hiddenFields={hidden} />

        <InlineEditableBody
          valueHtml={content?.body ?? ""}
          action={updateContent}
          fieldName="body"
          hiddenFields={hidden}
          placeholder="No About text set yet — click the pencil to add it."
        />
      </div>
    </main>
  );
}
