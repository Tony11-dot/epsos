import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

// ─────────────────────────────────────────────────────────────────────────
// Swappable image storage.
//   local → writes to /public/uploads (dev, when no Blob store is connected)
//   blob  → Vercel Blob (production)
// Blob mode turns on automatically whenever a Vercel Blob store is connected
// (BLOB_READ_WRITE_TOKEN present) or BLOB_DRIVER=blob is set explicitly. This
// matters because Vercel's runtime filesystem is read-only — writing to
// /public would throw "ENOENT … mkdir /var/task/public".
// Returns a public URL for the stored file.
// ─────────────────────────────────────────────────────────────────────────

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function safeExt(name: string, type: string): string {
  const fromName = path.extname(name).toLowerCase().replace(/[^.a-z0-9]/g, "");
  if (fromName && fromName.length <= 5) return fromName;
  const map: Record<string, string> = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "image/avif": ".avif",
  };
  return map[type] || ".bin";
}

function makeName(original: string, type: string): string {
  const ext = safeExt(original, type);
  const rand = Array.from({ length: 8 }, () =>
    "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]
  ).join("");
  return `epsos-${rand}${ext}`;
}

export async function storeImage(file: File): Promise<{ url: string }> {
  const buf = Buffer.from(await file.arrayBuffer());
  const filename = makeName(file.name || "upload", file.type);

  const useBlob = process.env.BLOB_DRIVER === "blob" || Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  if (useBlob) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`epsos/${filename}`, buf, {
      access: "public",
      contentType: file.type || "application/octet-stream",
      addRandomSuffix: false,
    });
    return { url: blob.url };
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buf);
  return { url: `/uploads/${filename}` };
}
