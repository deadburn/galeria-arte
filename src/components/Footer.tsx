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
        >
          <div className="space-y-4">
            <p>
              El{" "}
              <span className="font-semibold text-black-deep">
                1er Encuentro de Danza y Arte
              </span>{" "}
              nace en la necesidad de crear espacios culturales para artistas y
              bailarines de la ciudad de San Cristóbal, Táchira, siendo una
              manera de presentar a una extensa cantidad de talentos andinos.
            </p>

            <p>
              La expansión del medio ha podido conducir hacia otros espacios del
              país, por ende, surge esta galería virtual, como una manera de
              unificar a una gran cantidad de talentos.
            </p>

            {/* Táchira tricolor divider */}
            <div className="mx-auto flex h-1 w-20 overflow-hidden rounded-full">
              <div className="flex-1 bg-[#FFCD00]" />
              <div className="flex-1 bg-[#0A0A0A]" />
              <div className="flex-1 bg-[#CF142B]" />
            </div>

            <p>
              En medio de todo ello, la causa resulta benéfica, ya que el cover
              de la entrada será un{" "}
              <span className="font-semibold text-gold-accent">
                kilo de amor
              </span>{" "}
              (gatarina o perrarina). Todo lo recaudado será destinado al{" "}
              <span className="font-semibold text-black-deep">
                Refugio San Lázaro
              </span>
              , ubicado en la localidad de El Valle, Táchira, donde se alberga
              más de 250 animales.
            </p>
          </div>
        </FooterModal>
      )}

      {activeModal === "tachiraprensa" && (
        <FooterModal
          title="Táchira Prensa 2.0"
          onClose={() => setActiveModal(null)}
        >
          <p className="mb-4">También encuéntranos en:</p>

          <div className="space-y-3">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/tachira_prensa2.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-black-deep/8 px-4 py-3 transition-colors hover:border-gold-accent/30 hover:bg-gold-accent/5"
            >
              <svg
                className="h-5 w-5 shrink-0 text-gold-accent"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              <div>
                <p className="font-semibold text-black-deep text-sm">
                  Instagram
                </p>
                <p className="text-xs text-black-deep/50">@tachira_prensa2.0</p>
              </div>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com/@Tachiralaprensa2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-black-deep/8 px-4 py-3 transition-colors hover:border-gold-accent/30 hover:bg-gold-accent/5"
            >
              <svg
                className="h-5 w-5 shrink-0 text-gold-accent"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <div>
                <p className="font-semibold text-black-deep text-sm">YouTube</p>
                <p className="text-xs text-black-deep/50">@Tachiralaprensa2</p>
              </div>
            </a>

            {/* TikTok */}
            <a
              href="https://tiktok.com/@tachira.laprensa.2.0"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-black-deep/8 px-4 py-3 transition-colors hover:border-gold-accent/30 hover:bg-gold-accent/5"
            >
              <svg
                className="h-5 w-5 shrink-0 text-gold-accent"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
              <div>
                <p className="font-semibold text-black-deep text-sm">TikTok</p>
                <p className="text-xs text-black-deep/50">
                  @tachira.laprensa.2.0
                </p>
              </div>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com/share/16spvCe2c9/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-black-deep/8 px-4 py-3 transition-colors hover:border-gold-accent/30 hover:bg-gold-accent/5"
            >
              <svg
                className="h-5 w-5 shrink-0 text-gold-accent"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <div>
                <p className="font-semibold text-black-deep text-sm">
                  Facebook
                </p>
                <p className="text-xs text-black-deep/50">Táchira Prensa 2.0</p>
              </div>
            </a>

            {/* TikTok Cultural */}
            <a
              href="https://vm.tiktok.com/ZMAGaj8Xa/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-black-deep/8 px-4 py-3 transition-colors hover:border-gold-accent/30 hover:bg-gold-accent/5"
            >
              <svg
                className="h-5 w-5 shrink-0 text-gold-accent"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
              <div>
                <p className="font-semibold text-black-deep text-sm">
                  TikTok Cultural
                </p>
                <p className="text-xs text-black-deep/50">Contenido cultural</p>
              </div>
            </a>
          </div>
        </FooterModal>
      )}

      {activeModal === "equipo" && (
        <FooterModal
          title="Nuestro Equipo"
          onClose={() => setActiveModal(null)}
        >
          <p className="mb-4 text-black-deep/60">
            El equipo organizador cuenta con{" "}
            <span className="font-semibold text-black-deep">3 talentos</span>{" "}
            que hacen posible este evento:
          </p>

          <img
            src="/organizadores.jpeg"
            alt="Equipo organizador"
            className="mb-5 mx-auto w-2/3 rounded-xl object-cover"
          />

          <div className="space-y-5">
            <div>
              <h4 className="font-heading text-base text-black-deep">
                Lisys Mariana
              </h4>
              <p className="mt-1">
                Destacada periodista, locutora, editora y creativa de Táchira
                Prensa 2.0. Es quien da orden a cada idea que surge en el
                proyecto.
              </p>
            </div>

            <div>
              <h4 className="font-heading text-base text-black-deep">
                Maru Rodríguez
              </h4>
              <p className="mt-1">
                Esteticista, manager band y productora de este magno evento, así
                como productora de una gran cantidad de propuestas artísticas
                que se realizan en la escena.
              </p>
            </div>

            <div>
              <h4 className="font-heading text-base text-black-deep">
                Francisco Urrego
              </h4>
              <p className="mt-1">
                Periodista, redactor y creativo de Táchira Prensa 2.0. Juega un
                papel generalizado en este evento, dedicado a seguir creando
                espacios culturales para la escena regional y nacional.
              </p>
            </div>
          </div>

          {/* Táchira tricolor divider */}
          <div className="mx-auto my-6 flex h-1 w-20 overflow-hidden rounded-full">
            <div className="flex-1 bg-[#FFCD00]" />
            <div className="flex-1 bg-[#0A0A0A]" />
            <div className="flex-1 bg-[#CF142B]" />
          </div>

          <div className="space-y-5">
            <p>
              Por su parte, se cuenta con dos animadoras y locutoras,{" "}
              <span className="font-semibold text-gold-accent">
                Anggie Villamizar
              </span>{" "}
              y{" "}
              <span className="font-semibold text-gold-accent">
                Luissana Paola
              </span>
              , quienes ya han dicho presente en múltiples eventos culturales,
              siendo promotoras de la gran cantidad de talentos regionales y
              líderes en tarima de este evento.
            </p>

            <p>
              Pero no queda allí, este equipo se expandirá ya que se contará con{" "}
              <span className="font-semibold text-gold-accent">
                Gamaliel Castellanos
              </span>
              ,{" "}
              <span className="font-semibold text-gold-accent">
                Mabel Moncada
              </span>
              ,{" "}
              <span className="font-semibold text-gold-accent">
                Andriu Carreño
              </span>
              ,{" "}
              <span className="font-semibold text-gold-accent">
                El Sargento Pimienta
              </span>{" "}
              y el creador de esta página,{" "}
              <span className="font-semibold text-gold-accent">
                Brayan Rangel
              </span>
              . Todos son fundamentales para que este proyecto sea una realidad
              y una exploración.
            </p>
          </div>
        </FooterModal>
      )}

      {activeModal === "donaciones" && (
        <FooterModal title="¿Cómo Donar?" onClose={() => setActiveModal(null)}>
          <div className="space-y-4">
            <p>
              El{" "}
              <span className="font-semibold text-black-deep">
                Refugio San Lázaro
              </span>{" "}
              es un espacio ubicado en El Valle, Táchira, donde se alberga más
              de 250 animalitos, entre gatitos y perritos, de distintas edades y
              estados de salud, sumado a un personal que cuida este espacio.
            </p>

            <p>
              Con el pasar del tiempo, ha incrementado el número de peluditos,
              por lo cual, requiere de gran cuidado y mucha alimentación.
            </p>

            <p>
              <span className="font-semibold text-black-deep">
                ¿Por qué donar?
              </span>{" "}
              Es un lugar que requiere de nuestra ayuda y se está construyendo
              un espacio cultural para generar una labor benéfica y darle voz a
              quienes no la tienen.
            </p>

            <p>
              A cualquiera de las cuentas indicadas podrás donar lo que provenga
              de tu espíritu para ayudar a este refugio.
            </p>

            {/* Táchira tricolor divider */}
            <div className="mx-auto flex h-1 w-20 overflow-hidden rounded-full">
              <div className="flex-1 bg-[#FFCD00]" />
              <div className="flex-1 bg-[#0A0A0A]" />
              <div className="flex-1 bg-[#CF142B]" />
            </div>

            <div className="space-y-3">
              {/* Pago Móvil */}
              <div className="rounded-lg border border-black-deep/8 px-4 py-3">
                <p className="font-semibold text-gold-accent text-sm">
                  Pago Móvil - BDV
                </p>
                <p className="mt-1 text-xs text-black-deep/60">04247337804</p>
                <p className="text-xs text-black-deep/60">V-9.880.537</p>
              </div>

              {/* Zelle */}
              <div className="rounded-lg border border-black-deep/8 px-4 py-3">
                <p className="font-semibold text-gold-accent text-sm">Zelle</p>
                <p className="mt-1 text-xs text-black-deep/60">
                  refugiosanlazaro86@gmail.com
                </p>
              </div>

              {/* PayPal */}
              <div className="rounded-lg border border-black-deep/8 px-4 py-3">
                <p className="font-semibold text-gold-accent text-sm">PayPal</p>
                <p className="mt-1 text-xs text-black-deep/60">
                  refugiosanlazaro86@gmail.com
                </p>
              </div>
            </div>
          </div>
        </FooterModal>
      )}
    </>
  );
}
