import { supabase } from "./client";
import type { Artwork, ArtistGroup } from "../types";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function getApprovedArtworks(): Promise<Artwork[]> {
  const { data, error } = await supabase
    .from("artworks")
    .select("*, profiles(name, bio, technique, portfolio_url)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Artwork[];
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

  return Array.from(map.values());
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

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${artistId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("artworks")
    .upload(path, file, { contentType: file.type, upsert: false });

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
