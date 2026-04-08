import { useState } from "react";
import FooterModal from "./FooterModal";

type ModalKey = "evento" | "tachiraprensa" | "equipo" | "donaciones" | null;

export default function Footer() {
  const [activeModal, setActiveModal] = useState<ModalKey>(null);

  const buttonClass =
    "font-body text-sm text-black-deep/50 transition-colors hover:text-gold-accent cursor-pointer";

  return (
    <>
      <footer className="border-t border-black-deep/8 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          {/* Top section */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* About the event */}
            <div>
              <h3 className="mb-3 font-heading text-lg text-black-deep">
                Sobre el Evento
              </h3>
              <p className="mb-3 font-body text-xs leading-relaxed text-black-deep/50">
                Galería virtual en apoyo al refugio de animales.
              </p>
              <button
                onClick={() => setActiveModal("evento")}
                className={buttonClass}
              >
                Conoce más →
              </button>
            </div>

            {/* Táchira Prensa 2.0 */}
            <div>
              <h3 className="mb-3 font-heading text-lg text-black-deep">
                Táchira Prensa 2.0
              </h3>
              <p className="mb-3 font-body text-xs leading-relaxed text-black-deep/50">
                El medio que hace posible esta iniciativa.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setActiveModal("tachiraprensa")}
                  className={buttonClass}
                >
                  Más información →
                </button>
                <a
                  href="https://www.instagram.com/tachira_prensa2.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-body text-sm text-black-deep/50 transition-colors hover:text-gold-accent"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  @tachiraprensa2.0
                </a>
              </div>
            </div>

            {/* Team */}
            <div>
              <h3 className="mb-3 font-heading text-lg text-black-deep">
                Nuestro Equipo
              </h3>
              <p className="mb-3 font-body text-xs leading-relaxed text-black-deep/50">
                Las personas detrás de esta iniciativa.
              </p>
              <button
                onClick={() => setActiveModal("equipo")}
                className={buttonClass}
              >
                Ver equipo →
              </button>
            </div>

            {/* Donations */}
            <div>
              <h3 className="mb-3 font-heading text-lg text-black-deep">
                Donaciones
              </h3>
              <p className="mb-3 font-body text-xs leading-relaxed text-black-deep/50">
                Ayuda a los animalitos del refugio con tu aporte.
              </p>
              <button
                onClick={() => setActiveModal("donaciones")}
                className={buttonClass + " !text-gold-accent font-semibold"}
              >
                ¿Cómo donar? →
              </button>
            </div>
          </div>

          {/* Táchira tricolor divider */}
          <div className="mx-auto my-8 flex h-1 w-24 overflow-hidden rounded-full">
            <div className="flex-1 bg-[#FFCD00]" />
            <div className="flex-1 bg-[#0A0A0A]" />
            <div className="flex-1 bg-[#CF142B]" />
          </div>

          {/* Bottom */}
          <p className="text-center font-body text-xs text-black-deep/30">
            © {new Date().getFullYear()} Galería Virtual Jackson Márquez —
            Táchira Prensa 2.0
          </p>
        </div>
      </footer>

      {/* Modals */}
      {activeModal === "evento" && (
        <FooterModal
          title="Sobre el Evento"
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "tachiraprensa" && (
        <FooterModal
          title="Táchira Prensa 2.0"
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "equipo" && (
        <FooterModal
          title="Nuestro Equipo"
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "donaciones" && (
        <FooterModal
          title="¿Cómo Donar?"
          onClose={() => setActiveModal(null)}
        />
      )}
    </>
  );
}
