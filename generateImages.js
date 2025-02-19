import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 📂 Définition des chemins
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGE_DIR = path.join(__dirname, "public/pokefusion");
const OUTPUT_DIR = path.join(__dirname, "src/data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "images.json");

// Vérifier si le dossier `src/data/` existe, sinon le créer
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Vérifier si le dossier `pokefusion/` existe
if (!fs.existsSync(IMAGE_DIR)) {
  console.error("❌ Le dossier pokefusion n'existe pas !");
  process.exit(1);
}

// Lire les fichiers du dossier
fs.readdir(IMAGE_DIR, (err, files) => {
  if (err) {
    console.error("❌ Erreur lors de la lecture du dossier :", err);
    return;
  }

  // Filtrer uniquement les images (jpg, png, etc.)
  const imageFiles = files.filter(file => /\.(png|jpg|jpeg|gif|webp)$/i.test(file));

  // Générer un tableau JSON avec les chemins des images et les numéros extraits
  const imageData = imageFiles.map((file, index) => {
    // Extraire les deux IDs sans la lettre finale (ex: "94.52a.png" → 94 et 52)
    const match = file.match(/^(\d+)\.(\d+)/);
    if (!match) {
      console.warn(`⚠ Nom de fichier non conforme : ${file}`);
      return null;
    }

    const firstId = parseInt(match[1], 10);
    const secondId = parseInt(match[2], 10); // Ignore la lettre finale

    return {
      id: index + 1,
      firstId: firstId,
      secondId: secondId,
      name: file,
      path: `/pokefusion/${file}`
    };
  }).filter(Boolean); // Supprimer les `null` en cas d'erreur de nommage

  // Écrire dans le fichier JSON
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(imageData, null, 2));

  console.log(`✅ ${imageData.length} images enregistrées dans ${OUTPUT_FILE}`);
});