'use client'

import '../../styles/QualityScore.css'

export default function QualityScore({ qualityMetrics }) {
  if (!qualityMetrics) {
    return (
      <div className="quality-score">
        <p>No quality metrics available</p>
      </div>
    )
  }

  const { overallScore, completeness, consistency, accuracy, validity } = qualityMetrics

  const getScoreColor = (score) => {
    if (score >= 90) return 'excellent'
    if (score >= 70) return 'good'
    return 'poor'
  }

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent'
    if (score >= 70) return 'Good'
    return 'Poor'
  }

  const scoreColor = getScoreColor(overallScore)
  const scoreLabel = getScoreLabel(overallScore)

  return (
    <div className="quality-score">
      <div className="score-header">
        <h2>Data Quality Score</h2>
      </div>

      <div className="score-main">
        <div className={`score-circle score-${scoreColor}`}>
          <div className="score-value">{overallScore}</div>
          <div className="score-label">{scoreLabel}</div>
        </div>

        <div className="score-breakdown">
          <div className="metric-item">
            <div className="metric-header">
              <span className="metric-name">Completeness</span>
              <span className="metric-value">{completeness}%</span>
            </div>
            <div className="metric-bar">
              <div
                className={`metric-fill fill-${getScoreColor(completeness)}`}
                style={{ width: `${completeness}%` }}
                role="progressbar"
                aria-valuenow={completeness}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={`Completeness: ${completeness}%`}
              ></div>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-header">
              <span className="metric-name">Consistency</span>
              <span className="metric-value">{consistency}%</span>
            </div>
            <div className="metric-bar">
              <div
                className={`metric-fill fill-${getScoreColor(consistency)}`}
                style={{ width: `${consistency}%` }}
                role="progressbar"
                aria-valuenow={consistency}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={`Consistency: ${consistency}%`}
              ></div>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-header">
              <span className="metric-name">Accuracy</span>
              <span className="metric-value">{accuracy}%</span>
            </div>
            <div className="metric-bar">
              <div
                className={`metric-fill fill-${getScoreColor(accuracy)}`}
                style={{ width: `${accuracy}%` }}
                role="progressbar"
                aria-valuenow={accuracy}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={`Accuracy: ${accuracy}%`}
              ></div>
            </div>
          </div>

          <div className="metric-item">
            <div className="metric-header">
              <span className="metric-name">Validity</span>
              <span className="metric-value">{validity}%</span>
            </div>
            <div className="metric-bar">
              <div
                className={`metric-fill fill-${getScoreColor(validity)}`}
                style={{ width: `${validity}%` }}
                role="progressbar"
                aria-valuenow={validity}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={`Validity: ${validity}%`}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {qualityMetrics.totalRows && (
        <div className="score-stats">
          <span>Rows: {qualityMetrics.totalRows}</span>
          <span>Columns: {qualityMetrics.totalColumns}</span>
        </div>
      )}
    </div>
  )
}

