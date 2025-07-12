import React from 'react';
import { Shield, Upload, FileText, CheckCircle, AlertTriangle, ArrowRight, Palette, Type, Image } from 'lucide-react';
import UploadArea from '../components/UploadArea';

function BrandChecker() {
  const [brandGuidelines, setBrandGuidelines] = React.useState<File | null>(null);
  const [designFile, setDesignFile] = React.useState<File | null>(null);
  const [complianceResults, setComplianceResults] = React.useState<any>(null);
  const [isChecking, setIsChecking] = React.useState(false);
  const [brandGuidelinesData, setBrandGuidelinesData] = React.useState<any>(null);

  const simulateBrandCheck = async () => {
    setIsChecking(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const mockResults = {
      overallScore: 78,
      brandData: {
        colors: ['#8B5CF6', '#6366F1', '#EC4899', '#10B981'],
        fonts: ['Inter', 'Roboto', 'Open Sans'],
        logoSpecs: { minSize: '24px', clearSpace: '16px' }
      },
      checks: [
        { category: 'Color Palette', score: 85, status: 'good', message: 'Brand colors used correctly' },
        { category: 'Typography', score: 65, status: 'warning', message: 'Font hierarchy needs adjustment' },
        { category: 'Logo Usage', score: 90, status: 'good', message: 'Logo placement and sizing correct' },
        { category: 'Spacing', score: 70, status: 'warning', message: 'Some inconsistent spacing detected' },
        { category: 'Contrast', score: 95, status: 'good', message: 'Excellent contrast ratios' },
        { category: 'Layout', score: 60, status: 'error', message: 'Grid system not followed' }
      ]
    };
    
    setComplianceResults(mockResults);
    setIsChecking(false);
  };

  const simulateBrandGuidelines = async (file: File) => {
    // Simulate parsing brand guidelines
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockBrandData = {
      brandName: 'ExpressFix',
      colors: {
        primary: '#8B5CF6',
        secondary: '#6366F1',
        accent: '#EC4899',
        success: '#10B981',
        neutral: '#6B7280'
      },
      typography: {
        primary: 'Inter',
        secondary: 'Roboto',
        sizes: {
          h1: '32px',
          h2: '24px',
          h3: '20px',
          body: '16px'
        }
      },
      logo: {
        minSize: '24px',
        clearSpace: '16px',
        variations: ['Full Color', 'Monochrome', 'White']
      },
      spacing: {
        base: '8px',
        sections: '24px',
        components: '16px'
      }
    };
    
    setBrandGuidelinesData(mockBrandData);
  };

  React.useEffect(() => {
    if (brandGuidelines && designFile && !isChecking && !complianceResults) {
      simulateBrandCheck();
    }
  }, [brandGuidelines, designFile]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Shield className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brand Checker</h1>
          <p className="text-gray-600">Ensure your design matches brand guidelines perfectly</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand Guidelines Upload */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Brand Guidelines</h3>
            </div>
            
            <UploadArea
              title="Upload Guidelines"
              description="Upload brand guidelines file"
              supportedFormats="JSON, PDF format"
              accept=".json,.pdf"
              onFileUpload={(file) => {
                setBrandGuidelines(file);
                setComplianceResults(null);
                simulateBrandGuidelines(file);
              }}
            />
            
            {/* Brand Guidelines Display */}
            {brandGuidelinesData && (
              <div className="mt-6 space-y-4">
                <h4 className="font-medium text-gray-900">Brand Guidelines Summary</h4>
                
                {/* Colors */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Palette className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Brand Colors</span>
                  </div>
                  <div className="flex space-x-2">
                    {Object.entries(brandGuidelinesData.colors).map(([name, color]: [string, any]) => (
                      <div key={name} className="text-center">
                        <div 
                          className="w-8 h-8 rounded-lg border border-gray-200 mb-1"
                          style={{ backgroundColor: color }}
                        ></div>
                        <span className="text-xs text-gray-600 capitalize">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Typography */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Type className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Typography</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Primary Font:</span>
                      <span className="font-medium">{brandGuidelinesData.typography.primary}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Secondary Font:</span>
                      <span className="font-medium">{brandGuidelinesData.typography.secondary}</span>
                    </div>
                  </div>
                </div>
                
                {/* Logo Specs */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Image className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Logo Specifications</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Minimum Size:</span>
                      <span className="font-medium">{brandGuidelinesData.logo.minSize}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Clear Space:</span>
                      <span className="font-medium">{brandGuidelinesData.logo.clearSpace}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Design File Upload */}
          <UploadArea
            title="Design File"
            description="Upload design to check"
            supportedFormats="PNG, JPG, PDF"
            accept="image/*,.pdf"
            onFileUpload={(file) => {
              setDesignFile(file);
              setComplianceResults(null);
            }}
          />
        </div>

        {/* Brand Compliance Check */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Brand Compliance Check</h3>
          
          {!brandGuidelines || !designFile ? (
            <div className="flex flex-col items-center justify-center h-60 text-gray-500">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-center text-sm">
                Upload both brand guidelines and design to start checking
              </p>
            </div>
          ) : isChecking ? (
            <div className="flex flex-col items-center justify-center h-60 text-gray-500">
              <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-center text-sm">
                Checking brand compliance...
              </p>
            </div>
          ) : complianceResults ? (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Brand Compliance Score</h4>
                  <span className="text-2xl font-bold text-purple-600">{complianceResults.overallScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${complianceResults.overallScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="space-y-3">
                {complianceResults.checks.map((check: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {check.status === 'good' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : check.status === 'warning' ? (
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">{check.category}</h4>
                        <p className="text-sm text-gray-600">{check.message}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">{check.score}%</span>
                      <span className={`block text-xs px-2 py-1 rounded-full ${
                        check.status === 'good' ? 'bg-green-100 text-green-700' :
                        check.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {check.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button className="w-full bg-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Fix Brand Issues</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Brand Compliance Features */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-6">What We Check</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Color Palette',
              description: 'Verify brand colors are used correctly',
              icon: '🎨'
            },
            {
              title: 'Typography',
              description: 'Check font families and hierarchy',
              icon: '✍️'
            },
            {
              title: 'Logo Usage',
              description: 'Ensure proper logo placement and sizing',
              icon: '🏷️'
            },
            {
              title: 'Spacing',
              description: 'Validate consistent spacing guidelines',
              icon: '📏'
            },
            {
              title: 'Contrast',
              description: 'Check accessibility and readability',
              icon: '🔍'
            },
            {
              title: 'Layout',
              description: 'Verify grid system and alignment',
              icon: '⚡'
            }
          ].map((feature, index) => (
            <div key={index} className="text-center p-4 rounded-lg bg-gray-50">
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h4 className="font-medium text-gray-900 mb-1">{feature.title}</h4>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BrandChecker;