'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FileUpload from '@/components/FileUpload'
import '../styles/HomePage.css'

export default function HomePage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileProcessed = (analysisData) => {
    // Store analysis data in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('analysisData', JSON.stringify(analysisData))
      router.push('/analysis')
    }
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Data Quality Analysis Platform</h1>
        <p className="subtitle">Upload your dataset to get instant AI-powered insights</p>
      </header>

      <main className="home-main">
        <FileUpload 
          onFileProcessed={handleFileProcessed}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />

        <section className="info-section">
          <h2>Supported Formats</h2>
          <ul className="format-list">
            <li>CSV files (.csv)</li>
            <li>JSON files (.json)</li>
            <li>Excel files (.xlsx)</li>
          </ul>
          <p className="file-limit">Maximum file size: 50MB</p>
        </section>

        <section className="features-section">
          <h2>What You&apos;ll Get</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Quality Score</h3>
              <p>Comprehensive data quality assessment</p>
            </div>
            <div className="feature-card">
              <h3>AI Insights</h3>
              <p>Natural language explanations of issues</p>
            </div>
            <div className="feature-card">
              <h3>Visualizations</h3>
              <p>Interactive charts and data distributions</p>
            </div>
            <div className="feature-card">
              <h3>Recommendations</h3>
              <p>Actionable fixes and improvements</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

