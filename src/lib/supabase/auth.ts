import { supabase } from "./client";
import type { Profile } from "../types";

export async function signUp(
  email: string,
  password: string,
  profile: { name: string; technique: string; portfolio_url: string },
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: profile.name,
        technique: profile.technique,
        portfolio_url: profile.portfolio_url || "",
      },
    },
  });

  if (error) throw error;
  if (!data.user) throw new Error("No se pudo crear el usuario");

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) return null;
  return data as Profile;
}

export async function updateProfile(
  id: string,
  updates: Partial<
    Pick<Profile, "name" | "bio" | "technique" | "portfolio_url" | "avatar_url">
  >,
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

const AVATAR_MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function uploadAvatar(
  file: File,
  userId: string,
): Promise<string> {
  if (!AVATAR_TYPES.includes(file.type)) {
    throw new Error("Formato no soportado. Usa JPEG, PNG o WebP.");
  }
  if (file.size > AVATAR_MAX_SIZE) {
    throw new Error("La foto no debe superar los 2 MB.");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${userId}/avatar.${ext}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { contentType: file.type, upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  // Add cache-busting param since we upsert with same path
  return `${data.publicUrl}?t=${Date.now()}`;
}
