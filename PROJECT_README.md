# Agentic Data Quality Analysis Platform
## Quick Start

1. **Install Dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_MAX_FILE_SIZE_MB=50
   NEXT_PUBLIC_SUPPORTED_FORMATS=csv,json,xlsx
   ```

   **Note:** For client-side AI integration, you'll need `NEXT_PUBLIC_OPENAI_API_KEY` instead:
   ```env
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run Development Server:**
   ```bash
   pnpm dev
   ```

4. **Run Tests:**
   ```bash
   pnpm test
   ```

## Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── layout.js          # Root layout
│   ├── page.jsx           # Home page
│   └── analysis/
│       └── page.jsx       # Analysis results page
├── components/
│   ├── FileUpload.jsx    # File upload component
│   ├── ErrorBoundary.jsx # Error boundary
│   └── data/
│       ├── DataPreview.jsx
│       ├── QualityScore.jsx
│       ├── AIInsights.jsx
│       ├── DataVisualizations.jsx
│       └── ColumnDetails.jsx
├── lib/
│   ├── fileProcessing.js  # CSV/JSON parsing
│   ├── dataAnalysis.js    # Quality analysis engine
│   └── aiIntegration.js   # OpenAI API integration
├── styles/                # Custom CSS files (NO Tailwind)
│   ├── globals.css
│   ├── HomePage.css
│   ├── FileUpload.css
│   ├── AnalysisPage.css
│   ├── DataPreview.css
│   ├── QualityScore.css
│   ├── AIInsights.css
│   ├── DataVisualizations.css
│   ├── ColumnDetails.css
│   └── ErrorBoundary.css
└── test/
    ├── setup.js
    └── __tests__/
        └── dataAnalysis.test.js
```

## Features Implemented

✅ **File Upload & Processing**
- Drag-and-drop file upload
- Support for CSV and JSON files
- File validation (size, format)
- Client-side parsing with Papa Parse

✅ **Data Quality Analysis**
- Completeness scoring
- Consistency checking
- Accuracy assessment
- Validity validation
- Column-by-column analysis
- Outlier detection
- Duplicate identification

✅ **AI-Powered Insights**
- OpenAI API integration
- Natural language explanations
- Actionable recommendations
- Fallback to basic insights if API unavailable

✅ **Data Visualization**
- Chart.js integration
- Quality metrics bar chart
- Data type distribution pie chart
- Missing values visualization

✅ **User Interface**
- Responsive design (mobile-first)
- Accessibility features (WCAG 2.1 AA)
- Error handling with ErrorBoundary
- Loading states
- Data preview with pagination

✅ **Testing**
- Vitest configuration
- Sample test files
- Test setup for React Testing Library

## Technologies Used

- **Next.js 14** with App Router
- **React 18** (JavaScript, NO TypeScript)
- **Turbopack** bundler
- **Papa Parse** for CSV/JSON parsing
- **Chart.js + react-chartjs-2** for visualizations
- **OpenAI API** for AI insights
- **Vitest** for testing
- **Custom CSS3** (NO Tailwind)

## Sample Data

Sample CSV files are available in `public/datasets/`:
- `sample-sales.csv` - Sales data with some missing values
- `sample-customers.csv` - Customer data with various data types

## Build for Production

```bash
pnpm build
pnpm start
```

## Notes

- The project uses JavaScript (NO TypeScript) as specified
- All styling is done with custom CSS (NO Tailwind)
- AI integration uses client-side API calls (for production, consider using API routes)
- File processing is done entirely client-side for security
- Data is stored in sessionStorage temporarily during analysis

## Security Considerations

⚠️ **Important:** The current implementation uses `NEXT_PUBLIC_OPENAI_API_KEY` which exposes the API key to the client. For production, consider:
1. Using Next.js API routes to proxy OpenAI requests
2. Implementing rate limiting
3. Adding authentication/authorization

## Next Steps

1. Add Excel file support (xlsx parsing)
2. Implement API routes for OpenAI integration
3. Add more comprehensive test coverage
4. Implement data export functionality
5. Add user authentication if needed

