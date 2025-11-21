import Papa from 'papaparse'
import { analyzeDataQuality } from './dataAnalysis'

/**
 * Process uploaded file and return analysis data
 * @param {File} file - The file to process
 * @returns {Promise<Object>} Analysis data with parsed data and quality metrics
 */
export async function processFile(file) {
  const extension = file.name.split('.').pop().toLowerCase()

  let parsedData = []

  try {
    if (extension === 'csv') {
      parsedData = await parseCSV(file)
    } else if (extension === 'json') {
      parsedData = await parseJSON(file)
    } else if (extension === 'xlsx') {
      throw new Error('Excel file support coming soon. Please use CSV or JSON format.')
    } else {
      throw new Error(`Unsupported file format: ${extension}`)
    }

    if (!parsedData || parsedData.length === 0) {
      throw new Error('File appears to be empty or could not be parsed')
    }

    // Analyze data quality
    const qualityMetrics = analyzeDataQuality(parsedData)

    return {
      data: parsedData,
      qualityMetrics,
      fileName: file.name,
      fileSize: file.size,
      rowCount: parsedData.length,
      columnCount: parsedData[0] ? Object.keys(parsedData[0]).length : 0,
    }
  } catch (error) {
    console.error('Error processing file:', error)
    throw new Error(error.message || 'Failed to process file')
  }
}

/**
 * Parse CSV file using Papa Parse
 * @param {File} file - CSV file
 * @returns {Promise<Array>} Parsed data array
 */
function parseCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          console.warn('CSV parsing warnings:', results.errors)
        }
        resolve(results.data)
      },
      error: (error) => {
        reject(new Error(`CSV parsing error: ${error.message}`))
      },
    })
  })
}

/**
 * Parse JSON file
 * @param {File} file - JSON file
 * @returns {Promise<Array>} Parsed data array
 */
function parseJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result)
        
        // Handle both array and object formats
        let data = []
        if (Array.isArray(json)) {
          data = json
        } else if (typeof json === 'object' && json !== null) {
          // If it's an object, try to find an array property
          const keys = Object.keys(json)
          if (keys.length === 1 && Array.isArray(json[keys[0]])) {
            data = json[keys[0]]
          } else {
            // Convert object to array
            data = [json]
          }
        } else {
          throw new Error('JSON must be an object or array')
        }

        if (data.length === 0) {
          throw new Error('JSON file appears to be empty')
        }

        resolve(data)
      } catch (error) {
        reject(new Error(`JSON parsing error: ${error.message}`))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read JSON file'))
    }

    reader.readAsText(file)
  })
}

