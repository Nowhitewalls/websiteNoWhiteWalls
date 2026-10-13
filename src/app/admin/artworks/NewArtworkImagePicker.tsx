"use client";

import { useState } from "react";

const muted = "#77716a";

// No artwork exists yet on the create form, so there's nothing to persist
// images against — this just shows a live local preview of what's been
// picked (big first photo + thumbnail strip) so it's easier to look at
// the work while writing the title/description. Full reordering becomes
// available on the edit page once the artwork is actually saved.
export default function NewArtworkImagePicker() {
  const [previews, setPreviews] = useState<string[]>([]);

  return (
    <div style={{ marginBottom: 28 }}>
      {previews[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previews[0]}
          alt=""
          style={{ width: "100%", maxHeight: 480, objectFit: "contain", background: "#eee", display: "block", marginBottom: 12 }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            aspectRatio: "4 / 3",
            background: "#eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: muted,
            fontSize: 14,
            marginBottom: 12,
          }}
        >
          Choose a photo to get started
        </div>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {previews.slice(1).map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={src} alt="" style={{ width: 70, height: 70, objectFit: "cover", border: "1px solid #d9d3c9" }} />
        ))}

        <label
          title="Choose photos"
          style={{
            width: 70,
            height: 70,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `1px dashed ${muted}`,
            color: muted,
            fontSize: 28,
            cursor: "pointer",
          }}
        >
          +
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              setPreviews(files.map((f) => URL.createObjectURL(f)));
            }}
          />
        </label>
      </div>
    </div>
  );
}
