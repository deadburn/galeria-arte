import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = "Art Gallery <onboarding@resend.dev>";

interface RequestBody {
  email: string;
  type: "approved" | "rejected";
  artistName: string;
}

/** Escapa HTML para prevenir XSS en emails */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/** Valida formato de email básico */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function buildApprovedHtml(name: string): string {
  const safeName = escapeHtml(name);
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #0A0A0A; padding: 40px; color: #F5F0EB;">
      <h1 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 28px; color: #C9A84C; margin-bottom: 16px;">
        ¡Bienvenido, ${safeName}!
      </h1>
      <p style="font-size: 15px; line-height: 1.6; color: #F5F0EB;">
        Tu solicitud ha sido <strong style="color: #C9A84C;">aprobada</strong>. Ya puedes acceder a tu panel de artista para subir y gestionar tus obras.
      </p>
      <a href="${Deno.env.get("SITE_URL") ?? "https://artgallery.vercel.app"}/login"
         style="display: inline-block; margin-top: 24px; padding: 12px 32px; background: #C9A84C; color: #0A0A0A; text-decoration: none; font-weight: 600; font-size: 14px; letter-spacing: 0.5px;">
        INGRESAR AL PANEL
      </a>
    </div>
  `;
}

function buildRejectedHtml(name: string): string {
  const safeName = escapeHtml(name);
  return `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #0A0A0A; padding: 40px; color: #F5F0EB;">
      <h1 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 28px; color: #F5F0EB; margin-bottom: 16px;">
        Hola, ${safeName}
      </h1>
      <p style="font-size: 15px; line-height: 1.6; color: #F5F0EB;">
        Lamentamos informarte que tu solicitud no ha sido aprobada en esta ocasión. Si crees que se trata de un error, puedes contactarnos para más información.
      </p>
    </div>
  `;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { email, type, artistName } = (await req.json()) as RequestBody;

    if (!email || !type || !artistName) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: email, type, artistName",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (type !== "approved" && type !== "rejected") {
      return new Response(
        JSON.stringify({
          error: "Invalid type. Must be 'approved' or 'rejected'",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (artistName.length > 80) {
      return new Response(JSON.stringify({ error: "Artist name too long" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const subject =
      type === "approved"
        ? "🎨 ¡Tu solicitud fue aprobada! — Art Gallery"
        : "Art Gallery — Actualización de tu solicitud";

    const html =
      type === "approved"
        ? buildApprovedHtml(artistName)
        : buildRejectedHtml(artistName);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject,
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: "Resend API error", details: data }),
        {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal error", message: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
