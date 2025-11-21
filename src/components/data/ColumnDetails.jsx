'use client'

import '../../styles/ColumnDetails.css'

export default function ColumnDetails({ data, qualityMetrics }) {
  if (!qualityMetrics?.columnMetrics) {
    return (
      <div className="column-details">
        <p>No column details available</p>
      </div>
    )
  }

  const columns = Object.values(qualityMetrics.columnMetrics)

  const getIssueBadges = (column) => {
    const badges = []

    if (column.nullPercentage > 20) {
      badges.push(
        <span key="missing" className="badge badge-warning">
          Missing Values
        </span>
      )
    }

    if (column.outliers > 0) {
      badges.push(
        <span key="outliers" className="badge badge-info">
          Outliers
        </span>
      )
    }

    if (column.duplicates > 0) {
      badges.push(
        <span key="duplicates" className="badge badge-error">
          Duplicates
        </span>
      )
    }

    if (column.uniqueness < 10 && column.dataType !== 'boolean') {
      badges.push(
        <span key="low-unique" className="badge badge-warning">
          Low Uniqueness
        </span>
      )
    }

    return badges.length > 0 ? badges : (
      <span className="badge badge-success">No Issues</span>
    )
  }

  return (
    <div className="column-details">
      <h2>Column Analysis</h2>

      <div className="columns-grid">
        {columns.map((column) => (
          <div key={column.name} className="column-card">
            <div className="column-header">
              <h3>{column.name}</h3>
              <span className={`column-type type-${column.dataType}`}>
                {column.dataType}
              </span>
            </div>

            <div className="column-stats">
              <div className="stat-item">
                <span className="stat-label">Total Values:</span>
                <span className="stat-value">{column.totalCount}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Non-Null:</span>
                <span className="stat-value">{column.nonNullCount}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Missing:</span>
                <span className="stat-value">{column.nullCount} ({column.nullPercentage.toFixed(1)}%)</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Unique:</span>
                <span className="stat-value">{column.uniqueCount} ({column.uniqueness.toFixed(1)}%)</span>
              </div>

              {column.dataType === 'number' && (
                <>
                  {column.min !== null && (
                    <div className="stat-item">
                      <span className="stat-label">Min:</span>
                      <span className="stat-value">{column.min.toFixed(2)}</span>
                    </div>
                  )}
                  {column.max !== null && (
                    <div className="stat-item">
                      <span className="stat-label">Max:</span>
                      <span className="stat-value">{column.max.toFixed(2)}</span>
                    </div>
                  )}
                  {column.mean !== null && (
                    <div className="stat-item">
                      <span className="stat-label">Mean:</span>
                      <span className="stat-value">{column.mean.toFixed(2)}</span>
                    </div>
                  )}
                  {column.outliers > 0 && (
                    <div className="stat-item">
                      <span className="stat-label">Outliers:</span>
                      <span className="stat-value">{column.outliers}</span>
                    </div>
                  )}
                </>
              )}

              {column.duplicates > 0 && (
                <div className="stat-item">
                  <span className="stat-label">Duplicates:</span>
                  <span className="stat-value">{column.duplicates}</span>
                </div>
              )}
            </div>

            <div className="column-issues">
              {getIssueBadges(column)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

