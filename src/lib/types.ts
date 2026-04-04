export type Role = "ARTIST" | "ADMIN";
export type Status = "PENDING" | "APPROVED" | "REJECTED";

export interface Profile {
  id: string;
  email: string;
  name: string;
  bio: string | null;
  technique: string | null;
  portfolio_url: string | null;
  role: Role;
  status: Status;
  created_at: string;
}

export interface Artwork {
  id: string;
  artist_id: string;
  title: string;
  description: string | null;
  technique: string | null;
  year: number | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  profiles?: { name: string };
}
