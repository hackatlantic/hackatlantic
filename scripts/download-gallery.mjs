import assert from "node:assert/strict";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

// Input: authenticated file references returned by the Drive connector, kept outside Git.
const input = process.argv[2];
if (!input) throw new Error("Usage: node scripts/download-gallery.mjs .preview/gallery-downloads.json");
const downloads = JSON.parse(await readFile(input, "utf8"));
const inventory = JSON.parse(await readFile(new URL("../docs/photo-gallery-source-inventory.json", import.meta.url), "utf8"));
const sources = inventory.albums.flatMap(album => album.photos);
assert.deepEqual(downloads.map(file => file.id).sort(), sources.map(file => file.id).sort(), "Download references must cover the complete inventory");
const sourceMap = new Map(sources.map(file => [file.id, file]));
const output = resolve(".preview/gallery-originals");
await mkdir(output, { recursive: true });
let cursor = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < downloads.length) {
    const item = downloads[cursor++];
    const source = sourceMap.get(item.id);
    assert.match(item.id, /^[a-zA-Z0-9_-]+$/);
    assert.equal(new URL(item.url).protocol, "https:");
    const destination = resolve(output, `${item.id}.jpg`);
    if (await stat(destination).then(file => file.size === source.sizeBytes).catch(() => false)) continue;
    let saved = false;
    for (let attempt = 0; attempt < 3 && !saved; attempt++) {
      try {
        const response = await fetch(item.url, { signal: AbortSignal.timeout(120_000) });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const bytes = Buffer.from(await response.arrayBuffer());
        assert.equal(bytes.length, source.sizeBytes);
        await writeFile(destination, bytes);
        saved = true;
      } catch {
        if (attempt === 2) throw new Error(`Download failed for ${source.name}. Refresh its authenticated Drive reference and retry.`);
      }
    }
    console.log(`Downloaded ${source.name}`);
  }
}));
console.log(`All ${sources.length} originals are available in ${output}.`);
