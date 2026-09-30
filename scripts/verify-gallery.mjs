import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const inventory = JSON.parse(await readFile(new URL("docs/photo-gallery-source-inventory.json", root), "utf8"));
const photos = JSON.parse(await readFile(new URL("src/app/components/gallery/photos.json", root), "utf8"));
const sources = inventory.albums.flatMap(album => album.photos);
assert.equal(new Set(photos.map(p => p.id)).size, photos.length, "Duplicate gallery photo IDs");
assert.deepEqual(photos.map(p => p.id).sort(), sources.map(p => p.id).sort(), "Gallery must include every source photo");
assert.equal(photos.length, inventory.photoCount);
const expectedAssets = [];
for (const photo of photos) {
  assert.ok(photo.alt.trim(), `${photo.filename}: missing alt text`);
  assert.match(photo.sourceSha256, /^[a-f0-9]{64}$/);
  for (const variant of [photo.thumbnail, photo.largeThumbnail, photo.preview]) {
    assert.ok(variant.src.startsWith("/gallery/"));
    expectedAssets.push(variant.src.slice("/gallery/".length));
    const bytes = await readFile(new URL(`public${variant.src}`, root));
    const image = sharp(bytes, { failOn: "warning" });
    const metadata = await image.metadata();
    await image.stats();
    assert.equal(metadata.format, "webp");
    assert.equal(metadata.width, variant.width);
    assert.equal(metadata.height, variant.height);
    assert.equal(bytes.length, variant.bytes);
    assert.ok(variant.width <= photo.width && variant.height <= photo.height);
  }
  assert.ok(Math.max(photo.preview.width, photo.preview.height) <= 2000);
}
assert.deepEqual((await readdir(new URL("public/gallery/", root))).sort(), expectedAssets.sort(), "Unexpected or missing gallery assets");
console.log(`Verified ${photos.length} photos and ${expectedAssets.length} image variants against both complete source folders.`);
