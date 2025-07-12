import React from 'react';
import { Zap, CheckCircle, TrendingUp, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import UploadArea from '../components/UploadArea';

function SmartFix() {
  const [analysisResults, setAnalysisResults] = React.useState<any>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleAnalysisComplete = (results: any) => {
    setAnalysisResults(results);
    setIsProcessing(false);
  };

  const handleFileUpload = (file: File) => {
    setIsProcessing(true);
    setAnalysisResults(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Zap className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Smart Fix</h1>
          <p className="text-gray-600">Upload your design and let AI detect and fix issues automatically</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Designs Fixed"
          value="1,247"
          description="Designs Fixed"
          icon={<CheckCircle className="w-5 h-5" />}
          color="green"
        />
        <StatsCard
          title="Success Rate"
          value="98.5%"
          description="Success Rate"
          icon={<TrendingUp className="w-5 h-5" />}
          color="blue"
        />
        <StatsCard
          title="Process Time"
          value="2.3s"
          description="Avg. Process Time"
          icon={<Clock className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Design */}
        <UploadArea
          title="Upload Design"
          description="Drag & drop your design file"
          supportedFormats="Supports PNG, JPG, PDF up to 10MB"
          accept="image/*,.pdf"
          onFileUpload={handleFileUpload}
          onAnalysisComplete={handleAnalysisComplete}
        />

        {/* AI Analysis Results */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">AI Analysis Results</h3>
          
          {!analysisResults && !isProcessing ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                <Zap className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm text-center">Upload a design to see AI suggestions</p>
            </div>
          ) : isProcessing ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-sm text-center">AI is analyzing your design...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Overall Score */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Overall Design Score</h4>
                  <span className="text-2xl font-bold text-purple-600">{analysisResults.score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${analysisResults.score}%` }}
                  ></div>
                </div>
              </div>

              {/* Issues Found */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Issues Detected</h4>
                <div className="space-y-2">
                  {analysisResults.issues.map((issue: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                        issue.severity === 'high' ? 'text-red-500' :
                        issue.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 capitalize">{issue.type}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                            issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {issue.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{issue.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Fix Button */}
              <button className="w-full bg-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Apply AI Fixes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* AI Enhancement */}
        <div className={`rounded-xl p-6 ${
          analysisResults ? 'bg-gradient-to-br from-green-50 to-green-100' : 'bg-gradient-to-br from-gray-50 to-gray-100'
        }`}>
          <div className="flex items-center space-x-2 mb-4">
            <Zap className={`w-5 h-5 ${analysisResults ? 'text-green-600' : 'text-gray-600'}`} />
            <h3 className={`font-semibold ${analysisResults ? 'text-green-900' : 'text-gray-900'}`}>AI Enhancement</h3>
          </div>
          
          {!analysisResults ? (
            <>
              <p className="text-gray-800 text-sm mb-4">
                Our AI analyzes your design for contrast, spacing, typography, and visual hierarchy to provide instant improvements.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                  <span>Powered by advanced algorithms</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                  <span>Real-time analysis and feedback</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                  <span>Instant enhancement suggestions</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-green-800 text-sm mb-4">
                Analysis complete! Here are the key improvements we can make:
              </p>
              <div className="space-y-3">
                {analysisResults.suggestions.slice(0, 3).map((suggestion: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-green-700">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
              
              {/* Improvement Metrics */}
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-green-900 text-sm">Improvement Areas:</h4>
                {Object.entries(analysisResults.improvements).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-green-700 capitalize">{key}</span>
                    <span className="text-green-900 font-medium">{value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-6">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: 1, title: 'Upload Design', description: 'Drag & drop your file' },
            { step: 2, title: 'AI Analysis', description: 'Detect design issues' },
            { step: 3, title: 'Apply Fixes', description: 'Enhance automatically' },
            { step: 4, title: 'Download', description: 'Get improved design' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm mb-3 mx-auto">
                {item.step}
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SmartFix;