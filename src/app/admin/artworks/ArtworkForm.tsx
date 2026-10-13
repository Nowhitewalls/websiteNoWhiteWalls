import { DOMINANT_COLORS } from "@/lib/constants";
import { deleteArtworkImage } from "./actions";

type Category = { id: number; name: string };
type ExistingImage = { id: number; url: string };
type ExistingArtwork = {
  id: number;
  title: string;
  description: string;
  provenance: string | null;
  dateEra: string | null;
  dimensions: string | null;
  condition: string | null;
  price: unknown;
  dominantColor: string | null;
  oversized: boolean;
  isFavorite: boolean;
  status: string;
  categoryId: number | null;
  images: ExistingImage[];
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#77716a",
  marginBottom: 6,
  marginTop: 18,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d9d3c9",
  background: "#fff",
  fontSize: 15,
  boxSizing: "border-box",
};

export default function ArtworkForm({
  action,
  categories,
  artwork,
  error,
}: {
  action: (formData: FormData) => void;
  categories: Category[];
  artwork?: ExistingArtwork;
  error?: string;
}) {
  return (
    <>
      {/* Rendered outside the main form below: a <form> can't contain
          another <form> (browsers silently drop the inner one, which
          made these Remove buttons submit the outer form instead). */}
      {artwork && artwork.images.length > 0 && (
        <>
          <label style={{ ...labelStyle, marginTop: 0 }}>Existing images</label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
            {artwork.images.map((img) => (
              <div key={img.id} style={{ textAlign: "center" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" style={{ width: 90, height: 90, objectFit: "cover", border: "1px solid #d9d3c9" }} />
                <form action={deleteArtworkImage}>
                  <input type="hidden" name="imageId" value={img.id} />
                  <input type="hidden" name="artworkId" value={artwork.id} />
                  <button type="submit" style={{ background: "none", border: "none", color: "#a33", fontSize: 12, cursor: "pointer" }}>
                    Remove
                  </button>
                </form>
              </div>
            ))}
          </div>
        </>
      )}

      <form action={action} encType="multipart/form-data">
        {artwork && <input type="hidden" name="id" value={artwork.id} />}

      {error === "missing-title" && (
        <p style={{ color: "#a33", fontSize: 14, marginBottom: 12 }}>Title is required.</p>
      )}
      {error && error !== "missing-title" && (
        <p style={{ color: "#a33", fontSize: 14, marginBottom: 12 }}>
          Saved, but one or more images failed: {error}
        </p>
      )}

      <label style={{ ...labelStyle, marginTop: 0 }}>Title</label>
      <input name="title" type="text" required defaultValue={artwork?.title} style={inputStyle} />

      <label style={labelStyle}>Description</label>
      <textarea name="description" rows={3} defaultValue={artwork?.description} style={{ ...inputStyle, resize: "vertical" }} />

      <label style={labelStyle}>Provenance</label>
      <input name="provenance" type="text" defaultValue={artwork?.provenance ?? ""} style={inputStyle} />

      <label style={labelStyle}>Date / era</label>
      <input name="dateEra" type="text" defaultValue={artwork?.dateEra ?? ""} style={inputStyle} />

      <label style={labelStyle}>Dimensions</label>
      <input name="dimensions" type="text" placeholder="e.g. 60 × 80 cm" defaultValue={artwork?.dimensions ?? ""} style={inputStyle} />

      <label style={labelStyle}>Condition</label>
      <input name="condition" type="text" defaultValue={artwork?.condition ?? ""} style={inputStyle} />

      <label style={labelStyle}>Price (€)</label>
      <input
        name="price"
        type="number"
        step="0.01"
        min="0"
        required
        defaultValue={artwork ? String(artwork.price) : ""}
        style={inputStyle}
      />

      <label style={labelStyle}>Category</label>
      <select name="categoryId" defaultValue={artwork?.categoryId ?? ""} style={inputStyle}>
        <option value="">— None —</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <label style={labelStyle}>Dominant colour</label>
      <select name="dominantColor" defaultValue={artwork?.dominantColor ?? ""} style={inputStyle}>
        <option value="">— None —</option>
        {DOMINANT_COLORS.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18, fontSize: 14 }}>
        <input type="checkbox" name="oversized" defaultChecked={artwork?.oversized} />
        Oversized / odd size — switches checkout to a purchase enquiry, shipping to &quot;quote on request&quot;
      </label>

      <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 14 }}>
        <input type="checkbox" name="isFavorite" defaultChecked={artwork?.isFavorite} />
        Tori&apos;s Favorites — featured in the homepage selection
      </label>

      {artwork && (
        <>
          <label style={labelStyle}>Status</label>
          <select name="status" defaultValue={artwork.status} style={inputStyle}>
            <option value="AVAILABLE">Available</option>
            <option value="SOLD">Sold</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </>
      )}

      <label style={labelStyle}>{artwork ? "Add more images" : "Images"}</label>
      <input name="images" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple style={inputStyle} />

      <button
        type="submit"
        style={{
          marginTop: 28,
          padding: "12px 24px",
          background: "#56534e",
          color: "#f4f1eb",
          border: "none",
          fontSize: 14,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        {artwork ? "Save changes" : "Create artwork"}
      </button>
      </form>
    </>
  );
}
