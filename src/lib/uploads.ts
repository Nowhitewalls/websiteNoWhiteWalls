import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import sharp from "sharp";

// Deliberately NOT inside public/ — Next.js scans the public folder once
// at server startup for its static-file routing table, so files written
// there mid-process (i.e. every real upload, since the server is already
// running) 404 until the next restart. Storing outside public/ and
// serving through the /media/[filename] route handler means every
// request reads the file fresh from disk, no restart ever required.
const UPLOAD_DIR = path.join(process.cwd(), "uploads");

// Every uploaded image is converted to JPEG on the server, regardless of
// the source format. This matters because photos taken on an iPhone/iPad
// are HEIC by default, which most browsers can't display in an <img> tag
// even if we stored it as-is. Sharp/libvips decodes HEIC, PNG, WebP, GIF
// and more, so we don't need to validate the incoming MIME type at all —
// if sharp can't read it, we surface that as a clear per-file error
// instead of crashing the whole artwork submission.
export async function saveUploadedImage(file: File): Promise<string> {
  await mkdir(UPLOAD_DIR, { recursive: true });

  const inputBuffer = Buffer.from(await file.arrayBuffer());

  let outputBuffer: Buffer;
  try {
    outputBuffer = await sharp(inputBuffer)
      .rotate() // apply EXIF orientation (important for phone/tablet photos)
      .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();
  } catch (err) {
    throw new Error(
      `Could not process image "${file.name}": ${err instanceof Error ? err.message : String(err)}`
    );
  }

  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.jpg`;
  await writeFile(path.join(UPLOAD_DIR, filename), outputBuffer);

  return `/media/${filename}`;
}

export { UPLOAD_DIR };
