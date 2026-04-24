#!/usr/bin/env node
// DeckForge · Ops state builder
// Writes PROJECT_ROOT/ops-state.json from a read-only inspection of the project.
// Contract: Node ESM, built-in modules only, does not mutate source files, does not parse issues.

import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const PROJECT = { id: "deckforge", name: "DeckForge" };
const SCHEMA_VERSION = 1;
const STALE_AFTER_MINUTES = 1440;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..", "..");
const OUT = join(ROOT, "ops-state.json");

function safeRead(path) { try { return readFileSync(path, "utf8"); } catch { return null; } }
function safeJson(path) { const raw = safeRead(path); if (!raw) return null; try { return JSON.parse(raw); } catch { return null; } }
function safeStat(path) { try { return statSync(path); } catch { return null; } }
function gitLastCommitIso() {
  try {
    return execFileSync("git", ["-C", ROOT, "log", "-1", "--format=%cI"], { stdio: ["ignore", "pipe", "ignore"] }).toString().trim() || null;
  } catch { return null; }
}
function gitBranch() {
  try {
    return execFileSync("git", ["-C", ROOT, "rev-parse", "--abbrev-ref", "HEAD"], { stdio: ["ignore", "pipe", "ignore"] }).toString().trim() || null;
  } catch { return null; }
}
function gitDirty() {
  try {
    return execFileSync("git", ["-C", ROOT, "status", "--porcelain"], { stdio: ["ignore", "pipe", "ignore"] }).toString().trim().length > 0;
  } catch { return null; }
}
function minutesSince(iso) {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return Math.round((Date.now() - t) / 60000);
}
function fileAgeMinutes(path) {
  const s = safeStat(path);
  if (!s) return null;
  return Math.round((Date.now() - s.mtimeMs) / 60000);
}

// ---- collect signals ----
const pkg = safeJson(join(ROOT, "package.json"));
const hasIndex = existsSync(join(ROOT, "index.html"));
const hasIndexBak = existsSync(join(ROOT, "index.html.bak"));
const hasClaudeMd = existsSync(join(ROOT, "CLAUDE.md"));
const hasReadme = existsSync(join(ROOT, "README.md"));
const hasNodeModules = existsSync(join(ROOT, "node_modules"));
const hasDist = existsSync(join(ROOT, "dist"));
const hasGit = existsSync(join(ROOT, ".git"));

const lastCommitIso = gitLastCommitIso();
const branch = gitBranch();
const dirty = gitDirty();

// Freshness: prefer git, fall back to index.html mtime.
let freshness = "unknown";
let ageMin = null;
if (lastCommitIso) {
  ageMin = minutesSince(lastCommitIso);
  freshness = ageMin != null && ageMin <= STALE_AFTER_MINUTES ? "fresh" : "stale";
} else if (!hasGit) {
  freshness = "missing";
} else if (hasIndex) {
  ageMin = fileAgeMinutes(join(ROOT, "index.html"));
  if (ageMin != null) freshness = ageMin <= STALE_AFTER_MINUTES ? "fresh" : "stale";
}

// ---- kpis ----
const kpis = [];
kpis.push({ label: "Version", value: (pkg && pkg.version) || "unversioned", status: pkg && pkg.version ? "ok" : "warn" });
kpis.push({ label: "Branch", value: branch || "unknown", status: branch === "main" ? "ok" : (branch ? "warn" : "unknown") });
kpis.push({ label: "Working tree", value: dirty == null ? "unknown" : (dirty ? "dirty" : "clean"), status: dirty == null ? "unknown" : (dirty ? "warn" : "ok") });
kpis.push({ label: "Entry HTML", value: hasIndex ? "index.html" : "missing", status: hasIndex ? "ok" : "err" });
kpis.push({ label: "Package.json", value: pkg ? "present" : "absent", status: pkg ? "ok" : "warn" });
kpis.push({ label: "Build artifact", value: hasDist ? "dist/" : "none", status: hasDist ? "ok" : "warn" });
kpis.push({ label: "Deps installed", value: hasNodeModules ? "yes" : "no", status: hasNodeModules ? "ok" : "warn" });

// ---- issues (presence signals only, no parsing) ----
const issues = [];
if (hasIndexBak) {
  issues.push({ id: "stray-index-bak", severity: "P3", status: "open", title: "index.html.bak present — consider removing backup", source: "index.html.bak" });
}
if (dirty === true) {
  issues.push({ id: "git-dirty", severity: "P3", status: "open", title: "Working tree has uncommitted changes", source: ".git" });
}
if (!pkg) {
  issues.push({ id: "no-package-json", severity: "P2", status: "open", title: "No package.json — dependency and tooling surface undefined", source: "package.json" });
}

// ---- rollup ----
function rollup(kpisArr, issuesArr) {
  const anyErr = kpisArr.some(k => k.status === "err") || issuesArr.some(i => i.severity === "P0" || i.severity === "P1");
  if (anyErr) return "err";
  const anyWarn = kpisArr.some(k => k.status === "warn") || issuesArr.some(i => i.severity === "P2");
  if (anyWarn) return "warn";
  const anyUnknown = kpisArr.some(k => k.status === "unknown");
  if (anyUnknown) return "unknown";
  return "ok";
}
const status = rollup(kpis, issues);

// ---- recommendations ----
const recommendations = [];
function recommend(priority, title, reason, command = null) {
  recommendations.push({ priority, title, reason, command });
}
if (freshness === "stale") {
  recommend("P2", "Refresh project activity", "Latest activity is outside the freshness window.");
}
if (dirty === true) {
  recommend("P2", "Resolve working tree drift", "Uncommitted changes make dashboard status harder to trust.", "git status --short");
}
if (!hasIndex) {
  recommend("P1", "Restore entry HTML", "index.html is missing, so the project has no clear local entry point.");
}
if (!pkg) {
  recommend("P2", "Define package metadata", "No package.json was found, so dependency and script status are unclear.");
}
if (!hasDist) {
  recommend("P3", "Create or document build output", "No dist directory was found.");
}
if (!hasNodeModules && pkg) {
  recommend("P2", "Install dependencies", "package.json exists but node_modules is missing.", "npm install");
}
if (hasIndexBak) {
  recommend("P3", "Remove stale backup file", "index.html.bak is present and may confuse project status.");
}
if (branch && branch !== "main") {
  recommend("P3", "Review branch state", `Current branch is ${branch}, not main.`);
}

// ---- grouped sections ----
const sections = [
  {
    title: "Project Surface",
    items: kpis.filter((item) => ["Entry HTML", "Package.json", "Version"].includes(item.label)),
  },
  {
    title: "Build",
    items: kpis.filter((item) => ["Build artifact", "Deps installed"].includes(item.label)),
  },
  {
    title: "Git",
    items: kpis.filter((item) => ["Branch", "Working tree"].includes(item.label)),
  },
];

// ---- summary ----
const summaryBits = [];
summaryBits.push(pkg && pkg.version ? `v${pkg.version}` : "no version");
if (branch) summaryBits.push(`branch ${branch}`);
if (dirty != null) summaryBits.push(dirty ? "dirty tree" : "clean tree");
if (issues.length) summaryBits.push(`${issues.length} open issue${issues.length === 1 ? "" : "s"}`);
const summary = summaryBits.join(" · ");

// ---- links ----
const links = [];
if (hasReadme) links.push({ label: "README", path: "README.md" });
if (hasClaudeMd) links.push({ label: "CLAUDE.md", path: "CLAUDE.md" });
if (hasIndex) links.push({ label: "Entry HTML", path: "index.html" });
if (pkg) links.push({ label: "package.json", path: "package.json" });

// ---- assemble ----
const state = {
  project: { id: PROJECT.id, name: PROJECT.name },
  status,
  freshness,
  updatedAt: new Date().toISOString(),
  summary,
  recommendations,
  sections,
  kpis,
  issues,
  links,
  metadata: {
    generator: "tools/ops/build-ops-state.mjs",
    schemaVersion: SCHEMA_VERSION,
    root: relative(process.cwd(), ROOT) || ".",
    lastCommitAt: lastCommitIso,
    lastCommitAgeMinutes: ageMin,
    staleAfterMinutes: STALE_AFTER_MINUTES,
  },
};

try {
  writeFileSync(OUT, JSON.stringify(state, null, 2) + "\n", "utf8");
} catch (err) {
  console.error("[ops] write failed:", err && err.message ? err.message : err);
  process.exit(2);
}

console.log(`[ops] wrote ${OUT}`);
console.log(`[ops] status=${status} freshness=${freshness} kpis=${kpis.length} issues=${issues.length}`);
