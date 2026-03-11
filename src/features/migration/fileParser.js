/**
 * Unified file parser for CSV and Excel (.xlsx) import.
 * Returns a consistent shape: { headers, rows, raw } for downstream mapping/validation.
 */

import ExcelJS from 'exceljs';
import { parseCSVFile } from './csvParser';

const EXCEL_EXTENSIONS = /\.xlsx$/i;
const CSV_EXTENSION = /\.csv$/i;

/**
 * Convert a cell value to string for consistency with CSV (where all values are strings).
 * @param {*} value
 * @returns {string}
 */
function cellToString(value) {
  if (value == null || value === '') return '';
  if (typeof value === 'object' && value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value).trim();
}

/**
 * Normalize ExcelJS cell values into plain stringifiable values.
 * @param {*} value
 * @returns {*}
 */
function normalizeExcelValue(value) {
  if (value == null) return '';
  if (value instanceof Date) return value;
  if (typeof value !== 'object') return value;

  if ('result' in value && value.result != null) {
    return normalizeExcelValue(value.result);
  }
  if ('text' in value && typeof value.text === 'string') {
    return value.text;
  }
  if (Array.isArray(value.richText)) {
    return value.richText.map((part) => part?.text ?? '').join('');
  }
  if ('hyperlink' in value) {
    return value.text || value.hyperlink || '';
  }
  return '';
}

/**
 * Convert an ExcelJS worksheet into a normalized sheet payload.
 * @param {import('exceljs').Worksheet} worksheet
 * @param {string} [sheetName]
 * @returns {{ sheetName?: string; headers: string[]; rows: Record<string, string>[]; raw: string[][] }}
 */
function worksheetToPayload(worksheet, sheetName) {
  const headerValues = worksheet.getRow(1).values || [];
  const headers = headerValues
    .slice(1)
    .map((v) => cellToString(normalizeExcelValue(v)));

  if (headers.length === 0) {
    return sheetName
      ? { sheetName, headers: [], rows: [], raw: [] }
      : { headers: [], rows: [], raw: [] };
  }

  const rows = [];
  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);
    const out = {};
    let hasAnyValue = false;

    headers.forEach((header, index) => {
      const value = cellToString(
        normalizeExcelValue(row.getCell(index + 1).value)
      );
      out[header] = value;
      if (value !== '') hasAnyValue = true;
    });

    if (hasAnyValue) rows.push(out);
  }

  const raw = rows.map((row) => headers.map((h) => row[h] ?? ''));
  return sheetName ? { sheetName, headers, rows, raw } : { headers, rows, raw };
}

/**
 * Parse an Excel file (.xlsx) and return headers + rows.
 * Uses the first worksheet and normalizes all values to strings.
 * @param {File} file - Excel file from input
 * @returns {Promise<{ headers: string[]; rows: Record<string, string>[]; raw: string[][] }>}
 */
export function parseExcelFile(file) {
  return file.arrayBuffer().then(async (buffer) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      throw new Error('Excel file has no worksheets');
    }
    return worksheetToPayload(worksheet);
  });
}

/**
 * Parse all sheets from an Excel workbook.
 * @param {File} file - Excel file from input
 * @returns {Promise<{ sheets: { sheetName: string; headers: string[]; rows: Record<string, string>[]; raw: string[][] }[] }>}
 */
export function parseExcelWorkbook(file) {
  return file.arrayBuffer().then(async (buffer) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheets = workbook.worksheets || [];
    if (worksheets.length === 0) {
      throw new Error('Excel file has no worksheets');
    }

    const sheets = worksheets.map((worksheet) => {
      return worksheetToPayload(worksheet, worksheet.name);
    });

    return { sheets };
  });
}

/**
 * Parse a file (CSV or Excel) and return headers + rows.
 * Detects format by file extension.
 * @param {File} file - File from input
 * @returns {Promise<{ headers: string[]; rows: Record<string, string>[]; raw: string[][] }>}
 */
export async function parseImportFile(file) {
  const name = file.name || '';
  if (EXCEL_EXTENSIONS.test(name)) {
    return parseExcelFile(file);
  }
  if (CSV_EXTENSION.test(name)) {
    return parseCSVFile(file);
  }
  throw new Error('Unsupported file type. Use .csv or .xlsx');
}
