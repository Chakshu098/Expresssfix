import React from 'react';
import { Type, AlertTriangle, CheckCircle, Upload, ArrowRight } from 'lucide-react';
import UploadArea from '../components/UploadArea';

function TypographyGuide() {
  const [uploadedDesign, setUploadedDesign] = React.useState<File | null>(null);
  const [typographyAnalysis, setTypographyAnalysis] = React.useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [detectedFonts, setDetectedFonts] = React.useState<any>(null);

  const getDefaultFontHierarchy = () => [
    { level: 'H1', text: 'Sample Text', size: '32px', weight: 'Bold', usage: 'Page headers, main titles', font: 'Inter' },
    { level: 'H2', text: 'Sample Text', size: '24px', weight: 'Semibold', usage: 'Section headers', font: 'Inter' },
    { level: 'H3', text: 'Sample Text', size: '20px', weight: 'Medium', usage: 'Sub-sections', font: 'Inter' },
    { level: 'Body', text: 'Sample Text', size: '16px', weight: 'Regular', usage: 'Main content, paragraphs', font: 'Inter' },
    { level: 'Caption', text: 'Sample Text', size: '14px', weight: 'Regular', usage: 'Supporting text, labels', font: 'Inter' }
  ];

  const getDetectedFontHierarchy = () => {
    if (!detectedFonts) return getDefaultFontHierarchy();
    
    return [
      { level: 'H1', text: detectedFonts.h1?.text || 'Main Heading', size: detectedFonts.h1?.size || '36px', weight: detectedFonts.h1?.weight || 'Bold', usage: 'Page headers, main titles', font: detectedFonts.h1?.font || 'Arial' },
      { level: 'H2', text: detectedFonts.h2?.text || 'Section Header', size: detectedFonts.h2?.size || '28px', weight: detectedFonts.h2?.weight || 'Semibold', usage: 'Section headers', font: detectedFonts.h2?.font || 'Arial' },
      { level: 'H3', text: detectedFonts.h3?.text || 'Sub Header', size: detectedFonts.h3?.size || '22px', weight: detectedFonts.h3?.weight || 'Medium', usage: 'Sub-sections', font: detectedFonts.h3?.font || 'Arial' },
      { level: 'Body', text: detectedFonts.body?.text || 'Body content text example', size: detectedFonts.body?.size || '16px', weight: detectedFonts.body?.weight || 'Regular', usage: 'Main content, paragraphs', font: detectedFonts.body?.font || 'Arial' },
      { level: 'Caption', text: detectedFonts.caption?.text || 'Small caption text', size: detectedFonts.caption?.size || '14px', weight: detectedFonts.caption?.weight || 'Regular', usage: 'Supporting text, labels', font: detectedFonts.caption?.font || 'Arial' }
    ];
  };

  const simulateTypographyAnalysis = async (file: File) => {
    setIsAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate font detection from uploaded design
    const mockDetectedFonts = {
      h1: { text: 'Welcome to Our Platform', size: '38px', weight: 'Bold', font: 'Helvetica' },
      h2: { text: 'Key Features', size: '26px', weight: 'Semibold', font: 'Helvetica' },
      h3: { text: 'Getting Started', size: '20px', weight: 'Medium', font: 'Arial' },
      body: { text: 'This is the main content area where you can read about our services and offerings.', size: '15px', weight: 'Regular', font: 'Arial' },
      caption: { text: 'Last updated: January 2024', size: '13px', weight: 'Regular', font: 'Arial' }
    };
    
    setDetectedFonts(mockDetectedFonts);
    
    const mockAnalysis = {
      overallScore: 74,
      detectedFonts: ['Helvetica', 'Arial', 'Times New Roman'],
      fontConsistency: 65, // Lower because mixing Helvetica and Arial
      results: [
        { metric: 'Font Consistency', status: 'warning', score: 65, message: 'Multiple font families detected (Helvetica, Arial)' },
        { metric: 'Hierarchy Clarity', status: 'warning', score: 70, message: 'Good size progression but could improve weight contrast' },
        { metric: 'Line Height', status: 'good', score: 90, message: 'Optimal line spacing for readability' },
        { metric: 'Letter Spacing', status: 'good', score: 80, message: 'Good letter spacing throughout' },
        { metric: 'Font Size Ratios', status: 'warning', score: 68, message: 'Size ratios could be more consistent' },
        { metric: 'Readability', status: 'good', score: 88, message: 'Good contrast and font choices for readability' }
      ],
      suggestions: [
        'Use a single font family (recommend Inter or Helvetica) for consistency',
        'Increase H1 font weight to create stronger hierarchy',
        'Standardize font sizes using 1.25x scaling ratio',
        'Consider increasing line height for body text to 1.6'
      ]
    };
    
    setTypographyAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const handleFileUpload = (file: File) => {
    setUploadedDesign(file);
    setTypographyAnalysis(null);
    setDetectedFonts(null);
    simulateTypographyAnalysis(file);
  };

  const fontHierarchy = uploadedDesign ? getDetectedFontHierarchy() : getDefaultFontHierarchy();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Type className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Typography Guide</h1>
          <p className="text-gray-600">Improve font hierarchy, alignment, and readability</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Design for Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Upload className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Analyze Typography</h3>
          </div>
          
          <UploadArea
            title="Upload Design"
            description="Upload your design for typography analysis"
            supportedFormats="PNG, JPG, PDF"
            accept="image/*,.pdf"
            onFileUpload={handleFileUpload}
          />
        </div>

        {/* Font Hierarchy */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Type className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">
              {uploadedDesign ? 'Detected Font Hierarchy' : 'Recommended Font Hierarchy'}
            </h3>
          </div>
          
          {uploadedDesign && detectedFonts && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Detected Fonts:</strong> {typographyAnalysis?.detectedFonts?.join(', ') || 'Analyzing...'}
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            {fontHierarchy.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <div 
                    className={`text-gray-900 ${
                      item.level === 'H1' ? 'text-3xl font-bold' :
                      item.level === 'H2' ? 'text-2xl font-semibold' :
                      item.level === 'H3' ? 'text-xl font-medium' :
                      item.level === 'Body' ? 'text-base font-normal' :
                      'text-sm font-normal'
                    }`}
                  >
                    {item.level} - {item.text}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{item.usage}</div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <div>{item.size}</div>
                  <div>{item.weight}</div>
                  {item.font && (
                    <div className="text-xs text-gray-500">{item.font}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h3 className="font-semibold text-gray-900 mb-6">Typography Analysis</h3>
          
          {!uploadedDesign ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                <Type className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm text-center">Upload a design to analyze typography</p>
            </div>
          ) : isAnalyzing ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-sm text-center">Analyzing typography...</p>
            </div>
          ) : typographyAnalysis ? (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Typography Score</h4>
                  <span className="text-2xl font-bold text-purple-600">{typographyAnalysis.overallScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${typographyAnalysis.overallScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {typographyAnalysis.results.map((result: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                    <div className="flex-shrink-0 mt-0.5">
                      {result.status === 'good' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : result.status === 'warning' ? (
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900">{result.metric}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{result.score}%</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            result.status === 'good' 
                              ? 'bg-green-100 text-green-700' 
                              : result.status === 'warning'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {result.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{result.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Suggestions */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Improvement Suggestions</h4>
                <div className="space-y-2">
                  {typographyAnalysis.suggestions.map((suggestion: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full bg-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                <Type className="w-4 h-4" />
                <span>Apply Typography Fixes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Typography Best Practices */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-2 mb-4">
          <Type className="w-5 h-5" />
          <h3 className="font-semibold">Typography Best Practices</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium mb-2">Contrast</h4>
            <p className="text-purple-100 text-sm">
              Ensure a 4.5:1 contrast ratio for body text and 3:1 for large text
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Line Length</h4>
            <p className="text-purple-100 text-sm">
              Keep lines between 45-75 characters for optimal readability
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Hierarchy</h4>
            <p className="text-purple-100 text-sm">
              Use consistent sizing ratios (1.25x, 1.5x, 2x) between heading levels
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TypographyGuide;