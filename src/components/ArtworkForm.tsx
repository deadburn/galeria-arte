import { useRef, useState } from "react";
import type { Artwork } from "../lib/types";

interface Props {
  initial?: Artwork;
  onSubmit: (data: ArtworkFormData) => Promise<void>;
  onCancel: () => void;
}

export interface ArtworkFormData {
  title: string;
  description: string;
  technique: string;
  year: string;
  file: File | null;
}

const ACCEPTED = ".jpg,.jpeg,.png,.webp";

export default function ArtworkForm({ initial, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [technique, setTechnique] = useState(initial?.technique ?? "");
  const [year, setYear] = useState(initial?.year?.toString() ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    initial?.image_url ?? null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setError("El título es obligatorio.");
    if (!initial && !file) return setError("Debes subir una imagen.");

    setSubmitting(true);
    setError("");
    try {
      await onSubmit({ title, description, technique, year, file });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-white-off/10 bg-transparent px-4 py-3 font-body text-sm text-white-off placeholder-white-off/30 outline-none focus:border-gold-accent";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-center font-body text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Image upload */}
      <div>
        <label className="mb-2 block font-body text-xs uppercase tracking-widest text-white-off/50">
          Imagen (JPEG, PNG, WebP — max 5 MB)
        </label>
        <div
          onClick={() => fileRef.current?.click()}
          className="relative flex min-h-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-white-off/20 transition-colors hover:border-gold-accent/50"
        >
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="h-full max-h-[300px] w-full object-contain"
            />
          ) : (
            <span className="font-body text-sm text-white-off/30">
              Haz clic para seleccionar una imagen
            </span>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPTED}
          onChange={handleFile}
          className="hidden"
        />
      </div>

      {/* Title */}
      <div>
        <label className="mb-2 block font-body text-xs uppercase tracking-widest text-white-off/50">
          Título *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nombre de la obra"
          className={inputClass}
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block font-body text-xs uppercase tracking-widest text-white-off/50">
          Descripción
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe tu obra"
          rows={3}
          className={inputClass + " resize-none"}
        />
      </div>

      {/* Technique + Year */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block font-body text-xs uppercase tracking-widest text-white-off/50">
            Técnica
          </label>
          <input
            type="text"
            value={technique}
            onChange={(e) => setTechnique(e.target.value)}
            placeholder="Óleo, acuarela..."
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-2 block font-body text-xs uppercase tracking-widest text-white-off/50">
            Año
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2026"
            className={inputClass}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg border border-gold-accent px-8 py-3 font-body text-sm font-semibold uppercase tracking-widest text-gold-accent transition-colors hover:bg-gold-accent hover:text-black-deep disabled:opacity-50"
        >
          {submitting ? "Guardando..." : initial ? "Actualizar" : "Publicar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 font-body text-sm uppercase tracking-widest text-white-off/50 transition-colors hover:text-white-off"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
