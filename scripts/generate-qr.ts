import QRCode from "qrcode";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ===== CAMBIA ESTA URL CUANDO TENGAS LA DE PRODUCCIÓN =====
const TARGET_URL = "https://galeria-arte-phi.vercel.app";
// ===========================================================

const outputPath = resolve(__dirname, "../public/qr-galeria.svg");

async function main() {
  const svg = await QRCode.toString(TARGET_URL, {
    type: "svg",
    width: 1024,
    margin: 2,
    color: {
      dark: "#C9A84C", // gold-accent
      light: "#0A0A0A", // black-deep
    },
    errorCorrectionLevel: "H",
  });

  writeFileSync(outputPath, svg);
  console.log(`QR generado → public/qr-galeria.svg`);
  console.log(`Apunta a: ${TARGET_URL}`);
}

main();
