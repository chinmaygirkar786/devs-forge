import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, posix } from "node:path";

const ROOT = process.cwd();
const NEXT_DIR = join(ROOT, ".next");
const BUILD_ID_PATH = join(NEXT_DIR, "BUILD_ID");
const STATIC_DIR = join(NEXT_DIR, "static");
const OUTPUT_PATH = join(ROOT, "src/lib/precache-manifest.generated.json");

const CORE_PAGES = ["/", "/tools", "/about", "/offline"];
const PWA_PAGES = [
  "/manifest.webmanifest",
  "/pwa/icon-192",
  "/pwa/icon-512",
  "/pwa/icon-512-maskable",
];

function readStringListFromTs(filePath, exportName) {
  const content = readFileSync(filePath, "utf8");
  const pattern = new RegExp(
    `export const ${exportName} = \\[([\\s\\S]*?)\\] as const`,
  );
  const match = content.match(pattern);

  if (!match) {
    throw new Error(`Could not parse ${exportName} from ${filePath}`);
  }

  return [...match[1].matchAll(/"([^"]+)"/g)].map((entry) => entry[1]);
}

function readCategoryKeysFromTs(filePath) {
  const content = readFileSync(filePath, "utf8");
  const match = content.match(/export const toolCategories[^=]*=\s*\{([\s\S]*?)\};/);

  if (!match) {
    throw new Error(`Could not parse toolCategories from ${filePath}`);
  }

  return [...match[1].matchAll(/^\s*([a-z]+):\s*\{/gm)].map((entry) => entry[1]);
}

function walkStaticFiles(directory, files = []) {
  if (!existsSync(directory)) {
    return files;
  }

  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      walkStaticFiles(fullPath, files);
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

function buildPageUrls() {
  const toolSlugs = readStringListFromTs(join(ROOT, "src/tools/slugs.ts"), "toolSlugList");
  const categoryKeys = readCategoryKeysFromTs(join(ROOT, "src/tools/categories.ts"));

  return [
    ...CORE_PAGES,
    ...toolSlugs.map((slug) => `/tools/${slug}`),
    ...categoryKeys.map((category) => `/tools/category/${category}`),
    ...PWA_PAGES,
  ];
}

function buildAssetUrls() {
  return walkStaticFiles(STATIC_DIR).map((filePath) => {
    const relativePath = posix.join(
      "/_next/static",
      filePath.slice(STATIC_DIR.length + 1).split("\\").join("/"),
    );
    return relativePath;
  });
}

function main() {
  if (!existsSync(BUILD_ID_PATH)) {
    console.error("generate-precache-manifest: .next/BUILD_ID not found. Run next build first.");
    process.exit(1);
  }

  const version = readFileSync(BUILD_ID_PATH, "utf8").trim();
  const pages = buildPageUrls();
  const assets = buildAssetUrls();

  const manifest = {
    version,
    pages,
    assets,
  };

  writeFileSync(OUTPUT_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log(
    `generate-precache-manifest: wrote ${pages.length} pages and ${assets.length} assets (version ${version})`,
  );
}

main();
