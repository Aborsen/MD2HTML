/**
 * Formats a Date object to a string based on the provided format.
 * Supports dd (day), MM (month), yyyy (year) placeholders.
 */
export function formatDateToString(date: Date, format: string): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();

  return format.replace('dd', day).replace('MM', month).replace('yyyy', year);
}

/**
 * Extracts the separator character(s) from the format (e.g. "/" from "dd/MM/yyyy").
 */
function getFormatSeparator(format: string): string {
  const match = format.match(/[^dMy]/);
  return match ? match[0] : '/';
}

/**
 * Parses a date string back to a Date object based on the provided format.
 * Returns null if the string doesn't match the format or represents an invalid date.
 */
export function parseStringToDate(value: string, format: string): Date | null {
  const separator = getFormatSeparator(format);
  const parts = value.split(separator);

  if (parts.length !== 3) {
    return null;
  }

  const dayPos = format.split(separator).indexOf('dd');
  const monthPos = format.split(separator).indexOf('MM');
  const yearPos = format.split(separator).indexOf('yyyy');

  if (dayPos === -1 || monthPos === -1 || yearPos === -1) {
    return null;
  }

  const dayStr = parts[dayPos];
  const monthStr = parts[monthPos];
  const yearStr = parts[yearPos];
  if (dayStr === undefined || monthStr === undefined || yearStr === undefined) {
    return null;
  }

  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const year = parseInt(yearStr, 10);

  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) {
    return null;
  }

  const date = new Date(year, month, day);
  if (
    date.getDate() === day &&
    date.getMonth() === month &&
    date.getFullYear() === year
  ) {
    return date;
  }

  return null;
}
