import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
let workerPromise;

function loadWorker() {
  if (!workerPromise) {
    const workerUrl = new URL("../dist/server/index.js", import.meta.url);
    workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
    workerPromise = import(workerUrl.href).then(({ default: worker }) => worker);
  }
  return workerPromise;
}

async function workerFetch(pathname, headers = {}) {
  const worker = await loadWorker();
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { host: "localhost", ...headers } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

async function render(pathname = "/") {
  return workerFetch(pathname, { accept: "text/html" });
}

test("server-renders the MoneyMap landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /MoneyMap/);
  assert.match(html, /Гроші під контролем/);
  assert.match(html, /Створити свій MoneyMap/);
  assert.match(html, /Переглянути демо/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/);
});

test("ships the social card and removes the disposable starter preview", async () => {
  const [layout, packageJson] = await Promise.all([
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
  ]);
  await access(new URL("public/og.png", root));
  await assert.rejects(access(new URL("app/_sites-preview/SkeletonPreview.tsx", root)));
  assert.match(layout, /\/og\.png/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});

test("protects private pages and APIs for anonymous visitors", async () => {
  const protectedPage = await readFile(
    new URL("app/components/protected-finance-page.tsx", root),
    "utf8",
  );
  const apiRoutes = await Promise.all(
    [
      "app/api/bootstrap/route.ts",
      "app/api/budgets/route.ts",
      "app/api/goals/route.ts",
      "app/api/goals/[id]/route.ts",
      "app/api/transactions/route.ts",
      "app/api/transactions/[id]/route.ts",
      "app/api/transactions/import/route.ts",
    ].map((path) => readFile(new URL(path, root), "utf8")),
  );

  assert.match(protectedPage, /requireChatGPTUser\(returnTo\)/);
  for (const route of apiRoutes) {
    assert.match(route, /requireApiUser\(\)/);
    assert.match(route, /unauthorized\(\)/);
  }
});

test("keeps the GitHub Pages edition accessible and free of system prompts", async () => {
  const [html, script, styles] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("pages.js", root), "utf8"),
    readFile(new URL("pages.css", root), "utf8"),
  ]);
  assert.match(html, /<noscript>/);
  assert.match(html, /pages\.js\?v=4/);
  assert.doesNotMatch(script, /window\.prompt|prompt\(/);
  assert.match(script, /AUTH_SESSION_KEY/);
  assert.match(script, /state=emptyState\(\)/);
  assert.match(script, /state=clone\(DEMO_STATE\)/);
  assert.match(styles, /\.pages-static \.table-body \.transaction-row/);
});
