import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { registerSchema } from "../lib/schemas";
import type { RegisterFormData } from "../lib/schemas";
import { signUp } from "../lib/supabase/auth";

export default function Register() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    setServerError("");
    try {
      await signUp(data.email, data.password, {
        name: data.name,
        technique: data.technique,
        portfolio_url: data.portfolio_url ?? "",
      });
      setSubmitted(true);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Error al registrarse",
      );
    }
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white-off px-4">
        <div className="animate-fade-in-up w-full max-w-md text-center">
          <h1 className="font-heading text-4xl text-black-deep">
            ¡Registro exitoso!
          </h1>
          <p className="mt-4 font-body text-black-deep/70">
            Tu solicitud está pendiente de aprobación. Te notificaremos cuando
            un administrador revise tu perfil.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-block rounded-lg border border-gold-accent px-6 py-3 font-body text-sm tracking-wider text-gold-accent transition-colors hover:bg-gold-accent hover:text-black-deep"
          >
            Ir al login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white-off px-4 py-8">
      <div className="animate-fade-in-up w-full max-w-md">
        {/* Táchira tricolor stripe */}
        <div className="rounded-2xl border border-black-deep/8 bg-white p-6 shadow-[0_-10px_35px_-6px_rgba(255,205,0,0.25),10px_0_35px_-6px_rgba(207,20,43,0.2),-10px_0_35px_-6px_rgba(10,10,10,0.14)] sm:p-8">
          <h1 className="mb-8 text-center font-heading text-4xl text-black-deep">
            Registro de Artista
          </h1>

          {serverError && (
            <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-center font-body text-sm text-red-400">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-1 block font-body text-sm text-black-deep/70">
                Nombre completo
              </label>
              <input
                {...register("name")}
                maxLength={80}
                autoComplete="name"
                className="w-full rounded-lg border border-black-deep/20 bg-transparent px-4 py-3 font-body text-black-deep outline-none transition-colors focus:border-gold-accent"
              />
              {errors.name && (
                <p className="mt-1 font-body text-xs text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block font-body text-sm text-black-deep/70">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                maxLength={254}
                autoComplete="email"
                className="w-full rounded-lg border border-black-deep/20 bg-transparent px-4 py-3 font-body text-black-deep outline-none transition-colors focus:border-gold-accent"
              />
              {errors.email && (
                <p className="mt-1 font-body text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block font-body text-sm text-black-deep/70">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  maxLength={72}
                  autoComplete="new-password"
                  placeholder="Mín. 8 caracteres, 1 letra y 1 número"
                  className="w-full rounded-lg border border-black-deep/20 bg-transparent px-4 py-3 pr-12 font-body text-black-deep placeholder:text-black-deep/30 outline-none transition-colors focus:border-gold-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-body text-xs text-black-deep/40 transition-colors hover:text-black-deep"
                >
                  {showPassword ? "Ocultar" : "Ver"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 font-body text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block font-body text-sm text-black-deep/70">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  {...register("confirmPassword")}
                  maxLength={72}
                  autoComplete="new-password"
                  placeholder="Repite tu contraseña"
                  className="w-full rounded-lg border border-black-deep/20 bg-transparent px-4 py-3 pr-12 font-body text-black-deep placeholder:text-black-deep/30 outline-none transition-colors focus:border-gold-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-body text-xs text-black-deep/40 transition-colors hover:text-black-deep"
                >
                  {showConfirm ? "Ocultar" : "Ver"}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 font-body text-xs text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block font-body text-sm text-black-deep/70">
                Técnica artística
              </label>
              <input
                {...register("technique")}
                placeholder="Ej: Óleo, Acuarela, Fotografía..."
                className="w-full rounded-lg border border-black-deep/20 bg-transparent px-4 py-3 font-body text-black-deep placeholder:text-black-deep/30 outline-none transition-colors focus:border-gold-accent"
              />
              {errors.technique && (
                <p className="mt-1 font-body text-xs text-red-400">
                  {errors.technique.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block font-body text-sm text-black-deep/70">
                Instagram (opcional)
              </label>
              <input
                {...register("portfolio_url")}
                placeholder="https://instagram.com/tu_usuario"
                className="w-full rounded-lg border border-black-deep/20 bg-transparent px-4 py-3 font-body text-black-deep placeholder:text-black-deep/30 outline-none transition-colors focus:border-gold-accent"
              />
              {errors.portfolio_url && (
                <p className="mt-1 font-body text-xs text-red-400">
                  {errors.portfolio_url.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-gold-accent py-3 font-body text-sm tracking-wider text-black-deep transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          <p className="mt-6 text-center font-body text-sm text-black-deep/50">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-gold-accent hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
