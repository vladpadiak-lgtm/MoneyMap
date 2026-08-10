import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html", host: "localhost" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
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
