import React, { useState } from 'react';
import { Upload, Image, CheckCircle, AlertTriangle } from 'lucide-react';

interface UploadAreaProps {
  title: string;
  description: string;
  supportedFormats: string;
  onFileUpload?: (file: File) => void;
  onAnalysisComplete?: (results: any) => void;
  accept?: string;
}

function UploadArea({ title, description, supportedFormats, onFileUpload, onAnalysisComplete, accept = "image/*,.pdf" }: UploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const simulateAIAnalysis = async (file: File) => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI analysis results
    const mockResults = {
      issues: [
        { type: 'contrast', severity: 'high', message: 'Low contrast detected in text areas' },
        { type: 'alignment', severity: 'medium', message: 'Elements not aligned to grid system' },
        { type: 'spacing', severity: 'low', message: 'Inconsistent padding between sections' },
        { type: 'typography', severity: 'medium', message: 'Font hierarchy needs improvement' }
      ],
      suggestions: [
        'Increase text contrast by 40% for better readability',
        'Align elements to 12-column grid system',
        'Apply consistent 24px spacing between sections',
        'Use larger font sizes for headings'
      ],
      score: 72,
      improvements: {
        contrast: 85,
        alignment: 60,
        spacing: 75,
        typography: 68
      }
    };
    
    setIsAnalyzing(false);
    setAnalysisComplete(true);
    
    if (onAnalysisComplete) {
      onAnalysisComplete(mockResults);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      setUploadedFile(file);
      setAnalysisComplete(false);
      if (onFileUpload) {
        onFileUpload(file);
      }
      // Start AI analysis
      simulateAIAnalysis(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const file = files[0];
      setUploadedFile(file);
      setAnalysisComplete(false);
      if (onFileUpload) {
        onFileUpload(file);
      }
      // Start AI analysis
      simulateAIAnalysis(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setIsAnalyzing(false);
    setAnalysisComplete(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Upload className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-purple-400 bg-purple-50'
            : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {uploadedFile ? (
          <div className="flex flex-col items-center space-y-4">
            <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
              isAnalyzing ? 'bg-blue-100' : analysisComplete ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              {isAnalyzing ? (
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : analysisComplete ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <Image className="w-8 h-8 text-gray-600" />
              )}
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-900">{uploadedFile.name}</p>
              <p className="text-sm text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              {isAnalyzing && (
                <p className="text-sm text-blue-600 mt-1">Analyzing with AI...</p>
              )}
              {analysisComplete && (
                <p className="text-sm text-green-600 mt-1">Analysis complete!</p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={removeFile}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Remove
              </button>
              <label
                htmlFor={`file-upload-${title.replace(/\s+/g, '-').toLowerCase()}`}
                className="px-3 py-1 text-sm text-purple-600 hover:text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors"
              >
                Replace
              </label>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Image className="w-6 h-6 text-purple-600" />
            </div>
            
            <div className="space-y-2">
              <p className="font-medium text-gray-900">{description}</p>
              <p className="text-sm text-gray-500">or click to browse</p>
              <p className="text-xs text-gray-400">{supportedFormats}</p>
            </div>
            
            <label
              htmlFor={`file-upload-${title.replace(/\s+/g, '-').toLowerCase()}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 cursor-pointer transition-colors"
            >
              Choose File
            </label>
          </div>
        )}
        
        <input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          id={`file-upload-${title.replace(/\s+/g, '-').toLowerCase()}`}
        />
      </div>
    </div>
  );
}

export default UploadArea;