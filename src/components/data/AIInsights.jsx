'use client'

import { useState, useEffect, useCallback } from 'react'
import { generateAIInsights } from '@/lib/aiIntegration'
import '../../styles/AIInsights.css'

export default function AIInsights({ qualityMetrics, data }) {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadInsights = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await generateAIInsights(qualityMetrics, data)
      setInsights(result)
    } catch (err) {
      console.error('Error generating AI insights:', err)
      setError('Failed to generate AI insights. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [qualityMetrics, data])

  useEffect(() => {
    if (qualityMetrics && data) {
      loadInsights()
    }
  }, [qualityMetrics, data, loadInsights])

  if (loading) {
    return (
      <div className="ai-insights">
        <div className="insights-header">
          <h2>AI-Powered Insights</h2>
        </div>
        <div className="insights-loading">
          <div className="spinner" aria-label="Generating insights"></div>
          <p>Generating insights...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="ai-insights">
        <div className="insights-header">
          <h2>AI-Powered Insights</h2>
          <button onClick={loadInsights} className="retry-button">
            Retry
          </button>
        </div>
        <div className="insights-error" role="alert">
          {error}
        </div>
      </div>
    )
  }

  if (!insights) {
    return (
      <div className="ai-insights">
        <div className="insights-header">
          <h2>AI-Powered Insights</h2>
        </div>
        <p>No insights available</p>
      </div>
    )
  }

  return (
    <div className="ai-insights">
      <div className="insights-header">
        <h2>AI-Powered Insights</h2>
        <button onClick={loadInsights} className="refresh-button" aria-label="Refresh insights">
          Refresh
        </button>
      </div>

      <div className="insights-content">
        {insights.summary && (
          <div className="insight-section">
            <h3>Summary</h3>
            <p>{insights.summary}</p>
          </div>
        )}

        {insights.issues && insights.issues.length > 0 && (
          <div className="insight-section">
            <h3>Key Issues</h3>
            <ul className="issues-list">
              {insights.issues.map((issue, index) => (
                <li key={index} className={`issue-item issue-${issue.severity || 'medium'}`}>
                  <strong>{issue.title}:</strong> {issue.description}
                </li>
              ))}
            </ul>
          </div>
        )}

        {insights.recommendations && insights.recommendations.length > 0 && (
          <div className="insight-section">
            <h3>Recommendations</h3>
            <ol className="recommendations-list">
              {insights.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ol>
          </div>
        )}

        {insights.sqlFixes && insights.sqlFixes.length > 0 && (
          <div className="insight-section">
            <h3>SQL Fixes</h3>
            <div className="sql-fixes">
              {insights.sqlFixes.map((sql, index) => (
                <pre key={index} className="sql-code">
                  <code>{sql}</code>
                </pre>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

