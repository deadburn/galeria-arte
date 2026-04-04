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
        portfolio_url: data.portfolio_url,
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
      <div className="flex min-h-screen items-center justify-center bg-black-deep px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="font-heading text-4xl text-white-off">
            ¡Registro exitoso!
          </h1>
          <p className="mt-4 font-body text-white-off/70">
            Tu solicitud está pendiente de aprobación. Te notificaremos cuando
            un administrador revise tu perfil.
          </p>
          <Link
            to="/login"
            className="mt-8 inline-block border border-gold-accent px-6 py-3 font-body text-sm tracking-wider text-gold-accent transition-colors hover:bg-gold-accent hover:text-black-deep"
          >
            Ir al login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black-deep px-4">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-center font-heading text-4xl text-white-off">
          Registro de Artista
        </h1>

        {serverError && (
          <div className="mb-4 border border-red-500/50 bg-red-500/10 p-3 text-center font-body text-sm text-red-400">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-1 block font-body text-sm text-white-off/70">
              Nombre completo
            </label>
            <input
              {...register("name")}
              className="w-full border border-white-off/20 bg-transparent px-4 py-3 font-body text-white-off outline-none transition-colors focus:border-gold-accent"
            />
            {errors.name && (
              <p className="mt-1 font-body text-xs text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block font-body text-sm text-white-off/70">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full border border-white-off/20 bg-transparent px-4 py-3 font-body text-white-off outline-none transition-colors focus:border-gold-accent"
            />
            {errors.email && (
              <p className="mt-1 font-body text-xs text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block font-body text-sm text-white-off/70">
              Contraseña
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full border border-white-off/20 bg-transparent px-4 py-3 font-body text-white-off outline-none transition-colors focus:border-gold-accent"
            />
            {errors.password && (
              <p className="mt-1 font-body text-xs text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block font-body text-sm text-white-off/70">
              Técnica artística
            </label>
            <input
              {...register("technique")}
              placeholder="Ej: Óleo, Acuarela, Fotografía..."
              className="w-full border border-white-off/20 bg-transparent px-4 py-3 font-body text-white-off placeholder:text-white-off/30 outline-none transition-colors focus:border-gold-accent"
            />
            {errors.technique && (
              <p className="mt-1 font-body text-xs text-red-400">
                {errors.technique.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block font-body text-sm text-white-off/70">
              URL de portafolio (opcional)
            </label>
            <input
              {...register("portfolio_url")}
              placeholder="https://..."
              className="w-full border border-white-off/20 bg-transparent px-4 py-3 font-body text-white-off placeholder:text-white-off/30 outline-none transition-colors focus:border-gold-accent"
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
            className="w-full bg-gold-accent py-3 font-body text-sm tracking-wider text-black-deep transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="mt-6 text-center font-body text-sm text-white-off/50">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-gold-accent hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
