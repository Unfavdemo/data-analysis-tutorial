import OpenAI from 'openai'

/**
 * Generate AI insights using OpenAI API
 * @param {Object} qualityMetrics - Quality metrics object
 * @param {Array<Object>} data - Data array
 * @returns {Promise<Object>} AI-generated insights
 */
export async function generateAIInsights(qualityMetrics, data) {
  // For client-side usage, we need NEXT_PUBLIC_ prefix
  // Note: In production, this should be done via API routes for security
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    // Fallback to basic insights if API key is not available
    return generateBasicInsights(qualityMetrics)
  }

  try {
    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true, // Note: In production, use API routes
    })

    const prompt = buildPrompt(qualityMetrics, data)

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a data quality expert. Provide clear, actionable insights about data quality issues in plain language that non-technical users can understand.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const content = response.choices[0]?.message?.content

    if (!content) {
      throw new Error('No response from AI')
    }

    // Parse the AI response (assuming JSON format)
    try {
      return JSON.parse(content)
    } catch {
      // If not JSON, format as structured response
      return formatAIResponse(content, qualityMetrics)
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    // Fallback to basic insights
    return generateBasicInsights(qualityMetrics)
  }
}

/**
 * Build prompt for AI analysis
 * @param {Object} qualityMetrics - Quality metrics
 * @param {Array<Object>} data - Data array
 * @returns {string} Prompt string
 */
function buildPrompt(qualityMetrics, data) {
  const issues = qualityMetrics.issues || []
  const columnMetrics = qualityMetrics.columnMetrics || {}

  let prompt = `Analyze this data quality report and provide insights:

Overall Quality Score: ${qualityMetrics.overallScore}/100
- Completeness: ${qualityMetrics.completeness}%
- Consistency: ${qualityMetrics.consistency}%
- Accuracy: ${qualityMetrics.accuracy}%
- Validity: ${qualityMetrics.validity}%

Total Rows: ${qualityMetrics.totalRows || 0}
Total Columns: ${qualityMetrics.totalColumns || 0}

Key Issues Found:
${issues.map((issue) => `- ${issue.message} (${issue.severity} severity)`).join('\n')}

Column Metrics:
${Object.values(columnMetrics)
  .map((col) => `- ${col.name}: ${col.dataType}, ${col.nullPercentage.toFixed(1)}% missing, ${col.uniqueness.toFixed(1)}% unique`)
  .join('\n')}

Please provide:
1. A brief summary of the data quality
2. Key issues that need attention (as JSON array with title, description, severity)
3. Actionable recommendations (as JSON array)
4. SQL fixes if applicable (as JSON array)

Return the response as JSON with this structure:
{
  "summary": "...",
  "issues": [{"title": "...", "description": "...", "severity": "high|medium|low"}],
  "recommendations": ["...", "..."],
  "sqlFixes": ["...", "..."]
}`

  return prompt
}

/**
 * Format AI response text into structured object
 * @param {string} content - AI response text
 * @param {Object} qualityMetrics - Quality metrics
 * @returns {Object} Formatted insights
 */
function formatAIResponse(content, qualityMetrics) {
  const issues = qualityMetrics.issues || []

  return {
    summary: content.split('\n')[0] || 'Data quality analysis completed.',
    issues: issues.slice(0, 5).map((issue) => ({
      title: issue.type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      description: issue.message,
      severity: issue.severity,
    })),
    recommendations: extractRecommendations(content),
    sqlFixes: [],
  }
}

/**
 * Extract recommendations from text
 * @param {string} text - Text content
 * @returns {Array<string>} Recommendations
 */
function extractRecommendations(text) {
  const lines = text.split('\n')
  const recommendations = []

  lines.forEach((line) => {
    if (line.match(/^\d+\.|[-*]/) && line.length > 10) {
      recommendations.push(line.replace(/^\d+\.|[-*]\s*/, '').trim())
    }
  })

  return recommendations.slice(0, 5)
}

/**
 * Generate basic insights without AI
 * @param {Object} qualityMetrics - Quality metrics
 * @returns {Object} Basic insights
 */
function generateBasicInsights(qualityMetrics) {
  const { overallScore, issues, completeness, consistency, accuracy, validity } = qualityMetrics

  let summary = `Your dataset has an overall quality score of ${overallScore}/100. `

  if (overallScore >= 90) {
    summary += 'The data quality is excellent with minimal issues.'
  } else if (overallScore >= 70) {
    summary += 'The data quality is good but could be improved.'
  } else {
    summary += 'The data quality needs significant improvement.'
  }

  const recommendations = []

  if (completeness < 80) {
    recommendations.push('Address missing values to improve completeness score')
  }

  if (consistency < 80) {
    recommendations.push('Standardize data formats and types for better consistency')
  }

  if (accuracy < 80) {
    recommendations.push('Review and correct outliers and duplicate entries')
  }

  if (validity < 80) {
    recommendations.push('Validate data types and formats across all columns')
  }

  return {
    summary,
    issues: (issues || []).slice(0, 5).map((issue) => ({
      title: issue.type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      description: issue.message,
      severity: issue.severity,
    })),
    recommendations: recommendations.length > 0 ? recommendations : ['Continue monitoring data quality regularly'],
    sqlFixes: [],
  }
}

