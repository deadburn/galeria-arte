import { useState } from "react";
import type { ArtistGroup } from "../lib/types";

interface Props {
  group: ArtistGroup;
  onClick: () => void;
}

export default function ArtworkCard({ group, onClick }: Props) {
  const artwork = group.latestArtwork;
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-xl border border-black-deep/10 transition-all duration-300 hover:border-black-deep/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30"
    >
      <div className="aspect-square overflow-hidden bg-black-deep/5">
        {artwork.image_url ? (
          <>
            {!loaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-black-deep/5 via-black-deep/10 to-black-deep/5" />
            )}
            <img
              src={artwork.image_url}
              alt={artwork.title}
              loading="lazy"
              decoding="async"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onLoad={() => setLoaded(true)}
              className={`h-full w-full select-none object-cover transition-all duration-500 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-black-deep/5">
            <span className="font-body text-sm text-black-deep/20">
              Sin imagen
            </span>
          </div>
        )}
      </div>

      <div className="px-5 py-4 text-center">
        <h3 className="font-heading text-xl text-gold-accent">{group.name}</h3>
        {group.technique && (
          <p className="mt-1 font-body text-xs tracking-wide text-black-deep/40">
            {group.technique}
          </p>
        )}
        <p className="mt-2 font-body text-xs text-black-deep/30">
          {group.count} {group.count === 1 ? "obra" : "obras"}
        </p>
      </div>
    </div>
  );
}
