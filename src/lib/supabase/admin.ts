import { supabase } from "./client";
import type { Profile, Status } from "../types";

export async function getPendingArtists(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("status", "PENDING")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Profile[];
}

export async function updateArtistStatus(
  artistId: string,
  status: Status,
  email: string,
  artistName: string,
) {
  const { error } = await supabase
    .from("profiles")
    .update({ status })
    .eq("id", artistId);

  if (error) throw error;

  await supabase.functions.invoke("notify-artist", {
    body: {
      email,
      type: status === "APPROVED" ? "approved" : "rejected",
      artistName,
    },
  });
}
