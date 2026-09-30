import { mkdir, readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const metadata = JSON.parse(await readFile(new URL("src/app/components/gallery/metadata.json", root), "utf8"));
let html = await readFile(new URL("dist/index.html", root), "utf8");
const escape = value => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
html = html.replace(/<title>[^<]*<\/title>/, `<title>${escape(metadata.title)}</title>`);
html = html.replace(/(<link rel="canonical" href=")[^"]*/, `$1${escape(metadata.canonical)}`);
for (const [name, value] of Object.entries({
  description: metadata.description, "og:url": metadata.canonical,
  "og:title": metadata.title, "twitter:title": metadata.title,
  "og:description": metadata.description, "twitter:description": metadata.description,
})) {
  const pattern = new RegExp(`(<meta (?:name|property)="${name}" content=")[^"]*`);
  if (!pattern.test(html)) throw new Error(`Missing source meta tag: ${name}`);
  html = html.replace(pattern, `$1${escape(value)}`);
}
await mkdir(new URL("dist/photo-gallery/", root), { recursive: true });
await writeFile(new URL("dist/photo-gallery/index.html", root), html);
console.log("Created /photo-gallery HTML with gallery metadata.");
