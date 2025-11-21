import '../styles/globals.css'

export const metadata = {
  title: 'Data Quality Analysis Platform',
  description: 'AI-powered data quality analysis and insights',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

