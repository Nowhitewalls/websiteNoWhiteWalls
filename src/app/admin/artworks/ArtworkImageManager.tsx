"use client";

import { useRef } from "react";
import { deleteArtworkImage, addArtworkImages, moveArtworkImage } from "./actions";

type Image = { id: number; url: string };

const ink = "#56534e";
const muted = "#77716a";
const line = "#d9d3c9";

export default function ArtworkImageManager({ artworkId, images }: { artworkId: number; images: Image[] }) {
  const addFormRef = useRef<HTMLFormElement>(null);

  return (
    <div style={{ marginBottom: 28 }}>
      {/* Big preview of the main (first) photo — easier to actually look
          at the work while writing the title/description below. */}
      {images[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={images[0].url}
          alt=""
          style={{ width: "100%", maxHeight: 480, objectFit: "contain", background: "#eee", display: "block", marginBottom: 12 }}
        />
      ) : (
        <div style={{ width: "100%", aspectRatio: "4 / 3", background: "#eee", marginBottom: 12 }} />
      )}

      {/* Thumbnail strip: reorder, remove, and add more — admin only. */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {images.map((img, i) => (
          <div key={img.id} style={{ position: "relative", width: 70 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="" style={{ width: 70, height: 70, objectFit: "cover", border: `1px solid ${line}` }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginTop: 2 }}>
              <form action={moveArtworkImage}>
                <input type="hidden" name="imageId" value={img.id} />
                <input type="hidden" name="artworkId" value={artworkId} />
                <input type="hidden" name="direction" value="left" />
                <button type="submit" disabled={i === 0} style={{ background: "none", border: "none", color: i === 0 ? "#ccc" : ink, cursor: i === 0 ? "default" : "pointer" }}>
                  ‹
                </button>
              </form>
              <form action={deleteArtworkImage}>
                <input type="hidden" name="imageId" value={img.id} />
                <input type="hidden" name="artworkId" value={artworkId} />
                <button type="submit" style={{ background: "none", border: "none", color: "#a33", cursor: "pointer" }}>
                  ✕
                </button>
              </form>
              <form action={moveArtworkImage}>
                <input type="hidden" name="imageId" value={img.id} />
                <input type="hidden" name="artworkId" value={artworkId} />
                <input type="hidden" name="direction" value="right" />
                <button type="submit" disabled={i === images.length - 1} style={{ background: "none", border: "none", color: i === images.length - 1 ? "#ccc" : ink, cursor: i === images.length - 1 ? "default" : "pointer" }}>
                  ›
                </button>
              </form>
            </div>
          </div>
        ))}

        <form ref={addFormRef} action={addArtworkImages} encType="multipart/form-data">
          <input type="hidden" name="artworkId" value={artworkId} />
          <label
            title="Add photos"
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
              onChange={() => addFormRef.current?.requestSubmit()}
            />
          </label>
        </form>
      </div>
    </div>
  );
}
