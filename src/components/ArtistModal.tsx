import { useState } from "react";
import type { ArtistGroup, Artwork } from "../lib/types";

interface Props {
  group: ArtistGroup;
  onClose: () => void;
}

export default function ArtistModal({ group, onClose }: Props) {
  const [selected, setSelected] = useState<Artwork | null>(null);
  const heroImage = group.latestArtwork.image_url;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto">
      {/* Backdrop */}
      <div
        className="animate-fade-in fixed inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="animate-fade-in-scale relative z-10 mx-3 my-6 w-full max-w-4xl overflow-hidden rounded-2xl border border-black-deep/8 bg-white shadow-2xl shadow-black/15 sm:mx-4 sm:my-12">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-lg text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Hero header with blurred background */}
        <div className="relative overflow-hidden">
          {/* Blurred artwork background */}
          {heroImage && (
            <div className="absolute inset-0">
              <img
                src={heroImage}
                alt=""
                className="h-full w-full object-cover blur-2xl brightness-[0.25] saturate-150"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
            </div>
          )}

          {/* Artist info */}
          <div className="relative px-6 pb-8 pt-12 text-center sm:px-10 sm:pb-10 sm:pt-14">
            {/* Initials avatar */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-gold-accent/30 bg-gold-accent/10 sm:h-20 sm:w-20">
              <span className="font-heading text-2xl text-gold-accent sm:text-3xl">
                {group.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            </div>

            <h2 className="font-heading text-3xl tracking-wide text-white sm:text-4xl">
              {group.name}
            </h2>

            {group.technique && (
              <p className="mt-2 inline-block rounded-full border border-gold-accent/20 bg-gold-accent/5 px-4 py-1 font-body text-xs tracking-widest text-gold-accent uppercase">
                {group.technique}
              </p>
            )}

            {group.bio && (
              <p className="mx-auto mt-4 max-w-lg font-body text-sm leading-relaxed text-white/65 italic">
                "{group.bio}"
              </p>
            )}

            <div className="mt-5 flex items-center justify-center gap-4">
              {group.portfolio_url && (
                <a
                  href={group.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-body text-xs text-white/80 transition-colors hover:border-gold-accent/30 hover:text-gold-accent"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  Instagram
                </a>
              )}
              <span className="font-body text-xs text-white/40">
                {group.count} {group.count === 1 ? "obra" : "obras"}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-gradient-to-r from-transparent via-black-deep/10 to-transparent sm:mx-10" />

        {/* Artworks grid */}
        <div className="stagger-children grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-6 lg:grid-cols-3">
          {group.artworks.map((artwork) => (
            <div
              key={artwork.id}
              onClick={() => setSelected(artwork)}
              className="group cursor-pointer overflow-hidden rounded-xl border border-black-deep/5 bg-black-deep/[0.02] transition-all duration-300 hover:-translate-y-0.5 hover:border-black-deep/10 hover:bg-black-deep/[0.03]"
            >
              <div className="aspect-[4/5] overflow-hidden bg-black-deep/5">
                {artwork.image_url ? (
                  <img
                    src={artwork.image_url}
                    alt={artwork.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="font-body text-xs text-black-deep/25">
                      Sin imagen
                    </span>
                  </div>
                )}
              </div>
              <div className="px-4 py-3">
                <h3 className="font-heading text-base text-black-deep">
                  {artwork.title}
                </h3>
                <p className="mt-0.5 font-body text-[11px] text-black-deep/40">
                  {artwork.technique && artwork.technique}
                  {artwork.technique && artwork.year && " · "}
                  {artwork.year && artwork.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox for selected artwork */}
      {selected && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="animate-fade-in absolute inset-0 bg-black/90 backdrop-blur-md" />
          <div
            className="animate-fade-in-scale relative max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {selected.image_url && (
              <img
                src={selected.image_url}
                alt={selected.title}
                className="max-h-[80vh] w-auto rounded-2xl object-contain"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 rounded-b-2xl bg-gradient-to-t from-black/80 to-transparent px-6 pb-5 pt-12">
              <h3 className="font-heading text-xl text-white-off">
                {selected.title}
              </h3>
              {selected.description && (
                <p className="mt-1 font-body text-xs text-white-off/60">
                  {selected.description}
                </p>
              )}
            </div>
            <button
              onClick={() => setSelected(null)}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-lg text-white-off/70 backdrop-blur-sm transition-colors hover:bg-black/70 hover:text-white-off"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
