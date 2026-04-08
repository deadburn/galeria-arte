import { useEffect, useState } from "react";
import { getCurrentProfile, updateProfile } from "../../lib/supabase/auth";
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
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    bio: "",
    technique: "",
    portfolio_url: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

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

  function openProfileEdit() {
    if (!profile) return;
    setProfileForm({
      name: profile.name,
      bio: profile.bio ?? "",
      technique: profile.technique ?? "",
      portfolio_url: profile.portfolio_url ?? "",
    });
    setEditingProfile(true);
  }

  async function handleProfileSave() {
    if (!profile) return;
    setSavingProfile(true);
    setError("");
    try {
      const updated = await updateProfile(profile.id, {
        name: profileForm.name,
        bio: profileForm.bio || null,
        technique: profileForm.technique || null,
        portfolio_url: profileForm.portfolio_url || null,
      });
      setProfile(updated);
      setEditingProfile(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar perfil");
    } finally {
      setSavingProfile(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white-off">
        <p className="font-body text-black-deep/50">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up min-h-screen bg-white-off px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl text-black-deep sm:text-4xl">
              Mis Obras
            </h1>
            <p className="mt-1 font-body text-sm text-black-deep/50">
              {profile?.name} — {artworks.length}{" "}
              {artworks.length === 1 ? "obra" : "obras"}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={openProfileEdit}
              className="rounded-lg border border-black-deep/20 px-4 py-2 font-body text-xs uppercase tracking-widest text-black-deep/50 transition-colors hover:border-black-deep/40 hover:text-black-deep sm:px-5 sm:py-3 sm:text-sm"
            >
              Mi Perfil
            </button>
            {view === "list" && (
              <button
                onClick={() => setView("create")}
                className="rounded-lg border border-gold-accent px-4 py-2 font-body text-xs font-semibold uppercase tracking-widest text-gold-accent transition-colors hover:bg-gold-accent hover:text-black-deep sm:px-6 sm:py-3 sm:text-sm"
              >
                + Nueva Obra
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-center font-body text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Create / Edit form */}
        {(view === "create" || view === "edit") && (
          <div className="mb-12 rounded-xl border border-black-deep/10 p-4 sm:p-6 md:p-8">
            <h2 className="mb-6 font-heading text-2xl text-black-deep">
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
            <p className="font-heading text-2xl text-black-deep/30">
              Aún no tienes obras
            </p>
            <p className="mt-2 font-body text-sm text-black-deep/20">
              Haz clic en "+ Nueva Obra" para comenzar
            </p>
          </div>
        )}

        {view === "list" && artworks.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {artworks.map((artwork) => (
              <div
                key={artwork.id}
                className="group overflow-hidden rounded-xl border border-black-deep/10 transition-colors hover:border-black-deep/20"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-black-deep/5">
                  {artwork.image_url ? (
                    <img
                      src={artwork.image_url}
                      alt={artwork.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="font-body text-xs text-black-deep/20">
                        Sin imagen
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-heading text-lg text-black-deep">
                    {artwork.title}
                  </h3>
                  {artwork.technique && (
                    <p className="mt-1 font-body text-xs text-gold-accent">
                      {artwork.technique}
                      {artwork.year ? ` · ${artwork.year}` : ""}
                    </p>
                  )}
                  {artwork.description && (
                    <p className="mt-2 line-clamp-2 font-body text-xs text-black-deep/50">
                      {artwork.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex gap-3 border-t border-black-deep/5 pt-4">
                    <button
                      onClick={() => openEdit(artwork)}
                      className="font-body text-xs uppercase tracking-widest text-black-deep/40 transition-colors hover:text-gold-accent"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setConfirmDelete(artwork)}
                      disabled={deletingId === artwork.id}
                      className="font-body text-xs uppercase tracking-widest text-black-deep/40 transition-colors hover:text-red-400 disabled:opacity-50"
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

      {/* Profile edit modal */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setEditingProfile(false)}
          />
          <div className="relative mx-4 w-full max-w-lg rounded-2xl border border-black-deep/8 bg-white p-6 shadow-2xl shadow-black/15 sm:p-8">
            <h2 className="mb-6 font-heading text-2xl text-black-deep">
              Editar Perfil
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block font-body text-xs uppercase tracking-widest text-black-deep/50">
                  Nombre
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-black-deep/10 bg-transparent px-4 py-3 font-body text-sm text-black-deep outline-none focus:border-gold-accent"
                />
              </div>
              <div>
                <label className="mb-1 block font-body text-xs uppercase tracking-widest text-black-deep/50">
                  Bio
                </label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, bio: e.target.value })
                  }
                  rows={3}
                  placeholder="Cuéntanos sobre ti..."
                  className="w-full resize-none rounded-lg border border-black-deep/10 bg-transparent px-4 py-3 font-body text-sm text-black-deep placeholder-black-deep/30 outline-none focus:border-gold-accent"
                />
              </div>
              <div>
                <label className="mb-1 block font-body text-xs uppercase tracking-widest text-black-deep/50">
                  Técnica
                </label>
                <input
                  type="text"
                  value={profileForm.technique}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      technique: e.target.value,
                    })
                  }
                  placeholder="Óleo, acuarela..."
                  className="w-full rounded-lg border border-black-deep/10 bg-transparent px-4 py-3 font-body text-sm text-black-deep placeholder-black-deep/30 outline-none focus:border-gold-accent"
                />
              </div>
              <div>
                <label className="mb-1 block font-body text-xs uppercase tracking-widest text-black-deep/50">
                  Instagram
                </label>
                <input
                  type="url"
                  value={profileForm.portfolio_url}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      portfolio_url: e.target.value,
                    })
                  }
                  placeholder="https://instagram.com/tu_usuario"
                  className="w-full rounded-lg border border-black-deep/10 bg-transparent px-4 py-3 font-body text-sm text-black-deep placeholder-black-deep/30 outline-none focus:border-gold-accent"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setEditingProfile(false)}
                className="px-5 py-2.5 font-body text-sm uppercase tracking-widest text-black-deep/50 transition-colors hover:text-black-deep"
              >
                Cancelar
              </button>
              <button
                onClick={handleProfileSave}
                disabled={savingProfile || !profileForm.name.trim()}
                className="rounded-lg border border-gold-accent px-6 py-2.5 font-body text-sm font-semibold uppercase tracking-widest text-gold-accent transition-colors hover:bg-gold-accent hover:text-black-deep disabled:opacity-50"
              >
                {savingProfile ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
