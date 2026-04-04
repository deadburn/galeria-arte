import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../lib/schemas";
import type { LoginFormData } from "../lib/schemas";
import { signIn } from "../lib/supabase/auth";
import { getCurrentProfile } from "../lib/supabase/auth";

export default function Login() {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setServerError("");
    try {
      await signIn(data.email, data.password);

      const profile = await getCurrentProfile();

      if (!profile) {
        setServerError("No se encontró el perfil del usuario.");
        return;
      }

      if (profile.status === "PENDING") {
        setServerError("Tu cuenta aún está pendiente de aprobación.");
        return;
      }

      if (profile.status === "REJECTED") {
        setServerError("Tu solicitud fue rechazada.");
        return;
      }

      if (profile.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Error al iniciar sesión",
      );
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black-deep px-4">
      <div className="animate-fade-in-up w-full max-w-md">
        <h1 className="mb-8 text-center font-heading text-4xl text-white-off">
          Iniciar Sesión
        </h1>

        {serverError && (
          <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-center font-body text-sm text-red-400">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-1 block font-body text-sm text-white-off/70">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-lg border border-white-off/20 bg-transparent px-4 py-3 font-body text-white-off outline-none transition-colors focus:border-gold-accent"
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
              className="w-full rounded-lg border border-white-off/20 bg-transparent px-4 py-3 font-body text-white-off outline-none transition-colors focus:border-gold-accent"
            />
            {errors.password && (
              <p className="mt-1 font-body text-xs text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-gold-accent py-3 font-body text-sm tracking-wider text-black-deep transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="mt-6 text-center font-body text-sm text-white-off/50">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-gold-accent hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
