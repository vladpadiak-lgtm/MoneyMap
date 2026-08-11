import assert from "node:assert/strict";
import test from "node:test";

import { csvEscape, parseCsv } from "../pages-csv.js";

test("parses quoted CSV fields, commas, and multiline notes", () => {
  const [row] = parseCsv(
    'date,type,category,description,amount,note\n2026-08-10,expense,Продукти,"Кава, десерт",12.50,"рядок 1\nрядок 2"',
  );
  assert.equal(row.description, "Кава, десерт");
  assert.equal(row.note, "рядок 1\nрядок 2");
});

test("rejects empty files and unterminated quoted fields", () => {
  assert.throws(() => parseCsv(""), /Потрібні колонки/);
  assert.throws(
    () => parseCsv('date,type,category,description,amount\n2026-08-10,expense,Продукти,"Кава,12.50'),
    /незакриті лапки/,
  );
});

test("protects spreadsheet exports from formula execution", () => {
  assert.equal(csvEscape("=HYPERLINK(\"bad\")"), '"\'=HYPERLINK(""bad"")"');
  assert.equal(csvEscape("Звичайний текст"), "Звичайний текст");
});
