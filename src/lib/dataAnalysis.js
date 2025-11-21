/**
 * Analyze data quality and return comprehensive metrics
 * @param {Array<Object>} data - Array of data objects
 * @returns {Object} Quality metrics object
 */
export function analyzeDataQuality(data) {
  if (!data || data.length === 0) {
    return {
      overallScore: 0,
      completeness: 0,
      consistency: 0,
      accuracy: 0,
      validity: 0,
      columnMetrics: {},
      issues: [],
    }
  }

  const columns = getColumns(data)
  const columnMetrics = analyzeColumns(data, columns)
  const issues = identifyIssues(data, columnMetrics)
  
  // Calculate overall scores
  const completeness = calculateCompleteness(columnMetrics)
  const consistency = calculateConsistency(columnMetrics)
  const accuracy = calculateAccuracy(columnMetrics, data)
  const validity = calculateValidity(columnMetrics)
  
  // Overall score is weighted average
  const overallScore = Math.round(
    (completeness * 0.3) +
    (consistency * 0.25) +
    (accuracy * 0.25) +
    (validity * 0.2)
  )

  return {
    overallScore,
    completeness,
    consistency,
    accuracy,
    validity,
    columnMetrics,
    issues,
    totalRows: data.length,
    totalColumns: columns.length,
  }
}

/**
 * Get all column names from data
 * @param {Array<Object>} data - Data array
 * @returns {Array<string>} Column names
 */
function getColumns(data) {
  const columnSet = new Set()
  data.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (row[key] !== null && row[key] !== undefined) {
        columnSet.add(key)
      }
    })
  })
  return Array.from(columnSet)
}

/**
 * Analyze each column for quality metrics
 * @param {Array<Object>} data - Data array
 * @param {Array<string>} columns - Column names
 * @returns {Object} Column metrics
 */
function analyzeColumns(data, columns) {
  const metrics = {}

  columns.forEach((column) => {
    const values = data.map((row) => row[column]).filter((v) => v !== null && v !== undefined && v !== '')
    const nonNullCount = values.length
    const nullCount = data.length - nonNullCount
    const nullPercentage = (nullCount / data.length) * 100

    // Detect data type
    const dataType = detectDataType(values)
    
    // Calculate uniqueness
    const uniqueValues = new Set(values.map(String))
    const uniqueness = (uniqueValues.size / nonNullCount) * 100

    // Detect outliers (for numeric columns)
    let outliers = 0
    if (dataType === 'number') {
      const numericValues = values.map(Number).filter((v) => !isNaN(v))
      if (numericValues.length > 0) {
        outliers = detectOutliers(numericValues)
      }
    }

    // Check for duplicates
    const duplicates = detectDuplicates(data, column)

    metrics[column] = {
      name: column,
      dataType,
      totalCount: data.length,
      nonNullCount,
      nullCount,
      nullPercentage,
      uniqueCount: uniqueValues.size,
      uniqueness,
      outliers,
      duplicates,
      min: dataType === 'number' ? getMin(values) : null,
      max: dataType === 'number' ? getMax(values) : null,
      mean: dataType === 'number' ? getMean(values) : null,
    }
  })

  return metrics
}

/**
 * Detect data type of a column
 * @param {Array} values - Column values
 * @returns {string} Data type
 */
function detectDataType(values) {
  if (values.length === 0) return 'unknown'

  let numberCount = 0
  let dateCount = 0
  let booleanCount = 0

  values.forEach((value) => {
    const str = String(value).trim()
    
    if (str === 'true' || str === 'false') {
      booleanCount++
    } else if (!isNaN(Number(str)) && str !== '') {
      numberCount++
    } else if (!isNaN(Date.parse(str)) && str.length > 5) {
      dateCount++
    }
  })

  const threshold = values.length * 0.8

  if (booleanCount >= threshold) return 'boolean'
  if (numberCount >= threshold) return 'number'
  if (dateCount >= threshold) return 'date'
  return 'text'
}

/**
 * Detect outliers using IQR method
 * @param {Array<number>} values - Numeric values
 * @returns {number} Number of outliers
 */
function detectOutliers(values) {
  if (values.length < 4) return 0

  const sorted = [...values].sort((a, b) => a - b)
  const q1Index = Math.floor(sorted.length * 0.25)
  const q3Index = Math.floor(sorted.length * 0.75)
  const q1 = sorted[q1Index]
  const q3 = sorted[q3Index]
  const iqr = q3 - q1
  const lowerBound = q1 - 1.5 * iqr
  const upperBound = q3 + 1.5 * iqr

  return values.filter((v) => v < lowerBound || v > upperBound).length
}

/**
 * Detect duplicate rows for a column
 * @param {Array<Object>} data - Data array
 * @param {string} column - Column name
 * @returns {number} Number of duplicate values
 */
function detectDuplicates(data, column) {
  const valueCounts = {}
  data.forEach((row) => {
    const value = String(row[column] || '')
    valueCounts[value] = (valueCounts[value] || 0) + 1
  })

  let duplicates = 0
  Object.values(valueCounts).forEach((count) => {
    if (count > 1) {
      duplicates += count - 1
    }
  })

  return duplicates
}

/**
 * Calculate completeness score
 * @param {Object} columnMetrics - Column metrics
 * @returns {number} Completeness score (0-100)
 */
function calculateCompleteness(columnMetrics) {
  const columns = Object.values(columnMetrics)
  if (columns.length === 0) return 0

  const totalNullPercentage = columns.reduce((sum, col) => sum + col.nullPercentage, 0)
  const avgNullPercentage = totalNullPercentage / columns.length
  return Math.max(0, Math.round(100 - avgNullPercentage))
}

/**
 * Calculate consistency score
 * @param {Object} columnMetrics - Column metrics
 * @returns {number} Consistency score (0-100)
 */
function calculateConsistency(columnMetrics) {
  const columns = Object.values(columnMetrics)
  if (columns.length === 0) return 0

  // Check for consistent data types and formats
  let consistencyScore = 100

  columns.forEach((col) => {
    // Penalize for high null percentage
    if (col.nullPercentage > 50) {
      consistencyScore -= 10
    }
    // Penalize for low uniqueness (potential duplicates)
    if (col.uniqueness < 10 && col.dataType !== 'boolean') {
      consistencyScore -= 5
    }
  })

  return Math.max(0, Math.min(100, consistencyScore))
}

/**
 * Calculate accuracy score
 * @param {Object} columnMetrics - Column metrics
 * @param {Array<Object>} data - Data array
 * @returns {number} Accuracy score (0-100)
 */
function calculateAccuracy(columnMetrics, data) {
  const columns = Object.values(columnMetrics)
  if (columns.length === 0) return 0

  let accuracyScore = 100

  columns.forEach((col) => {
    // Penalize for outliers
    const outlierPercentage = (col.outliers / col.nonNullCount) * 100
    if (outlierPercentage > 10) {
      accuracyScore -= 15
    } else if (outlierPercentage > 5) {
      accuracyScore -= 5
    }

    // Penalize for duplicates
    const duplicatePercentage = (col.duplicates / col.totalCount) * 100
    if (duplicatePercentage > 20) {
      accuracyScore -= 10
    }
  })

  return Math.max(0, Math.min(100, accuracyScore))
}

/**
 * Calculate validity score
 * @param {Object} columnMetrics - Column metrics
 * @returns {number} Validity score (0-100)
 */
function calculateValidity(columnMetrics) {
  const columns = Object.values(columnMetrics)
  if (columns.length === 0) return 0

  let validityScore = 100

  columns.forEach((col) => {
    // Check for appropriate data types
    if (col.dataType === 'unknown') {
      validityScore -= 10
    }
  })

  return Math.max(0, Math.min(100, validityScore))
}

/**
 * Identify specific issues in the data
 * @param {Array<Object>} data - Data array
 * @param {Object} columnMetrics - Column metrics
 * @returns {Array<Object>} Array of issues
 */
function identifyIssues(data, columnMetrics) {
  const issues = []

  Object.values(columnMetrics).forEach((col) => {
    if (col.nullPercentage > 20) {
      issues.push({
        type: 'missing_values',
        severity: col.nullPercentage > 50 ? 'high' : 'medium',
        column: col.name,
        message: `${col.nullPercentage.toFixed(1)}% of values are missing in "${col.name}"`,
      })
    }

    if (col.outliers > 0 && col.outliers / col.nonNullCount > 0.05) {
      issues.push({
        type: 'outliers',
        severity: 'medium',
        column: col.name,
        message: `${col.outliers} outliers detected in "${col.name}"`,
      })
    }

    if (col.duplicates > 0 && col.duplicates / col.totalCount > 0.1) {
      issues.push({
        type: 'duplicates',
        severity: 'medium',
        column: col.name,
        message: `${col.duplicates} duplicate values found in "${col.name}"`,
      })
    }

    if (col.uniqueness < 5 && col.dataType !== 'boolean') {
      issues.push({
        type: 'low_uniqueness',
        severity: 'low',
        column: col.name,
        message: `Low uniqueness (${col.uniqueness.toFixed(1)}%) in "${col.name}"`,
      })
    }
  })

  return issues
}

/**
 * Get minimum value
 */
function getMin(values) {
  const numbers = values.map(Number).filter((v) => !isNaN(v))
  return numbers.length > 0 ? Math.min(...numbers) : null
}

/**
 * Get maximum value
 */
function getMax(values) {
  const numbers = values.map(Number).filter((v) => !isNaN(v))
  return numbers.length > 0 ? Math.max(...numbers) : null
}

/**
 * Get mean value
 */
function getMean(values) {
  const numbers = values.map(Number).filter((v) => !isNaN(v))
  if (numbers.length === 0) return null
  const sum = numbers.reduce((a, b) => a + b, 0)
  return sum / numbers.length
}

