import type { Artwork } from "../lib/types";

interface ArtworkCardProps {
  artwork: Artwork;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  const artistName = artwork.profiles?.name ?? "Artista";

  return (
    <div className="group">
      <div className="aspect-square overflow-hidden">
        {artwork.image_url ? (
          <img
            src={artwork.image_url}
            alt={artwork.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white-off/5">
            <span className="font-body text-sm text-white-off/20">
              Sin imagen
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="font-heading text-xl text-white-off">{artwork.title}</h3>
        <p className="font-body text-sm text-white-off/50">{artistName}</p>
        {artwork.technique && (
          <p className="font-body text-xs text-white-off/30">
            {artwork.technique}
            {artwork.year ? ` · ${artwork.year}` : ""}
          </p>
        )}
      </div>
    </div>
  );
}
