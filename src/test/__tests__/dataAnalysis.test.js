import { describe, it, expect } from 'vitest'
import { analyzeDataQuality } from '@/lib/dataAnalysis'

describe('analyzeDataQuality', () => {
  it('should analyze data quality correctly', () => {
    const testData = [
      { name: 'John', age: 30, email: 'john@example.com' },
      { name: 'Jane', age: 25, email: 'jane@example.com' },
      { name: '', age: 35, email: 'bob@example.com' },
    ]

    const result = analyzeDataQuality(testData)

    expect(result).toHaveProperty('overallScore')
    expect(result).toHaveProperty('completeness')
    expect(result).toHaveProperty('consistency')
    expect(result).toHaveProperty('accuracy')
    expect(result).toHaveProperty('validity')
    expect(result).toHaveProperty('columnMetrics')
    expect(result).toHaveProperty('issues')
    expect(result.overallScore).toBeGreaterThanOrEqual(0)
    expect(result.overallScore).toBeLessThanOrEqual(100)
  })

  it('should handle empty data', () => {
    const result = analyzeDataQuality([])

    expect(result.overallScore).toBe(0)
    expect(result.completeness).toBe(0)
    expect(result.columnMetrics).toEqual({})
  })

  it('should detect missing values', () => {
    const testData = [
      { name: 'John', age: 30 },
      { name: '', age: 25 },
      { name: 'Bob', age: null },
    ]

    const result = analyzeDataQuality(testData)

    expect(result.issues.length).toBeGreaterThan(0)
    expect(result.issues.some(issue => issue.type === 'missing_values')).toBe(true)
  })
})

