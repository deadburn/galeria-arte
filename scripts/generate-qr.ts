import QRCode from "qrcode";
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ===== CAMBIA ESTA URL CUANDO TENGAS LA DE PRODUCCIÓN =====
const TARGET_URL = "https://galeria-arte-phi.vercel.app";
// ===========================================================

const svgPath = resolve(__dirname, "../public/qr-galeria.svg");
const pngPath = resolve(__dirname, "../public/qr-galeria.png");

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

  writeFileSync(svgPath, svg);
  console.log(`QR SVG generado → public/qr-galeria.svg`);

  await QRCode.toFile(pngPath, TARGET_URL, {
    type: "png",
    width: 1024,
    margin: 2,
    color: {
      dark: "#C9A84C",
      light: "#0A0A0A",
    },
    errorCorrectionLevel: "H",
  });

  console.log(`QR PNG generado → public/qr-galeria.png`);
  console.log(`Apunta a: ${TARGET_URL}`);
}

main();
