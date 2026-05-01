#!/usr/bin/env node

/**
 * validate-docs-frontmatter.mjs
 *
 * Validates frontmatter structure and content for all markdown files under docs/.
 * Uses js-yaml for reliable YAML parsing instead of bash string manipulation.
 *
 * All checks are defined by docs/standards/documentation.md.
 *
 * Checks per file:
 *   - File is not empty
 *   - Frontmatter is present and parseable
 *   - All required fields exist: title, doc_type, status, owners,
 *     last_reviewed, related, tags
 *   - doc_type is a valid value and matches the file's folder
 *   - status is a valid value
 *   - owners contains at least one GitHub handle
 *   - last_reviewed is a valid YYYY-MM-DD date
 *   - related is an array (may be empty)
 *   - ADR related field only references other ADRs
 *   - tags is an array (may be empty), from approved vocabulary, max 6
 *   - title matches the document's H1 heading
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, dirname, relative } from "path";
import { load as parseYaml } from "js-yaml";

// ── Vocabularies ──────────────────────────────────────────────────────────────

const VALID_DOC_TYPES = new Set([
  "adr",
  "architecture",
  "agent",
  "process",
  "standard",
  "technology",
  "onboarding",
]);

const VALID_STATUSES = new Set([
  "proposed",
  "draft",
  "accepted",
  "deprecated",
  "superseded",
]);

const VALID_TAGS = new Set([
  "documentation",
  "standards",
  "formatting",
  "linting",
  "workflow",
  "git",
  "ci-cd",
  "testing",
  "security",
  "ai-agent",
  "ai-readiness",
  "architecture",
  "onboarding",
  "process",
  "tooling",
  "maintenance",
  "governance",
]);

// Maps docs/ subfolder name → expected doc_type value
const FOLDER_TO_DOC_TYPE = {
  adrs: "adr",
  architecture: "architecture",
  agents: "agent",
  process: "process",
  standards: "standard",
  technologies: "technology",
  onboarding: "onboarding",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Recursively collect all .md files under a directory */
function collectMarkdownFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectMarkdownFiles(full));
    } else if (entry.endsWith(".md")) {
      results.push(full);
    }
  }
  return results.sort();
}

/**
 * Parse frontmatter from a markdown file.
 * Returns { frontmatter, body } where frontmatter is a parsed object.
 * Throws if frontmatter is missing or unparseable.
 */
function parseFrontmatter(content) {
  if (!content.startsWith("---")) {
    throw new Error("Missing opening frontmatter delimiter");
  }

  const closingIndex = content.indexOf("\n---", 3);
  if (closingIndex === -1) {
    throw new Error("Missing closing frontmatter delimiter");
  }

  const yamlBlock = content.slice(3, closingIndex).trim();
  const body = content.slice(closingIndex + 4).trim();

  let frontmatter;
  try {
    frontmatter = parseYaml(yamlBlock);
  } catch (err) {
    throw new Error(`Invalid YAML in frontmatter: ${err.message}`);
  }

  if (!frontmatter || typeof frontmatter !== "object") {
    throw new Error("Frontmatter parsed to an empty or non-object value");
  }

  return { frontmatter, body };
}

/** Extract the first H1 heading from the document body */
function extractH1(body) {
  const match = body.match(/^# (.+)$/m);
  return match ? match[1].trim() : null;
}

// ── Validation ────────────────────────────────────────────────────────────────

function validateFile(filePath) {
  const errors = [];

  const content = readFileSync(filePath, "utf8");

  if (!content.trim()) {
    errors.push("File is empty");
    return errors; // nothing else to check
  }

  let frontmatter, body;
  try {
    ({ frontmatter, body } = parseFrontmatter(content, filePath));
  } catch (err) {
    errors.push(err.message);
    return errors; // can't continue without parseable frontmatter
  }

  const REQUIRED_FIELDS = [
    "title",
    "doc_type",
    "status",
    "owners",
    "last_reviewed",
    "related",
    "tags",
  ];
  for (const field of REQUIRED_FIELDS) {
    if (frontmatter[field] === undefined || frontmatter[field] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Stop here if required fields are missing — further checks would be noisy
  if (errors.length > 0) return errors;

  // doc_type: valid value
  if (!VALID_DOC_TYPES.has(frontmatter.doc_type)) {
    errors.push(
      `Invalid doc_type '${frontmatter.doc_type}'. Must be one of: ${[...VALID_DOC_TYPES].join(", ")}`
    );
  }

  // doc_type: must match folder
  const folder = relative("docs", dirname(filePath)).split("/")[0];
  const expectedType = FOLDER_TO_DOC_TYPE[folder];
  if (expectedType && frontmatter.doc_type !== expectedType) {
    errors.push(
      `doc_type '${frontmatter.doc_type}' does not match expected '${expectedType}' for docs/${folder}/`
    );
  }

  // status: valid value
  if (!VALID_STATUSES.has(frontmatter.status)) {
    errors.push(
      `Invalid status '${frontmatter.status}'. Must be one of: ${[...VALID_STATUSES].join(", ")}`
    );
  }

  // owners: at least one GitHub handle
  const owners = Array.isArray(frontmatter.owners)
    ? frontmatter.owners
    : [frontmatter.owners];
  const hasHandle = owners.some(
    (o) => typeof o === "string" && o.includes("@")
  );
  if (!hasHandle) {
    errors.push("owners must contain at least one GitHub handle (e.g. @username)");
  }

  // last_reviewed: YYYY-MM-DD
  // js-yaml parses unquoted ISO dates (e.g. 2026-01-01) as Date objects.
  // Normalise back to a string before pattern-checking.
  const lastReviewedStr =
    frontmatter.last_reviewed instanceof Date
      ? frontmatter.last_reviewed.toISOString().slice(0, 10)
      : String(frontmatter.last_reviewed);
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(lastReviewedStr)) {
    errors.push(
      `last_reviewed must be in YYYY-MM-DD format, got '${frontmatter.last_reviewed}'`
    );
  }

  // tags: must be an array (can be empty), approved vocabulary, max 6
  if (!Array.isArray(frontmatter.tags)) {
    errors.push("tags must be an array (use [] for empty)");
  }
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];
  if (tags.length > 6) {
    errors.push(`Too many tags (${tags.length}, max 6)`);
  }
  for (const tag of tags) {
    if (!VALID_TAGS.has(tag)) {
      errors.push(
        `Invalid tag '${tag}'. Must be one of: ${[...VALID_TAGS].join(", ")}`
      );
    }
  }

  // title: must match H1 heading
  const h1 = extractH1(body);
  if (!h1) {
    errors.push("No H1 heading found in document body");
  } else if (frontmatter.title !== h1) {
    errors.push(
      `title '${frontmatter.title}' does not match H1 heading '${h1}'`
    );
  }

  // related: must be an array (can be empty)
  if (!Array.isArray(frontmatter.related)) {
    errors.push("related must be an array (use [] for empty)");
  }

  // ADR-specific: related entries must only reference other ADRs
  if (frontmatter.doc_type === "adr" && Array.isArray(frontmatter.related)) {
    for (const ref of frontmatter.related) {
      if (typeof ref === "string" && ref.startsWith("docs/") && !ref.startsWith("docs/adrs/")) {
        errors.push(
          `ADR related field must only reference other ADRs, got '${ref}'`
        );
      }
    }
  }

  return errors;
}

// ── Main ──────────────────────────────────────────────────────────────────────

const docsDir = "docs";
const files = collectMarkdownFiles(docsDir);

if (files.length === 0) {
  console.error("No markdown files found under docs/");
  process.exit(1);
}

let failed = false;

for (const file of files) {
  const errors = validateFile(file);
  if (errors.length > 0) {
    failed = true;
    for (const err of errors) {
      console.error(`❌ ${file}: ${err}`);
    }
  } else {
    console.log(`✓ ${file}`);
  }
}

if (failed) {
  console.error("\nDoc validation failed.");
  process.exit(1);
} else {
  console.log("\nAll docs passed validation.");
}
