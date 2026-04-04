import { useEffect, useState } from "react";
import { getApprovedArtworks, groupByArtist } from "../lib/supabase/artworks";
import ArtworkCard from "../components/ArtworkCard";
import ArtistModal from "../components/ArtistModal";
import type { ArtistGroup } from "../lib/types";

export default function Gallery() {
  const [groups, setGroups] = useState<ArtistGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ArtistGroup | null>(null);

  useEffect(() => {
    getApprovedArtworks()
      .then((artworks) => setGroups(groupByArtist(artworks)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in-up min-h-screen bg-black-deep px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-center font-heading text-3xl text-white-off sm:mb-12 sm:text-5xl">
          Lo último en nuestra galería
        </h1>

        {loading ? (
          <p className="text-center font-body text-white-off/50">
            Cargando obras...
          </p>
        ) : groups.length === 0 ? (
          <p className="text-center font-body text-white-off/50">
            Aún no hay obras publicadas.
          </p>
        ) : (
          <div className="stagger-children grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
            {groups.map((group) => (
              <ArtworkCard
                key={group.artist_id}
                group={group}
                onClick={() => setSelected(group)}
              />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <ArtistModal group={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
