import { supabase } from "./client";
import type { Artwork, ArtistGroup } from "../types";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function getApprovedArtworks(): Promise<Artwork[]> {
  const { data, error } = await supabase
    .from("artworks")
    .select(
      "id, artist_id, title, description, technique, year, image_url, created_at, updated_at, profiles(name, bio, technique, portfolio_url)",
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as Artwork[];
}

export function groupByArtist(artworks: Artwork[]): ArtistGroup[] {
  const map = new Map<string, ArtistGroup>();

  for (const art of artworks) {
    const existing = map.get(art.artist_id);
    if (existing) {
      existing.artworks.push(art);
      existing.count++;
    } else {
      map.set(art.artist_id, {
        artist_id: art.artist_id,
        name: art.profiles?.name ?? "Artista",
        bio: art.profiles?.bio ?? null,
        technique: art.profiles?.technique ?? null,
        portfolio_url: art.profiles?.portfolio_url ?? null,
        latestArtwork: art,
        artworks: [art],
        count: 1,
      });
    }
  }

  const groups = Array.from(map.values());

  // Fisher-Yates shuffle para orden aleatorio en cada visita
  for (let i = groups.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [groups[i], groups[j]] = [groups[j], groups[i]];
  }

  return groups;
}

export async function getMyArtworks(artistId: string): Promise<Artwork[]> {
  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("artist_id", artistId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Artwork[];
}

const MAX_DIMENSION = 1600;
const COMPRESSION_QUALITY = 0.82;

function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    // If already small enough, skip compression
    if (file.size < 200_000) return resolve(file);

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;

      // Scale down if larger than MAX_DIMENSION
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(file);
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) return resolve(file);
          resolve(
            new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
              type: "image/webp",
            }),
          );
        },
        "image/webp",
        COMPRESSION_QUALITY,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Error al procesar la imagen"));
    };
    img.src = url;
  });
}

export async function uploadArtworkImage(
  file: File,
  artistId: string,
): Promise<string> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error("Formato no soportado. Usa JPEG, PNG o WebP.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("La imagen no debe superar los 5 MB.");
  }

  const compressed = await compressImage(file);
  const ext = compressed.name.split(".").pop()?.toLowerCase() ?? "webp";
  const path = `${artistId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("artworks")
    .upload(path, compressed, { contentType: compressed.type, upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from("artworks").getPublicUrl(path);
  return data.publicUrl;
}

export async function createArtwork(
  artwork: Pick<
    Artwork,
    "artist_id" | "title" | "description" | "technique" | "year" | "image_url"
  >,
): Promise<Artwork> {
  const { data, error } = await supabase
    .from("artworks")
    .insert(artwork)
    .select()
    .single();

  if (error) throw error;
  return data as Artwork;
}

export async function updateArtwork(
  id: string,
  updates: Partial<
    Pick<Artwork, "title" | "description" | "technique" | "year" | "image_url">
  >,
): Promise<Artwork> {
  const { data, error } = await supabase
    .from("artworks")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Artwork;
}

export async function deleteArtwork(id: string): Promise<void> {
  const { error } = await supabase.from("artworks").delete().eq("id", id);
  if (error) throw error;
}
