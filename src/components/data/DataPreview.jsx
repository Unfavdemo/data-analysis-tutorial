'use client'

import { useState, useMemo } from 'react'
import '../../styles/DataPreview.css'

export default function DataPreview({ data }) {
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  const columns = useMemo(() => {
    if (!data || data.length === 0) return []
    return Object.keys(data[0])
  }, [data])

  const totalPages = Math.ceil((data?.length || 0) / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentData = data?.slice(startIndex, endIndex) || []

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }

  if (!data || data.length === 0) {
    return (
      <div className="data-preview">
        <p>No data to display</p>
      </div>
    )
  }

  return (
    <div className="data-preview">
      <div className="preview-header">
        <h2>Data Preview</h2>
        <p className="preview-info">
          Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length} rows
        </p>
      </div>

      <div className="table-container">
        <table className="preview-table" role="table" aria-label="Data preview table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, rowIndex) => (
              <tr key={startIndex + rowIndex}>
                {columns.map((column) => {
                  const value = row[column]
                  const displayValue = value === null || value === undefined || value === '' 
                    ? <span className="null-value" aria-label="Empty value">—</span>
                    : String(value)
                  
                  return (
                    <td key={column} data-label={column}>
                      {displayValue}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination" role="navigation" aria-label="Pagination">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

