import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCurrentProfile, signOut } from "../lib/supabase/auth";
import { supabase } from "../lib/supabase/client";
import type { Profile } from "../lib/types";

export default function Navbar() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const hideGlow = pathname === "/login" || pathname === "/register";

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
    "block font-body text-sm uppercase tracking-widest text-black-deep/60 transition-colors hover:text-black-deep";

  return (
    <>
      {/* Venezuela tricolor stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FFCD00] via-[#00247D] to-[#CF142B]" />

      <nav className="border-b border-black-deep/8 bg-white-off overflow-x-hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-2 py-2 sm:px-6">
          {/* Left: Both logos side by side */}
          <div className="-ml-1 flex items-center gap-2 sm:ml-0 sm:gap-3">
            <Link to="/" onClick={closeMenu} className="shrink-0">
              <img
                src="/logo.png"
                alt="Galeria Virtual Jackson Marquez"
                className="h-14 w-auto sm:h-22 md:h-24"
              />
            </Link>
            <div className="h-8 w-px shrink-0 bg-black-deep/10 sm:h-12" />
            <a
              href="https://www.instagram.com/tachira_prensa2.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <img
                src="/logoTP2.0.png"
                alt="Táchira Prensa 2.0"
                className="h-12 w-auto sm:h-20 md:h-22"
              />
            </a>
          </div>

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

          {/* Hamburger button — mobile only */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menú"
            className="relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`block h-0.5 w-5 bg-black-deep transition-all duration-300 ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-black-deep transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-black-deep transition-all duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>

        {/* Mobile menu overlay */}
        {open && (
          <div className="animate-fade-in fixed inset-0 z-40 bg-white-off/95 backdrop-blur-sm md:hidden">
            <div className="animate-slide-up flex min-h-screen flex-col items-center justify-center gap-8">
              <Link
                to="/"
                onClick={closeMenu}
                className={linkClass + " text-lg"}
              >
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

      {/* Subtle tricolor glow — overlaps content, no extra space */}
      {!hideGlow && (
        <div className="pointer-events-none relative z-10 -mb-32 h-32 w-full bg-[linear-gradient(to_bottom,rgba(255,205,0,0.08)_0%,rgba(0,36,125,0.08)_40%,rgba(207,20,43,0.1)_70%,transparent_100%)] sm:-mb-40 sm:h-40" />
      )}
    </>
  );
}
