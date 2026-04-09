import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import dotenv from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET = "artworks";
const MAX_DIMENSION = 1600;
const QUALITY = 82;

interface ArtworkRow {
  id: string;
  image_url: string | null;
}

async function listAllFiles(folder = ""): Promise<string[]> {
  const paths: string[] = [];
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(folder, { limit: 1000 });
  if (error) {
    console.error(`  Error listando ${folder}:`, error.message);
    return paths;
  }
  for (const item of data ?? []) {
    const fullPath = folder ? `${folder}/${item.name}` : item.name;
    if (item.id === null) {
      // Es una carpeta
      paths.push(...(await listAllFiles(fullPath)));
    } else {
      paths.push(fullPath);
    }
  }
  return paths;
}

async function optimizeFile(
  path: string,
): Promise<{ newPath: string; oldUrl: string; newUrl: string } | null> {
  // Skip if already webp
  if (path.toLowerCase().endsWith(".webp")) {
    console.log(`  ⏭  Ya es WebP: ${path}`);
    return null;
  }

  console.log(`  ⬇  Descargando: ${path}`);
  const { data: fileData, error: dlError } = await supabase.storage
    .from(BUCKET)
    .download(path);
  if (dlError || !fileData) {
    console.error(`  ❌ Error descargando ${path}:`, dlError?.message);
    return null;
  }

  const buffer = Buffer.from(await fileData.arrayBuffer());
  const originalSize = buffer.length;

  console.log(`  🔄 Comprimiendo (${(originalSize / 1024).toFixed(0)} KB)...`);
  const compressed = await sharp(buffer)
    .resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: QUALITY })
    .toBuffer();

  const newSize = compressed.length;
  const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

  if (newSize >= originalSize) {
    console.log(`  ⏭  Sin mejora, se omite (${savings}%)`);
    return null;
  }

  console.log(
    `  ✅ ${(originalSize / 1024).toFixed(0)} KB → ${(newSize / 1024).toFixed(0)} KB (${savings}% menos)`,
  );

  // Upload compressed version with new .webp extension
  const newPath = path.replace(/\.\w+$/, ".webp");

  const { error: upError } = await supabase.storage
    .from(BUCKET)
    .upload(newPath, compressed, {
      contentType: "image/webp",
      upsert: true,
    });

  if (upError) {
    console.error(`  ❌ Error subiendo ${newPath}:`, upError.message);
    return null;
  }

  // Delete old file if path changed
  if (newPath !== path) {
    await supabase.storage.from(BUCKET).remove([path]);
  }

  const oldUrl = supabase.storage.from(BUCKET).getPublicUrl(path)
    .data.publicUrl;
  const newUrl = supabase.storage.from(BUCKET).getPublicUrl(newPath)
    .data.publicUrl;

  return { newPath, oldUrl, newUrl };
}

async function main() {
  console.log("🖼️  Optimizador de imágenes existentes\n");
  console.log("📦 Bucket:", BUCKET);
  console.log("📐 Max dimensión:", MAX_DIMENSION, "px");
  console.log("🎨 Calidad WebP:", QUALITY, "%\n");

  // 1. List all files in storage
  console.log("📂 Listando archivos...");
  const files = await listAllFiles();
  console.log(`   Encontrados: ${files.length} archivos\n`);

  if (files.length === 0) {
    console.log("No hay archivos para optimizar.");
    return;
  }

  // 2. Get all artworks from DB for URL update
  const { data: artworks, error: dbError } = await supabase
    .from("artworks")
    .select("id, image_url");

  if (dbError) {
    console.error("Error leyendo artworks:", dbError.message);
    return;
  }

  // 3. Optimize each file
  let optimized = 0;
  let skipped = 0;
  let totalSaved = 0;

  for (const filePath of files) {
    console.log(
      `\n[${files.indexOf(filePath) + 1}/${files.length}] ${filePath}`,
    );
    const result = await optimizeFile(filePath);

    if (!result) {
      skipped++;
      continue;
    }

    optimized++;

    // 4. Update DB if URL changed
    const matching = (artworks as ArtworkRow[])?.filter(
      (a) =>
        a.image_url && a.image_url.includes(filePath.replace(/\.\w+$/, "")),
    );

    for (const artwork of matching) {
      const { error: updateError } = await supabase
        .from("artworks")
        .update({ image_url: result.newUrl })
        .eq("id", artwork.id);

      if (updateError) {
        console.error(
          `  ❌ Error actualizando DB para artwork ${artwork.id}:`,
          updateError.message,
        );
      } else {
        console.log(`  📝 DB actualizada: artwork ${artwork.id}`);
      }
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`✅ Optimizadas: ${optimized}`);
  console.log(`⏭  Omitidas: ${skipped}`);
  console.log("=".repeat(50));
}

main().catch(console.error);
