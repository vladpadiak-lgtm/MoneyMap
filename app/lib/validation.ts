export const MAX_MONEY_CENTS = 99_999_999_999;

export function isPositiveMoney(value: number) {
  return Number.isSafeInteger(value) && value > 0 && value <= MAX_MONEY_CENTS;
}

export function isNonNegativeMoney(value: number) {
  return Number.isSafeInteger(value) && value >= 0 && value <= MAX_MONEY_CENTS;
}

export function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function isYearMonth(value: string) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

export function isTextWithin(value: string, maxLength: number) {
  return value.length > 0 && value.length <= maxLength;
}

export function isOptionalTextWithin(value: string, maxLength: number) {
  return value.length <= maxLength;
}

export function isHexColor(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value);
}
