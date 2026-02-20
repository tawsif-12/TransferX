import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import './DataTable.css';

export default function DataTable({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  loading = false, 
  searchable = true 
}) {
  const [search, setSearch] = useState('');

  const filteredData = search
    ? data.filter(row =>
        Object.values(row).some(val =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      )
    : data;

  return (
    <div className="data-table-container">
      {searchable && (
        <div className="data-table-search">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="data-table-search-input"
          />
        </div>
      )}

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead className="data-table-head">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="data-table-th">
                  {col.label}
                </th>
              ))}
              <th className="data-table-th">Actions</th>
            </tr>
          </thead>
          <tbody className="data-table-body">
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="data-table-loading">
                  <LoadingSpinner />
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="data-table-empty">
                  No records found.
                </td>
              </tr>
            ) : (
              filteredData.map((row, idx) => (
                <tr key={idx} className="data-table-row">
                  {columns.map((col) => (
                    <td key={col.key} className="data-table-td">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  <td className="data-table-td data-table-actions">
                    <button
                      className="data-table-action-btn data-table-action-btn--edit"
                      onClick={() => onEdit?.(row)}
                      title="Edit"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      className="data-table-action-btn data-table-action-btn--delete"
                      onClick={() => onDelete?.(row)}
                      title="Delete"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="3 6 5 6 21 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
