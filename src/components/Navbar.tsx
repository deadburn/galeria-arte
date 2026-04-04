import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentProfile, signOut } from "../lib/supabase/auth";
import { supabase } from "../lib/supabase/client";
import type { Profile } from "../lib/types";

export default function Navbar() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentProfile().then(setProfile);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        getCurrentProfile().then(setProfile);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await signOut();
    setProfile(null);
    setOpen(false);
    navigate("/");
  }

  function closeMenu() {
    setOpen(false);
  }

  const linkClass =
    "block font-body text-sm uppercase tracking-widest text-white-off/60 transition-colors hover:text-white-off";

  return (
    <nav className="border-b border-white-off/10 bg-black-deep">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          to="/"
          onClick={closeMenu}
          className="font-heading text-xl tracking-wide text-white-off sm:text-2xl"
        >
          Art Gallery
        </Link>

        {/* Hamburger button — mobile only */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Menú"
          className="relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`block h-0.5 w-5 bg-white-off transition-all duration-300 ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-white-off transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-white-off transition-all duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link to="/" className={linkClass}>
            Galería
          </Link>

          {profile?.role === "ADMIN" && profile.status === "APPROVED" && (
            <Link to="/admin" className={linkClass}>
              Admin
            </Link>
          )}

          {profile?.role === "ARTIST" && profile.status === "APPROVED" && (
            <Link to="/dashboard" className={linkClass}>
              Mi Panel
            </Link>
          )}

          {profile ? (
            <button onClick={handleSignOut} className={linkClass}>
              Cerrar sesión
            </button>
          ) : (
            <Link to="/login" className={linkClass}>
              Ingresar
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu overlay */}
      {open && (
        <div className="animate-fade-in fixed inset-0 z-40 bg-black-deep/95 backdrop-blur-sm md:hidden">
          <div className="animate-slide-up flex min-h-screen flex-col items-center justify-center gap-8">
            <Link to="/" onClick={closeMenu} className={linkClass + " text-lg"}>
              Galería
            </Link>

            {profile?.role === "ADMIN" && profile.status === "APPROVED" && (
              <Link
                to="/admin"
                onClick={closeMenu}
                className={linkClass + " text-lg"}
              >
                Admin
              </Link>
            )}

            {profile?.role === "ARTIST" && profile.status === "APPROVED" && (
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className={linkClass + " text-lg"}
              >
                Mi Panel
              </Link>
            )}

            {profile ? (
              <button
                onClick={handleSignOut}
                className={linkClass + " text-lg"}
              >
                Cerrar sesión
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className={linkClass + " text-lg"}
              >
                Ingresar
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
