export function csvEscape(value) {
  let text = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function parseCsv(text) {
  if (typeof text !== "string") throw new Error("CSV-файл не вдалося прочитати.");

  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === '"' && quoted && text[index + 1] === '"') {
      field += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field);
      field = "";
      if (row.some((item) => item.trim())) rows.push(row);
      row = [];
    } else {
      field += char;
    }
  }

  if (quoted) throw new Error("У CSV є незакриті лапки.");
  row.push(field);
  if (row.some((item) => item.trim())) rows.push(row);

  const headers = (rows.shift() ?? [])
    .map((item) => item.trim().replace(/^\ufeff/, "").toLowerCase());
  const required = ["date", "type", "category", "description", "amount"];
  if (!required.every((item) => headers.includes(item))) {
    throw new Error("Потрібні колонки date, type, category, description та amount.");
  }
  if (new Set(headers).size !== headers.length) {
    throw new Error("Назви колонок CSV не повинні повторюватися.");
  }

  return rows.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() ?? ""])),
  );
}
