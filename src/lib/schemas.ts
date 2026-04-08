import { z } from "zod";

// Dominios desechables / temporales más comunes
const DISPOSABLE_DOMAINS = [
  "mailinator.com",
  "guerrillamail.com",
  "tempmail.com",
  "throwaway.email",
  "yopmail.com",
  "sharklasers.com",
  "guerrillamailblock.com",
  "grr.la",
  "dispostable.com",
  "trashmail.com",
  "temp-mail.org",
  "fakeinbox.com",
  "maildrop.cc",
  "10minutemail.com",
  "minuteinbox.com",
  "emailondeck.com",
  "tempr.email",
  "discard.email",
  "mailnesia.com",
  "getnada.com",
];

const nameValidation = z
  .string()
  .trim()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(80, "El nombre es muy largo")
  .regex(
    /^[a-záàäâãéèëêíìïîóòöôõúùüûñçA-ZÁÀÄÂÃÉÈËÊÍÌÏÎÓÒÖÔÕÚÙÜÛÑÇ\s'-]+$/,
    "El nombre solo puede contener letras, espacios, apóstrofes y guiones",
  );

const emailValidation = z
  .string()
  .trim()
  .toLowerCase()
  .email("Email inválido")
  .max(254, "El email es muy largo")
  .refine(
    (email) => {
      const domain = email.split("@")[1];
      return !DISPOSABLE_DOMAINS.includes(domain);
    },
    { message: "No se permiten correos temporales o desechables" },
  )
  .refine(
    (email) => {
      const domain = email.split("@")[1];
      return domain?.includes(".");
    },
    { message: "El dominio del email no es válido" },
  );

const passwordValidation = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .max(72, "La contraseña es muy larga")
  .regex(/[a-záéíóúñ]/i, "Debe contener al menos una letra")
  .regex(/[0-9]/, "Debe contener al menos un número");

const techniqueValidation = z
  .string()
  .trim()
  .min(2, "Indica tu técnica artística")
  .max(60, "La técnica es muy larga");

const instagramValidation = z
  .string()
  .trim()
  .url("URL inválida")
  .regex(
    /^https?:\/\/(www\.)?instagram\.com\/.+/i,
    "Debe ser un enlace de Instagram válido",
  )
  .or(z.literal(""))
  .optional();

export const registerSchema = z.object({
  name: nameValidation,
  email: emailValidation,
  password: passwordValidation,
  technique: techniqueValidation,
  portfolio_url: instagramValidation,
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email inválido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
