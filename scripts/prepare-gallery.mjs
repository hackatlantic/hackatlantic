import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const inventory = JSON.parse(await readFile(new URL("docs/photo-gallery-source-inventory.json", root), "utf8"));
const descriptions = JSON.parse(await readFile(new URL("docs/photo-gallery-descriptions.json", root), "utf8"));
const sourceDirectory = resolve(process.argv[2] ?? ".preview/gallery-originals");
const outputDirectory = new URL("public/gallery/", root);
await mkdir(outputDirectory, { recursive: true });
const photos = [];
const seen = new Set();

for (const [albumIndex, album] of inventory.albums.entries()) {
  for (const source of album.photos) {
    if (seen.has(source.id)) throw new Error(`Duplicate source ID: ${source.id}`);
    seen.add(source.id);
    if (!descriptions[source.id]) throw new Error(`Missing description: ${source.name}`);
    const bytes = await readFile(resolve(sourceDirectory, `${source.id}.jpg`));
    if (bytes.length !== source.sizeBytes) throw new Error(`Incomplete source: ${source.name}`);
    const metadata = await sharp(bytes, { failOn: "warning" }).metadata();
    const swapsAxes = [5, 6, 7, 8].includes(metadata.orientation);
    const width = swapsAxes ? metadata.height : metadata.width;
    const height = swapsAxes ? metadata.width : metadata.height;
    if (!width || !height) throw new Error(`Missing dimensions: ${source.name}`);
    const variants = [];
    for (const [label, resize, quality] of [
      ["400", { width: 400 }, 80],
      ["800", { width: 800 }, 82],
      ["preview", { width: 2000, height: 2000, fit: "inside" }, 86],
    ]) {
      const filename = `${source.id}-${label}.webp`;
      const info = await sharp(bytes, { failOn: "warning" }).rotate()
        .resize({ ...resize, withoutEnlargement: true }).webp({ quality })
        .toFile(new URL(filename, outputDirectory).pathname);
      variants.push({ src: `/gallery/${filename}`, width: info.width, height: info.height, bytes: info.size });
    }
    photos.push({
      id: source.id, album: albumIndex === 0 ? "Saturday" : "Sunday",
      folderId: album.folderId, filename: source.name, sourceUrl: source.sourceUrl,
      sourceSha256: createHash("sha256").update(bytes).digest("hex"),
      width, height, alt: descriptions[source.id],
      thumbnail: variants[0], largeThumbnail: variants[1], preview: variants[2],
    });
    console.log(`Prepared ${photos.length}/${inventory.photoCount}: ${source.name}`);
  }
}
if (photos.length !== inventory.photoCount) throw new Error("Source inventory count mismatch");
await mkdir(new URL("src/app/components/gallery/", root), { recursive: true });
await writeFile(new URL("src/app/components/gallery/photos.json", root), JSON.stringify(photos, null, 2) + "\n");
console.log(`Prepared all ${photos.length} photos (${photos.reduce((n, p) => n + p.thumbnail.bytes + p.largeThumbnail.bytes + p.preview.bytes, 0)} deployed bytes).`);
