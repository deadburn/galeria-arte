import { useEffect, useState } from "react";
import {
  getPendingArtists,
  updateArtistStatus,
} from "../../lib/supabase/admin";
import type { Profile } from "../../lib/types";

export default function AdminDashboard() {
  const [artists, setArtists] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadArtists();
  }, []);

  async function loadArtists() {
    try {
      const data = await getPendingArtists();
      setArtists(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar artistas");
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(
    artist: Profile,
    status: "APPROVED" | "REJECTED",
  ) {
    setActionId(artist.id);
    setError("");
    try {
      await updateArtistStatus(artist.id, status, artist.email, artist.name);
      setArtists((prev) => prev.filter((a) => a.id !== artist.id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar estado",
      );
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="min-h-screen bg-black-deep px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 font-heading text-3xl text-white-off sm:text-4xl">
          Panel de Administración
        </h1>
        <p className="mb-10 font-body text-sm text-white-off/50">
          Artistas pendientes de aprobación
        </p>

        {error && (
          <div className="mb-6 border border-red-500/50 bg-red-500/10 p-3 text-center font-body text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <p className="font-body text-white-off/50">Cargando...</p>
        ) : artists.length === 0 ? (
          <p className="font-body text-white-off/50">
            No hay artistas pendientes de aprobación.
          </p>
        ) : (
          <div className="space-y-4">
            {artists.map((artist) => (
              <div
                key={artist.id}
                className="border border-white-off/10 p-6 transition-colors hover:border-white-off/20"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-heading text-2xl text-white-off">
                      {artist.name}
                    </h2>
                    <p className="mt-1 font-body text-sm text-white-off/50">
                      {artist.email}
                    </p>

                    {artist.bio && (
                      <p className="mt-3 font-body text-sm text-white-off/70">
                        {artist.bio}
                      </p>
                    )}

                    {artist.technique && (
                      <p className="mt-2 font-body text-xs text-gold-accent">
                        Técnica: {artist.technique}
                      </p>
                    )}

                    {artist.portfolio_url && (
                      <a
                        href={artist.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block font-body text-xs text-gold-accent underline hover:text-gold-accent/80"
                      >
                        Ver portafolio →
                      </a>
                    )}

                    <p className="mt-2 font-body text-xs text-white-off/30">
                      Registrado:{" "}
                      {new Date(artist.created_at).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex w-full shrink-0 gap-3 sm:w-auto">
                    <button
                      onClick={() => handleAction(artist, "APPROVED")}
                      disabled={actionId === artist.id}
                      className="flex-1 border border-emerald-500 px-5 py-2 font-body text-sm text-emerald-400 transition-colors hover:bg-emerald-500 hover:text-black-deep disabled:opacity-50 sm:flex-none"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleAction(artist, "REJECTED")}
                      disabled={actionId === artist.id}
                      className="flex-1 border border-red-500 px-5 py-2 font-body text-sm text-red-400 transition-colors hover:bg-red-500 hover:text-black-deep disabled:opacity-50 sm:flex-none"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
