'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DataPreview from '@/components/data/DataPreview'
import QualityScore from '@/components/data/QualityScore'
import AIInsights from '@/components/data/AIInsights'
import DataVisualizations from '@/components/data/DataVisualizations'
import ColumnDetails from '@/components/data/ColumnDetails'
import ErrorBoundary from '@/components/ErrorBoundary'
import '../../styles/AnalysisPage.css'

export default function AnalysisPage() {
  const router = useRouter()
  const [analysisData, setAnalysisData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('analysisData')
      if (stored) {
        try {
          setAnalysisData(JSON.parse(stored))
        } catch (error) {
          console.error('Error parsing analysis data:', error)
          router.push('/')
        }
      } else {
        router.push('/')
      }
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="analysis-page">
        <div className="loading">Loading analysis...</div>
      </div>
    )
  }

  if (!analysisData) {
    return null
  }

  return (
    <ErrorBoundary>
      <div className="analysis-page">
        <header className="analysis-header">
          <h1>Data Quality Analysis</h1>
          <button 
            className="back-button"
            onClick={() => router.push('/')}
            aria-label="Return to home page"
          >
            ← Upload New File
          </button>
        </header>

        <main className="analysis-main">
          <section className="quality-score-section">
            <QualityScore qualityMetrics={analysisData.qualityMetrics} />
          </section>

          <section className="preview-section">
            <DataPreview data={analysisData.data} />
          </section>

          <section className="visualizations-section">
            <DataVisualizations 
              data={analysisData.data}
              qualityMetrics={analysisData.qualityMetrics}
            />
          </section>

          <section className="ai-insights-section">
            <AIInsights 
              qualityMetrics={analysisData.qualityMetrics}
              data={analysisData.data}
            />
          </section>

          <section className="column-details-section">
            <ColumnDetails 
              data={analysisData.data}
              qualityMetrics={analysisData.qualityMetrics}
            />
          </section>
        </main>
      </div>
    </ErrorBoundary>
  )
}

