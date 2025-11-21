'use client'

import { useState, useRef } from 'react'
import { processFile } from '@/lib/fileProcessing'
import '../styles/FileUpload.css'

export default function FileUpload({ onFileProcessed, isProcessing, setIsProcessing }) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const maxFileSize = process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB 
    ? parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB) * 1024 * 1024 
    : 50 * 1024 * 1024

  const supportedFormats = process.env.NEXT_PUBLIC_SUPPORTED_FORMATS 
    ? process.env.NEXT_PUBLIC_SUPPORTED_FORMATS.split(',')
    : ['csv', 'json', 'xlsx']

  const validateFile = (file) => {
    if (!file) {
      setError('Please select a file')
      return false
    }

    if (file.size > maxFileSize) {
      setError(`File size exceeds ${maxFileSize / (1024 * 1024)}MB limit`)
      return false
    }

    const extension = file.name.split('.').pop().toLowerCase()
    if (!supportedFormats.includes(extension)) {
      setError(`Unsupported file format. Supported: ${supportedFormats.join(', ')}`)
      return false
    }

    return true
  }

  const handleFile = async (file) => {
    if (!validateFile(file)) {
      return
    }

    setError(null)
    setIsProcessing(true)

    try {
      const analysisData = await processFile(file)
      onFileProcessed(analysisData)
    } catch (err) {
      console.error('Error processing file:', err)
      setError(err.message || 'Failed to process file. Please try again.')
      setIsProcessing(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="file-upload">
      <div
        className={`upload-zone ${dragActive ? 'drag-active' : ''} ${isProcessing ? 'processing' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="File upload area"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleButtonClick()
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={supportedFormats.map(f => `.${f}`).join(',')}
          onChange={handleChange}
          disabled={isProcessing}
          className="file-input"
          aria-label="Select file to upload"
        />

        {isProcessing ? (
          <div className="upload-content">
            <div className="spinner" aria-label="Processing file"></div>
            <p>Processing file...</p>
          </div>
        ) : (
          <div className="upload-content">
            <svg
              className="upload-icon"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="upload-text">Drag & Drop File Here</p>
            <p className="upload-subtext">or</p>
            <button
              type="button"
              onClick={handleButtonClick}
              className="upload-button"
              disabled={isProcessing}
            >
              Choose File
            </button>
            <p className="upload-hint">
              Supported: {supportedFormats.map(f => f.toUpperCase()).join(', ')} (max {maxFileSize / (1024 * 1024)}MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}

