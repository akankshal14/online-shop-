import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export default function SortableTable({ columns, data, onRowClick, emptyMessage = 'No data found' }) {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (col) => {
    if (!col.sortable) return;
    if (sortCol === col.key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col.key); setSortDir('asc'); }
  };

  const sorted = [...(data || [])].sort((a, b) => {
    if (!sortCol) return 0;
    const av = a[sortCol] ?? '', bv = b[sortCol] ?? '';
    const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
    return sortDir === 'asc' ? cmp : -cmp;
  });

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} onClick={() => handleSort(col)} style={{ cursor: col.sortable ? 'pointer' : 'default' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  {col.label}
                  {col.sortable
                    ? sortCol === col.key
                      ? (sortDir === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />)
                      : <ChevronsUpDown size={11} style={{ opacity: 0.4 }} />
                    : null}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0
            ? <tr><td colSpan={columns.length} className="empty-state">{emptyMessage}</td></tr>
            : sorted.map((row, i) => (
              <tr key={row.id ?? i}
                onClick={() => onRowClick?.(row)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
                {columns.map(col => (
                  <td key={col.key}>{col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}</td>
                ))}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}
