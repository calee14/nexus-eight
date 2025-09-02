// components/SmartTable.tsx
import React, { useState } from 'react';
import { isSmartCell, SmartCell, SmartColumn, SmartRow } from '@/types';

interface SmartTableProps {
  data: SmartRow[];
  columns: SmartColumn | undefined;
}

const SmartTable = ({ data, columns }: SmartTableProps) => {
  const [selectedCell, setSelectedCell] = useState<{ row: number, col: number } | null>(null);

  if (!columns) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-800">No columns defined</p>
      </div>
    );
  }

  // Convert column letters (A, B, C, etc.)
  const getColumnLetter = (index: number): string => {
    let result = '';
    while (index >= 0) {
      result = String.fromCharCode(65 + (index % 26)) + result;
      index = Math.floor(index / 26) - 1;
    }
    return result;
  };

  const renderCellValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return '';
    }

    if (isSmartCell(value)) {
      const cell = value as SmartCell;
      return cell?.at(0)?.at(1);
    } else if (Array.isArray(value)) {
      // Handle nested arrays
      if (value.length === 0) return '';

      if (Array.isArray(value[0])) {
        // For arrays like [['2023', 1.5], ['2024', 1.2]]
        return value.map((item: any[], idx: number) => (
          <div key={idx} className="text-xs leading-tight">
            {item[0]}: {item[1]}
          </div>
        ));
      }

      return value.join(', ');
    }

    if (typeof value === 'number') {
      return value.toLocaleString();
    }

    return String(value);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      {/* Excel-style toolbar */}
      <div className="bg-gray-100 border-b border-gray-300 px-4 py-2 text-sm text-gray-600">
        <span className="font-medium">SmartTable</span>
        <span className="ml-4 text-xs">{data.length} rows × {columns.headers.length} columns</span>
      </div>

      <div className="overflow-auto max-h-96">
        <table className="w-full border-collapse">
          {/* Column headers with letters */}
          <thead>
            {/* Letter row (A, B, C, etc.) */}
            <tr className="bg-gray-200 border-b border-gray-400">
              <th className="w-12 h-8 border-r border-gray-400 bg-gray-300 text-xs font-medium text-gray-600"></th>
              {columns.headers.map((_, index) => (
                <th
                  key={index}
                  className="min-w-24 h-8 border-r border-gray-400 bg-gray-200 text-xs font-medium text-gray-600 px-2"
                >
                  {getColumnLetter(index)}
                </th>
              ))}
            </tr>

            {/* Header labels row */}
            <tr className="bg-gray-100 border-b border-gray-400">
              <th className="w-12 h-10 border-r border-gray-400 bg-gray-300 text-xs font-medium text-gray-600">
                #
              </th>
              {columns.headers.map((header, index) => (
                <th
                  key={index}
                  className="min-w-24 h-10 border-r border-gray-400 bg-gray-100 text-xs font-semibold text-gray-700 px-3 text-left"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-200">
                {/* Row number */}
                <td className="w-12 h-8 border-r border-gray-300 bg-gray-50 text-xs font-medium text-gray-500 text-center">
                  {rowIndex + 1}
                </td>

                {/* Data cells */}
                {columns.keys.map((key, colIndex) => {
                  const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                  return (
                    <td
                      key={colIndex}
                      className={`
                        min-w-24 h-8 border-r border-gray-200 px-2 py-1 text-sm cursor-pointer
                        hover:bg-blue-50 transition-colors relative text-gray-600
                        ${isSelected ? 'bg-blue-100 ring-2 ring-blue-500 ring-inset' : 'bg-white'}
                      `}
                      onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                    >
                      <div className="truncate">
                        {renderCellValue(row[key])}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Empty row to add new tickers */}
            <tr key={`empty`} className="border-b border-gray-100">
              <td className="w-12 h-8 border-r border-gray-300 bg-gray-50 text-xs font-medium text-gray-400 text-center">
                {data.length + 1}
              </td>
              {columns.headers.map((_, colIndex) => (
                <td
                  key={colIndex}
                  className="min-w-24 h-8 border-r border-gray-200 bg-gray-25 hover:bg-blue-50 cursor-pointer"
                  onClick={() => setSelectedCell({ row: data.length, col: colIndex })}
                />
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Excel-style status bar */}
      <div className="bg-gray-100 border-t border-gray-300 px-4 py-1 text-xs text-gray-600 flex justify-between">
        <span className='text-green-500 font-bold'>Ready</span>
        {selectedCell && (
          <span>
            Cell: {getColumnLetter(selectedCell.col)}{selectedCell.row + 1}
          </span>
        )}
      </div>
    </div>
  );
};

export default SmartTable;
