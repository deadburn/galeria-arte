import { z } from "zod";

// Proveedores de email permitidos (reales y conocidos)
const ALLOWED_DOMAINS = [
  // Google
  "gmail.com",
  "googlemail.com",
  // Microsoft
  "hotmail.com",
  "outlook.com",
  "outlook.es",
  "live.com",
  "msn.com",
  "hotmail.es",
  "hotmail.co",
  // Yahoo
  "yahoo.com",
  "yahoo.es",
  "yahoo.com.mx",
  "yahoo.com.ar",
  "yahoo.com.co",
  "ymail.com",
  // Apple
  "icloud.com",
  "me.com",
  "mac.com",
  // Otros proveedores reales
  "protonmail.com",
  "proton.me",
  "zoho.com",
  "aol.com",
  // Latinoamérica comunes
  "cantv.net",
  "movistar.com.ve",
  "inter.net.ve",
];

// Dominios reales → typos comunes que la gente escribe
const DOMAIN_TYPO_MAP: Record<string, string[]> = {
  "gmail.com": [
    "gmial.com",
    "gmai.com",
    "gmil.com",
    "gmal.com",
    "gamil.com",
    "gnail.com",
    "gmail.co",
    "gmail.cm",
    "gmail.om",
    "gmaill.com",
    "gmeil.com",
    "gmaul.com",
    "gmsil.com",
    "gimail.com",
    "gmail.con",
    "gmail.cim",
    "gmail.vom",
    "gemail.com",
    "hmail.com",
    "gmill.com",
  ],
  "hotmail.com": [
    "hotmal.com",
    "hotmial.com",
    "hotmai.com",
    "hotmil.com",
    "hotmeil.com",
    "hotmail.con",
    "hotmaill.com",
    "hotamil.com",
    "homail.com",
    "htmail.com",
    "hotmail.cm",
    "hotmsil.com",
  ],
  "outlook.com": [
    "outook.com",
    "outlok.com",
    "outllook.com",
    "outlool.com",
    "outlook.con",
    "outloock.com",
    "oulook.com",
  ],
  "yahoo.com": [
    "yaho.com",
    "yahooo.com",
    "yhaoo.com",
    "yaoo.com",
    "yahoo.con",
    "yahoo.cm",
    "yahho.com",
    "yaooh.com",
  ],
  "icloud.com": ["iclod.com", "icoud.com", "icloud.con", "icloude.com"],
};

/** Devuelve el dominio correcto sugerido, o null si no hay typo detectado */
export function detectEmailTypo(email: string): string | null {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return null;

  for (const [correct, typos] of Object.entries(DOMAIN_TYPO_MAP)) {
    if (typos.includes(domain)) {
      return email.split("@")[0] + "@" + correct;
    }
  }
  return null;
}

const emailValidation = z
  .string()
  .trim()
  .toLowerCase()
  .email("Email inválido")
  .max(254, "El email es muy largo")
  .refine(
    (email) => {
      const domain = email.split("@")[1];
      return ALLOWED_DOMAINS.includes(domain);
    },
    {
      message:
        "Usa un correo de un proveedor conocido (Gmail, Hotmail, Outlook, Yahoo, iCloud, etc.)",
    },
  )
  .refine(
    (email) => {
      return detectEmailTypo(email) === null;
    },
    {
      message: "El dominio del email parece tener un error de escritura",
    },
  );

const nameValidation = z
  .string()
  .trim()
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(80, "El nombre es muy largo")
  .regex(
    /^[a-záàäâãéèëêíìïîóòöôõúùüûñçA-ZÁÀÄÂÃÉÈËÊÍÌÏÎÓÒÖÔÕÚÙÜÛÑÇ\s'-]+$/,
    "El nombre solo puede contener letras, espacios, apóstrofes y guiones",
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

export const registerSchema = z
  .object({
    name: nameValidation,
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
    technique: techniqueValidation,
    portfolio_url: instagramValidation,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email inválido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
