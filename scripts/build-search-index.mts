/**
 * Build the Pagefind static search index from frontmatter + MDX bodies.
 *
 * Why custom records rather than indexing HTML output: Next.js App Router
 * doesn't write static HTML to disk by default (build artifacts in
 * `.next/` are compiled JS, not crawlable HTML). Feeding Pagefind the
 * content directly avoids needing `output: 'export'`, which would
 * conflict with future server actions (newsletter signup in Phase 4).
 *
 * The output lands in `public/pagefind/` so Next.js serves it as a
 * static asset — `/pagefind/pagefind.js` becomes available at runtime to
 * the /search page.
 *
 * Implementation note: this script reads MDX files directly and parses
 * frontmatter, rather than importing lib/content.ts, because tsx's ESM
 * resolution of cross-module TypeScript imports is brittle. The
 * frontmatter shape is duplicated here as a small price for build
 * reliability.
 */

import * as pagefind from "pagefind";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

interface FrontmatterShape {
  title: string;
  slug: string;
  audience: string;
  type: string;
  topics: string[];
  description: string;
  dek?: string | null;
}

const CONTENT_ROOT = path.join(process.cwd(), "content");

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_") || entry.name === "taxonomy") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
      out.push(full);
    }
  }
  return out;
}

async function main(): Promise<void> {
  const files = walk(CONTENT_ROOT);
  console.log(`[search] indexing ${files.length} record(s)`);

  const { errors: createErrors, index } = await pagefind.createIndex({
    forceLanguage: "en",
    keepIndexUrl: false,
  });
  if (createErrors.length > 0 || !index) {
    console.error("[search] failed to create index", createErrors);
    process.exit(1);
  }

  let added = 0;
  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8");
    const { data, content: body } = matter(raw);
    const fm = data as FrontmatterShape;

    // Strip MDX expressions and component tags from the indexed content
    // — Pagefind ranks tokens, and template syntax pollutes the index.
    const content = body
      .replace(/<\/?[A-Z][^>]*>/g, " ") // strip MDX components
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ") // strip MDX comments
      .replace(/\s+/g, " ")
      .trim();

    const fullText = [
      fm.title,
      fm.dek ?? "",
      fm.description,
      content,
    ].join("\n\n");

    const result = await index.addCustomRecord({
      url: `/${fm.type}/${fm.slug}`,
      content: fullText,
      language: "en",
      meta: {
        title: fm.title,
        description: fm.dek ?? fm.description,
        type: fm.type,
        audience: fm.audience,
      },
      filters: {
        audience: [fm.audience],
        type: [fm.type],
        topic: fm.topics,
      },
    });
    if (result.errors.length > 0) {
      console.warn(`[search] errors indexing ${fm.slug}:`, result.errors);
      continue;
    }
    added++;
  }

  const writeResult = await index.writeFiles({
    outputPath: "public/pagefind",
  });
  if (writeResult.errors.length > 0) {
    console.error("[search] failed to write index", writeResult.errors);
    process.exit(1);
  }

  await pagefind.close();
  console.log(`[search] wrote ${added} record(s) → ${writeResult.outputPath}`);
}

main().catch((err) => {
  console.error("[search] indexing failed:", err);
  process.exit(1);
});
