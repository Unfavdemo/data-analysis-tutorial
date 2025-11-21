'use client'

import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'
import '../../styles/DataVisualizations.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export default function DataVisualizations({ data, qualityMetrics }) {
  const qualityChartData = useMemo(() => {
    if (!qualityMetrics) return null

    return {
      labels: ['Completeness', 'Consistency', 'Accuracy', 'Validity'],
      datasets: [
        {
          label: 'Quality Metrics (%)',
          data: [
            qualityMetrics.completeness,
            qualityMetrics.consistency,
            qualityMetrics.accuracy,
            qualityMetrics.validity,
          ],
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(139, 92, 246, 0.8)',
          ],
          borderColor: [
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(139, 92, 246, 1)',
          ],
          borderWidth: 1,
        },
      ],
    }
  }, [qualityMetrics])

  const dataTypeChartData = useMemo(() => {
    if (!qualityMetrics?.columnMetrics) return null

    const typeCounts = {}
    Object.values(qualityMetrics.columnMetrics).forEach((col) => {
      typeCounts[col.dataType] = (typeCounts[col.dataType] || 0) + 1
    })

    const labels = Object.keys(typeCounts)
    const data = Object.values(typeCounts)

    return {
      labels,
      datasets: [
        {
          label: 'Columns by Data Type',
          data,
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)',
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(139, 92, 246, 1)',
          ],
          borderWidth: 1,
        },
      ],
    }
  }, [qualityMetrics])

  const nullValuesChartData = useMemo(() => {
    if (!qualityMetrics?.columnMetrics) return null

    const columns = Object.values(qualityMetrics.columnMetrics)
      .filter((col) => col.nullPercentage > 0)
      .sort((a, b) => b.nullPercentage - a.nullPercentage)
      .slice(0, 10)

    return {
      labels: columns.map((col) => col.name),
      datasets: [
        {
          label: 'Missing Values (%)',
          data: columns.map((col) => col.nullPercentage),
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 1,
        },
      ],
    }
  }, [qualityMetrics])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }

  return (
    <div className="data-visualizations">
      <h2>Data Quality Visualizations</h2>

      <div className="charts-grid">
        {qualityChartData && (
          <div className="chart-container">
            <h3>Quality Metrics</h3>
            <div className="chart-wrapper">
              <Bar data={qualityChartData} options={chartOptions} />
            </div>
          </div>
        )}

        {dataTypeChartData && (
          <div className="chart-container">
            <h3>Data Types Distribution</h3>
            <div className="chart-wrapper">
              <Pie data={dataTypeChartData} options={pieOptions} />
            </div>
          </div>
        )}

        {nullValuesChartData && nullValuesChartData.labels.length > 0 && (
          <div className="chart-container chart-full">
            <h3>Missing Values by Column</h3>
            <div className="chart-wrapper">
              <Bar data={nullValuesChartData} options={chartOptions} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

