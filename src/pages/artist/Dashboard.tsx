import { useEffect, useState } from "react";
import { getCurrentProfile } from "../../lib/supabase/auth";
import {
  getMyArtworks,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  uploadArtworkImage,
} from "../../lib/supabase/artworks";
import ArtworkForm from "../../components/ArtworkForm";
import ConfirmModal from "../../components/ConfirmModal";
import type { ArtworkFormData } from "../../components/ArtworkForm";
import type { Artwork, Profile } from "../../lib/types";

type View = "list" | "create" | "edit";

export default function ArtistDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("list");
  const [editing, setEditing] = useState<Artwork | null>(null);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Artwork | null>(null);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    try {
      const p = await getCurrentProfile();
      if (!p) return;
      setProfile(p);
      const data = await getMyArtworks(p.id);
      setArtworks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(form: ArtworkFormData) {
    if (!profile) return;
    let image_url: string | null = null;
    if (form.file) {
      image_url = await uploadArtworkImage(form.file, profile.id);
    }
    const created = await createArtwork({
      artist_id: profile.id,
      title: form.title,
      description: form.description || null,
      technique: form.technique || null,
      year: form.year ? parseInt(form.year, 10) : null,
      image_url,
    });
    setArtworks((prev) => [created, ...prev]);
    setView("list");
  }

  async function handleUpdate(form: ArtworkFormData) {
    if (!profile || !editing) return;
    let image_url = editing.image_url;
    if (form.file) {
      image_url = await uploadArtworkImage(form.file, profile.id);
    }
    const updated = await updateArtwork(editing.id, {
      title: form.title,
      description: form.description || null,
      technique: form.technique || null,
      year: form.year ? parseInt(form.year, 10) : null,
      image_url,
    });
    setArtworks((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setView("list");
    setEditing(null);
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setDeletingId(confirmDelete.id);
    try {
      await deleteArtwork(confirmDelete.id);
      setArtworks((prev) => prev.filter((a) => a.id !== confirmDelete.id));
      setConfirmDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setDeletingId(null);
    }
  }

  function openEdit(artwork: Artwork) {
    setEditing(artwork);
    setView("edit");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black-deep">
        <p className="font-body text-white-off/50">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black-deep px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl text-white-off sm:text-4xl">
              Mis Obras
            </h1>
            <p className="mt-1 font-body text-sm text-white-off/50">
              {profile?.name} — {artworks.length}{" "}
              {artworks.length === 1 ? "obra" : "obras"}
            </p>
          </div>
          {view === "list" && (
            <button
              onClick={() => setView("create")}
              className="border border-gold-accent px-6 py-3 font-body text-sm font-semibold uppercase tracking-widest text-gold-accent transition-colors hover:bg-gold-accent hover:text-black-deep"
            >
              + Nueva Obra
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 border border-red-500/50 bg-red-500/10 p-3 text-center font-body text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Create / Edit form */}
        {(view === "create" || view === "edit") && (
          <div className="mb-12 border border-white-off/10 p-4 sm:p-6 md:p-8">
            <h2 className="mb-6 font-heading text-2xl text-white-off">
              {view === "create" ? "Nueva Obra" : `Editar: ${editing?.title}`}
            </h2>
            <ArtworkForm
              initial={view === "edit" ? (editing ?? undefined) : undefined}
              onSubmit={view === "create" ? handleCreate : handleUpdate}
              onCancel={() => {
                setView("list");
                setEditing(null);
              }}
            />
          </div>
        )}

        {/* Artwork list */}
        {view === "list" && artworks.length === 0 && (
          <div className="mt-20 text-center">
            <p className="font-heading text-2xl text-white-off/30">
              Aún no tienes obras
            </p>
            <p className="mt-2 font-body text-sm text-white-off/20">
              Haz clic en "+ Nueva Obra" para comenzar
            </p>
          </div>
        )}

        {view === "list" && artworks.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {artworks.map((artwork) => (
              <div
                key={artwork.id}
                className="group overflow-hidden border border-white-off/10 transition-colors hover:border-white-off/20"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-white-off/5">
                  {artwork.image_url ? (
                    <img
                      src={artwork.image_url}
                      alt={artwork.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="font-body text-xs text-white-off/20">
                        Sin imagen
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-heading text-lg text-white-off">
                    {artwork.title}
                  </h3>
                  {artwork.technique && (
                    <p className="mt-1 font-body text-xs text-gold-accent">
                      {artwork.technique}
                      {artwork.year ? ` · ${artwork.year}` : ""}
                    </p>
                  )}
                  {artwork.description && (
                    <p className="mt-2 line-clamp-2 font-body text-xs text-white-off/50">
                      {artwork.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex gap-3 border-t border-white-off/5 pt-4">
                    <button
                      onClick={() => openEdit(artwork)}
                      className="font-body text-xs uppercase tracking-widest text-white-off/40 transition-colors hover:text-gold-accent"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setConfirmDelete(artwork)}
                      disabled={deletingId === artwork.id}
                      className="font-body text-xs uppercase tracking-widest text-white-off/40 transition-colors hover:text-red-400 disabled:opacity-50"
                    >
                      {deletingId === artwork.id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <ConfirmModal
          title="Eliminar obra"
          message={`¿Estás seguro de eliminar "${confirmDelete.title}"? Esta acción no se puede deshacer.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          loading={deletingId === confirmDelete.id}
        />
      )}
    </div>
  );
}
