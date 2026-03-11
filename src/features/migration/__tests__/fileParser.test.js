import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseImportFile, parseExcelFile, parseExcelWorkbook } from '../fileParser';

const mockLoad = vi.fn();
let mockWorksheets = [];

vi.mock('exceljs', () => ({
  default: {
    Workbook: function MockWorkbook() {
      this.xlsx = {
        load: (...args) => mockLoad(...args),
      };
      Object.defineProperty(this, 'worksheets', {
        get() {
          return mockWorksheets;
        },
      });
    },
  },
}));

function createWorksheet(name, rows) {
  return {
    name,
    rowCount: rows.length,
    getRow: (rowNumber) => {
      const rowValues = rows[rowNumber - 1] || [];
      return {
        values: [undefined, ...rowValues],
        getCell: (index) => ({ value: rowValues[index - 1] ?? null }),
      };
    },
  };
}

/** Create a file-like object with arrayBuffer for tests (jsdom File may not have arrayBuffer) */
function createFileWithArrayBuffer(name) {
  const file = Object.create(File.prototype);
  Object.defineProperty(file, 'name', { value: name });
  Object.defineProperty(file, 'arrayBuffer', {
    value: () => Promise.resolve(new ArrayBuffer(8)),
  });
  return file;
}

describe('fileParser', () => {
  describe('parseExcelFile', () => {
    beforeEach(() => {
      mockLoad.mockReset();
      mockLoad.mockResolvedValue(undefined);
      mockWorksheets = [];
    });

    it('parses Excel and returns headers and rows', async () => {
      mockWorksheets = [
        createWorksheet('Sheet1', [
          ['name', 'address'],
          ['Store A', '123 Main'],
          ['Store B', '456 Oak'],
        ]),
      ];

      const file = createFileWithArrayBuffer('test.xlsx');
      const result = await parseExcelFile(file);
      expect(result.headers).toEqual(['name', 'address']);
      expect(result.rows).toHaveLength(2);
      expect(result.rows[0]).toEqual({ name: 'Store A', address: '123 Main' });
      expect(result.rows[1]).toEqual({ name: 'Store B', address: '456 Oak' });
    });

    it('normalizes numbers and dates to strings', async () => {
      mockWorksheets = [
        createWorksheet('Sheet1', [
          ['name', 'price', 'qty', 'date'],
          ['Item', 9.99, 5, new Date('2024-01-15')],
        ]),
      ];

      const file = createFileWithArrayBuffer('test.xlsx');
      const result = await parseExcelFile(file);
      expect(result.rows[0].name).toBe('Item');
      expect(result.rows[0].price).toBe('9.99');
      expect(result.rows[0].qty).toBe('5');
      expect(result.rows[0].date).toBe('2024-01-15');
    });

    it('returns empty structure for empty sheet', async () => {
      mockWorksheets = [createWorksheet('Sheet1', [])];

      const file = createFileWithArrayBuffer('test.xlsx');
      const result = await parseExcelFile(file);
      expect(result.headers).toEqual([]);
      expect(result.rows).toEqual([]);
      expect(result.raw).toEqual([]);
    });
  });

  describe('parseImportFile', () => {
    beforeEach(() => {
      mockLoad.mockReset();
      mockLoad.mockResolvedValue(undefined);
      mockWorksheets = [
        createWorksheet('Sheet1', [
          ['name'],
          ['X'],
        ]),
      ];
    });

    it('routes .csv to CSV parser', async () => {
      const csv = 'name,address\nStore A,123 Main';
      const file = new File([csv], 'test.csv', { type: 'text/csv' });
      const result = await parseImportFile(file);
      expect(result.headers).toEqual(['name', 'address']);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].name).toBe('Store A');
    });

    it('routes .xlsx to Excel parser', async () => {
      const file = createFileWithArrayBuffer('test.xlsx');
      const result = await parseImportFile(file);
      expect(result.headers).toEqual(['name']);
      expect(result.rows[0].name).toBe('X');
    });

    it('rejects .xls files', async () => {
      const file = createFileWithArrayBuffer('data.xls');
      await expect(parseImportFile(file)).rejects.toThrow('Unsupported file type');
    });

    it('throws for unsupported extension', async () => {
      const file = new File([''], 'data.txt', { type: 'text/plain' });
      await expect(parseImportFile(file)).rejects.toThrow('Unsupported file type');
    });
  });

  describe('parseExcelWorkbook', () => {
    beforeEach(() => {
      mockLoad.mockReset();
      mockLoad.mockResolvedValue(undefined);
      mockWorksheets = [];
    });

    it('returns sheets array with sheetName, headers, rows, raw', async () => {
      mockWorksheets = [
        createWorksheet('Sheet1', [
          ['name', 'address'],
          ['Store A', '123 Main'],
        ]),
      ];

      const file = createFileWithArrayBuffer('workbook.xlsx');
      const result = await parseExcelWorkbook(file);
      expect(result.sheets).toBeDefined();
      expect(result.sheets).toHaveLength(1);
      expect(result.sheets[0].sheetName).toBe('Sheet1');
      expect(result.sheets[0].headers).toEqual(['name', 'address']);
      expect(result.sheets[0].rows).toHaveLength(1);
      expect(result.sheets[0].rows[0]).toEqual({ name: 'Store A', address: '123 Main' });
    });

    it('parses multiple sheets', async () => {
      mockWorksheets = [
        createWorksheet('Stores', [
          ['name'],
          ['Store A'],
        ]),
        createWorksheet('Products', [
          ['name', 'price'],
          ['Widget', 10],
        ]),
      ];

      const file = createFileWithArrayBuffer('workbook.xlsx');
      const result = await parseExcelWorkbook(file);
      expect(result.sheets).toHaveLength(2);
      expect(result.sheets[0].sheetName).toBe('Stores');
      expect(result.sheets[0].headers).toContain('name');
      expect(result.sheets[1].sheetName).toBe('Products');
      expect(result.sheets[1].rows[0].name).toBe('Widget');
    });

    it('includes empty sheets with empty arrays', async () => {
      mockWorksheets = [createWorksheet('Sheet1', [])];

      const file = createFileWithArrayBuffer('workbook.xlsx');
      const result = await parseExcelWorkbook(file);
      expect(result.sheets[0].headers).toEqual([]);
      expect(result.sheets[0].rows).toEqual([]);
      expect(result.sheets[0].raw).toEqual([]);
    });

    it('throws when workbook has no worksheets', async () => {
      mockWorksheets = [];

      const file = createFileWithArrayBuffer('empty.xlsx');
      await expect(parseExcelWorkbook(file)).rejects.toThrow('no worksheets');
    });
  });
});
