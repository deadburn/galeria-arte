import { useEffect } from "react";

interface Props {
  title: string;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function FooterModal({ title, onClose, children }: Props) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      <div
        className="animate-fade-in absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="animate-fade-in-scale relative my-auto w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-black-deep/8 bg-white p-6 shadow-2xl shadow-black/15 sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-black-deep/40 transition-colors hover:bg-black-deep/5 hover:text-black-deep"
          aria-label="Cerrar"
        >
          ✕
        </button>

        <h2 className="mb-6 pr-8 font-heading text-2xl text-black-deep">
          {title}
        </h2>

        <div className="font-body text-sm leading-relaxed text-black-deep/70">
          {children || (
            <p className="italic text-black-deep/40">
              Información próximamente...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
