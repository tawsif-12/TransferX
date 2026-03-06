import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import './DataTable.css';

export default function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
  loading = false,
  searchable = true,
  loadingRowId = null,
  pageSize = 10,
  initialPage = 1,
  onPageChange,
}) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(initialPage);

  // reset page whenever data/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, data]);

  const filteredData = search
    ? data.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      )
    : data;

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    onPageChange?.(newPage);
  };

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
            aria-label="Search table"
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
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="data-table-empty">
                  No records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={idx}
                  className={`data-table-row ${
                    loadingRowId === row.id ? 'data-table-row--loading' : ''
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="data-table-td">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  <td className="data-table-td data-table-actions">
                    <button
                      className="data-table-action-btn data-table-action-btn--edit"
                      onClick={() => onEdit?.(row)}
                      disabled={loadingRowId !== null}
                      title="Edit"
                      aria-label={`Edit row ${idx}`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      className="data-table-action-btn data-table-action-btn--delete"
                      onClick={() => onDelete?.(row)}
                      disabled={loadingRowId === row.id}
                      title={
                        loadingRowId === row.id ? 'Deleting...' : 'Delete'
                      }
                      aria-label={`Delete row ${idx}`}
                    >
                      {loadingRowId === row.id ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          className="data-table-action-spinner"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            strokeWidth="2"
                            opacity="0.3"
                          />
                          <path
                            d="M12 2a10 10 0 0 1 10 10"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <polyline
                            points="3 6 5 6 21 6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* pagination controls */}
      {totalPages > 1 && (
        <div className="data-table-pagination">
          <button
            onClick={() => handlePage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            ‹
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={i + 1 === currentPage ? 'active' : ''}
              onClick={() => handlePage(i + 1)}
              aria-label={`Page ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
