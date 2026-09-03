import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const canonical = "https://www.hackatlantic.ca/";
const title = "Hack Atlantic | Atlantic Canada's Student Hackathon";

// Check both source and the static files sent to Vercel. Run the build first.
for (const directory of ["", "dist"]) {
  describe(directory ? "built SEO files" : "source SEO files", () => {
    const html = readFileSync(resolve(root, directory, "index.html"), "utf8");
    const publicRoot = resolve(root, directory || "public");
    const meta = (name) => {
      const matches = [...html.matchAll(new RegExp(`<meta\\s+(?:name|property)="${name}"\\s+content="([^"]*)"\\s*/?>`, "g"))];
      assert.equal(matches.length, 1, `Expected one ${name} meta tag`);
      return matches[0][1];
    };

    it("includes a descriptive title and one canonical URL in the HTML head", () => {
      assert.equal([...html.matchAll(/<title>/g)].length, 1);
      assert.equal([...html.matchAll(/<head>/g)].length, 1);
      assert.equal([...html.matchAll(/<body>/g)].length, 1);
      assert.ok(html.includes(`<title>${title}</title>`));
      assert.equal([...html.matchAll(/rel="canonical"/g)].length, 1);
      assert.ok(html.includes(`rel="canonical" href="${canonical}"`));
      assert.ok(html.indexOf('rel="canonical"') < html.indexOf("</head>"));
      assert.ok(meta("description").includes("student-run hackathon in Atlantic Canada"));
      assert.ok(html.includes('rel="icon" type="image/png" href="/favicon.png"'));
      assert.ok(html.includes('rel="apple-touch-icon" href="/favicon.png"'));
      assert.ok(existsSync(resolve(publicRoot, "favicon.png")));
      assert.doesNotMatch(html, /noindex|name="keywords"|pk_live_|sk_live_/i);
    });

    it("uses consistent social titles, descriptions and a real public image", () => {
      assert.equal(meta("og:type"), "website");
      assert.equal(meta("og:site_name"), "Hack Atlantic");
      assert.equal(meta("og:url"), canonical);
      assert.equal(meta("og:title"), title);
      assert.equal(meta("twitter:title"), title);
      assert.equal(meta("og:description"), meta("description"));
      assert.equal(meta("twitter:description"), meta("description"));
      assert.equal(meta("twitter:card"), "summary_large_image");
      const image = new URL(meta("og:image"));
      assert.equal(image.origin, new URL(canonical).origin);
      assert.equal(meta("twitter:image"), image.href);
      assert.ok(existsSync(resolve(publicRoot, "." + image.pathname)));
      assert.ok(meta("og:image:alt").length > 0);
      assert.equal(meta("twitter:image:alt"), meta("og:image:alt"));
    });

    it("identifies both brand spellings using valid linked JSON-LD", () => {
      const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      assert.equal(scripts.length, 1);
      const data = JSON.parse(scripts[0][1]);
      assert.equal(data["@context"], "https://schema.org");
      assert.equal(data["@graph"].length, 2);
      const website = data["@graph"].find((entry) => entry["@type"] === "WebSite");
      const organization = data["@graph"].find((entry) => entry["@type"] === "Organization");
      for (const entity of [website, organization]) {
        assert.equal(entity.name, "Hack Atlantic");
        assert.equal(entity.alternateName, "HackAtlantic");
        assert.equal(entity.url, canonical);
      }
      assert.equal(website.publisher["@id"], organization["@id"]);
      assert.equal(organization.sameAs.length, 2);
      assert.ok(html.indexOf('type="application/ld+json"') < html.indexOf("</head>"));
    });

    it("publishes crawler files pointing only at the canonical homepage", () => {
      const robots = readFileSync(resolve(publicRoot, "robots.txt"), "utf8");
      assert.match(robots, /^User-agent: \*$/m);
      assert.match(robots, /^Allow: \/$/m);
      assert.ok(robots.includes(`Sitemap: ${canonical}sitemap.xml`));
      assert.doesNotMatch(robots, /^Disallow: \/\s*$/m);
      const sitemap = readFileSync(resolve(publicRoot, "sitemap.xml"), "utf8");
      assert.match(sitemap, /xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"/);
      assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]), [canonical]);
      assert.doesNotMatch(sitemap, /localhost|vercel\.app|<lastmod>/);
    });
  });
}
