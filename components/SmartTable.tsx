// components/SmartTable.tsx
import React, { useRef, useState, useEffect } from 'react';
import { isSmartCell, SmartCell, SmartColumn, SmartRow } from '@/types';

interface SmartTableProps {
  data: SmartRow[];
  columns: SmartColumn | undefined;
}

interface PopupState {
  isOpen: boolean;
  value: any;
  position: { x: number, y: number };
  cellRef: HTMLElement | null;
}

const SmartTable = ({ data, columns }: SmartTableProps) => {
  const [selectedCell, setSelectedCell] = useState<{ row: number, col: number } | null>(null);
  const [popup, setPopup] = useState<PopupState>({
    isOpen: false,
    value: null,
    position: { x: 0, y: 0 },
    cellRef: null,
  });
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (popup.isOpen && popup.cellRef) {
        const popupElement = document.getElementById('smart-cell-popup');
        const isOverCell = popup.cellRef.contains(event.target as Node);
        const isOverPopup = popupElement?.contains(event.target as Node);

        if (!isOverCell && !isOverPopup) {
          setPopup(prev => ({ ...prev, isOpen: false }));
        }
      }
    };

    if (popup.isOpen) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      return () => document.removeEventListener('mousemove', handleGlobalMouseMove);
    }
  }, [popup.isOpen, popup.cellRef]);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    setSelectedCell({ row: rowIndex, col: colIndex });
  };

  const handleCellMouseEnter = (
    value: any,
    event: React.MouseEvent<HTMLTableCellElement>
  ) => {
    if (isSmartCell(value)) {
      const element = event.currentTarget;
      const rect = event.currentTarget.getBoundingClientRect();
      const tableRect = tableRef.current?.getBoundingClientRect();
      setTimeout(() => {
        if (element.matches(':hover')) {
          setPopup({
            isOpen: true,
            value: value,
            position: {
              x: rect.right - (tableRect?.left || 0),
              y: rect.top - (tableRect?.top || 0)
            },
            cellRef: event.currentTarget
          });
        }
      }, 200);
    }
  };

  const handleCellMouseLeave = () => {
    // Small delay to allow moving to popup without closing
    setTimeout(() => {
      if (!popup.cellRef?.matches(':hover') && !document.getElementById('smart-cell-popup')?.matches(':hover')) {
        setPopup(prev => ({ ...prev, isOpen: false }));
      }
    }, 100);
  };

  // create cell
  const renderCellValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return '';
    }

    if (isSmartCell(value)) {
      const cell = value as SmartCell;
      return cell?.at(0)?.at(1);
    }

    if (typeof value === 'number') {
      return value.toLocaleString();
    }

    return String(value);
  };

  // add ticker
  const handleAddTicker = (ticker: string) => {
    if (ticker.trim()) {
      console.log('Adding ticker:', ticker.trim().toUpperCase());
      // Add your logic here to handle the new ticker
      // For example: onAddTicker?.(ticker.trim().toUpperCase());
    }
  };

  // Convert column letters (A, B, C, etc.)
  const getColumnLetter = (index: number): string => {
    let result = '';
    while (index >= 0) {
      result = String.fromCharCode(65 + (index % 26)) + result;
      index = Math.floor(index / 26) - 1;
    }
    return result;
  };

  // if no columns render nothing
  if (!columns) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-800">No columns defined</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      {/* Excel-style toolbar */}
      <div className="bg-gray-100 border-b border-gray-300 px-4 py-2 text-sm text-gray-600">
        <span className="font-medium">SmartTable</span>
        <span className="ml-4 text-xs">{data.length} rows × {columns.headers.length} columns</span>
      </div>

      <div ref={tableRef} className="overflow-auto max-h-96">
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
                  const cellValue = row[key];

                  return (
                    <td
                      key={colIndex}
                      className={`
                        min-w-24 h-8 border-r border-gray-200 px-2 py-1 text-sm cursor-pointer
                        hover:bg-blue-50 transition-colors relative text-gray-600
                        ${isSelected ? 'bg-blue-100 ring-2 ring-blue-500 ring-inset' : 'bg-white'}
                      `}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      onMouseEnter={(e) => handleCellMouseEnter(cellValue, e)}
                      onMouseLeave={handleCellMouseLeave}
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
              <td
                colSpan={columns.headers.length + 1}
                className="h-8 border-r border-gray-200 bg-gray-25 p-0 relative"
              >
                <div className="flex items-center h-full">
                  <input
                    type="text"
                    id="enter-new-symbol-input"
                    placeholder="Enter new ticker symbol..."
                    className="flex-1 h-full px-3 text-gray-600 bg-transparent border-none outline-none text-sm focus:bg-white transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddTicker(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector('input[id="enter-new-symbol-input"]') as HTMLInputElement;
                      if (input?.value) {
                        handleAddTicker(input.value);
                        input.value = '';
                      }
                    }}
                    className="h-6 px-2 mr-1 font-bold bg-blue-500 hover:bg-blue-600 cursor-pointer text-white text-xs rounded transition-colors flex-shrink-0"
                  >
                    Enter ↵
                  </button>
                </div>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      {/* Custom Popup for SmartCell */}
      <SmartCellPopup
        isOpen={popup.isOpen}
        value={popup.value}
        position={popup.position}
        onMouseEnter={() => {/* Keep popup open when hovering over it */ }}
        onMouseLeave={() => setPopup(prev => ({ ...prev, isOpen: false }))}
      />

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

interface SmartCellPopupProps {
  isOpen: boolean;
  value: any;
  position: { x: number, y: number };
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const SmartCellPopup: React.FC<SmartCellPopupProps> = ({
  isOpen,
  value,
  position,
  onMouseEnter,
  onMouseLeave
}) => {
  if (!isOpen) return null;
  const data = (value as SmartCell)!.map(ele => ele.at(1) as number);
  const currValue = value.at(0).at(1) as number;
  const minRange = Math.min(...data.slice(1));
  const maxRange = Math.max(...data.slice(1));

  return (
    <div
      id="smart-cell-popup"
      className="absolute bg-white border-2 border-blue-500 rounded-lg shadow-xl p-4 z-50 min-w-64 max-w-80"
      style={{
        left: position.x + 130,
        top: position.y + 130,
        transform: position.x > 300 ? 'translateX(-100%)' : 'none'
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
        <h3 className="font-medium text-gray-800">Last Calculated: {value.at(0).at(0)}</h3>
      </div>

      {/* Content Area - You can customize this */}
      <div className="space-y-2">
        <div className="text-sm text-gray-600">
          Value: {currValue}
        </div>

        {/* Add your custom popup content here */}
        <div className="mt-4 space-y-2">
          <div className="text-sm font-medium text-gray-700">
            Range: ({minRange}, {maxRange})
          </div>
          <div className="text-sm text-gray-600">
            {/* This is where you'll implement your custom popup content */}
            {currValue > maxRange ? <p>Metric is <span className='font-bold'>above</span> 6-quarter range. If Strong Growth → stock pricing in aggressive growth, thus <span className='font-bold'>Buy/Hold</span>. If Weak Growth → stock trading in overvalued prices, thus <span className='font-bold'>Sell</span></p>
              : currValue > (maxRange + minRange) / 2 ? <p>Metric is in <span className='font-bold'>upper half</span> of 6-quarter range. If Strong Growth → stock is getting priced in, thus <span className='font-bold'>Buy/Hold</span>. If Weak Growth → market realize stock is expensive, thus <span className='font-bold'>Sell/Hold</span></p>
                : currValue > minRange ? <p>Metric is in <span className='font-bold'>lower half</span> of 6-quarter range. If Strong Growth → good value, thus <span className='font-bold'>Buy</span>. If Weak Growth → exercise caution, thus <span className='font-bold'>Sell/Hold</span></p>
                  : <p>Metric is <span className='font-bold'>below</span> 6-quarter min. If Strong Growth → extremely undervalued, thus <span className='font-bold'>Strong Buy</span>. If Weak Growth → market is pessimistic, thus <span className='font-bold'>Strong Sell</span></p>
            }
          </div>
          <div className="text-sm text-gray-600">
            <p>Check <span className="italic">Growth</span> column to confirm action.</p>
          </div>
        </div>

        <div className="bg-gray-50 p-2 rounded text-xs font-mono max-h-32 overflow-y-auto">
          {
            (value as SmartCell)!.map((ele, i) => {
              return (
                <p key={i} className="text-sm text-gray-800">{ele.at(0)}: {ele.at(1)}</p>
              );
            })
          }

        </div>
      </div>

    </div>
  );
};
