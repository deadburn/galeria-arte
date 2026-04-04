interface Props {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmModal({
  title,
  message,
  confirmLabel = "Eliminar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  loading = false,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="animate-fade-in absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="animate-fade-in-scale relative mx-4 w-full max-w-md rounded-2xl border border-white-off/10 bg-black-deep p-8">
        <h2 className="font-heading text-xl text-white-off">{title}</h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-white-off/60">
          {message}
        </p>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2.5 font-body text-sm uppercase tracking-widest text-white-off/50 transition-colors hover:text-white-off disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg border border-red-500 px-5 py-2.5 font-body text-sm uppercase tracking-widest text-red-400 transition-colors hover:bg-red-500 hover:text-black-deep disabled:opacity-50"
          >
            {loading ? "Eliminando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
