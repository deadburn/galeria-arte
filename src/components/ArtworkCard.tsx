import type { ArtistGroup } from "../lib/types";

interface Props {
  group: ArtistGroup;
  onClick: () => void;
}

export default function ArtworkCard({ group, onClick }: Props) {
  const artwork = group.latestArtwork;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-xl border border-black-deep/10 transition-all duration-300 hover:border-black-deep/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30"
    >
      <div className="aspect-square overflow-hidden">
        {artwork.image_url ? (
          <img
            src={artwork.image_url}
            alt={artwork.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
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
