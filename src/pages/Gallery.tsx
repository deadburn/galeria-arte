import { useEffect, useState } from "react";
import { getApprovedArtworks } from "../lib/supabase/artworks";
import ArtworkCard from "../components/ArtworkCard";
import type { Artwork } from "../lib/types";

export default function Gallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApprovedArtworks()
      .then(setArtworks)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-black-deep px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-center font-heading text-3xl text-white-off sm:mb-12 sm:text-5xl">
          Lo último en nuestra galería
        </h1>

        {loading ? (
          <p className="text-center font-body text-white-off/50">
            Cargando obras...
          </p>
        ) : artworks.length === 0 ? (
          <p className="text-center font-body text-white-off/50">
            Aún no hay obras publicadas.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
