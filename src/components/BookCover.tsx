import Image from "next/image";
import type { Book } from "@/lib/types";

// A course material rendered as a branded book. When a cover photo is uploaded
// it fills the face; otherwise a clean paper cover with the Epsos mark, the
// title, a coloured disc and a page-edge — echoing the real course books.
export default function BookCover({ book, brandName = "EPSOS" }: { book: Book; brandName?: string }) {
  const color = book.color || "var(--red-600)";
  const hasCover = Boolean(book.cover?.url);

  return (
    <div className="book group">
      <div className="book-inner">
        {/* page edge (binding side) */}
        <span className="book-pages" aria-hidden="true" />
        <div className="book-face">
          {hasCover ? (
            <Image
              src={book.cover.url}
              alt={book.cover.alt || book.title}
              fill
              sizes="200px"
              className="object-cover"
            />
          ) : (
            <div className="book-placeholder">
              <span className="book-brand num">
                {brandName}
                <b>800</b>
              </span>
              {book.tag ? (
                <span className="book-tag" style={{ background: color }}>
                  {book.tag}
                </span>
              ) : null}
              <span className="book-title">{book.title}</span>
              <span className="book-disc" style={{ background: color }} aria-hidden="true" />
            </div>
          )}
        </div>
      </div>
      <span className="book-label">{book.title}</span>
    </div>
  );
}
