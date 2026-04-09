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
  const [showPassword, setShowPassword] = useState(false);
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
      const msg =
        err instanceof Error ? err.message : "Error al iniciar sesión";
      if (msg === "Failed to fetch" || msg.includes("fetch")) {
        setServerError(
          "Error de conexión. Tu red WiFi podría estar bloqueando el acceso. Intenta con datos móviles o cambia el DNS de tu WiFi a 8.8.8.8",
        );
      } else {
        setServerError(msg);
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white-off px-4">
      <div className="animate-fade-in-up w-full max-w-md">
        {/* Táchira tricolor stripe */}
        <div className="rounded-2xl border border-black-deep/8 bg-white p-6 shadow-[0_-10px_35px_-6px_rgba(255,205,0,0.25),10px_0_35px_-6px_rgba(207,20,43,0.2),-10px_0_35px_-6px_rgba(10,10,10,0.14)] sm:p-8">
          <h1 className="mb-8 text-center font-heading text-4xl text-black-deep">
            Iniciar Sesión
          </h1>

          {serverError && (
            <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-center font-body text-sm text-red-400">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-1 block font-body text-sm text-black-deep/70">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
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
                  className="w-full rounded-lg border border-black-deep/20 bg-transparent px-4 py-3 pr-12 font-body text-black-deep outline-none transition-colors focus:border-gold-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black-deep/40 transition-colors hover:text-black-deep"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Ver contraseña"
                  }
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
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

          <p className="mt-6 text-center font-body text-sm text-black-deep/50">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-gold-accent hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
