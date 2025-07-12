import React from 'react';
import { Sparkles, ArrowRight, TrendingUp, Upload } from 'lucide-react';
import UploadArea from '../components/UploadArea';

function AISuggestions() {
  const [uploadedDesign, setUploadedDesign] = React.useState<File | null>(null);
  const [suggestions, setSuggestions] = React.useState<any>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState('Layout');

  const suggestionCategories = [
    { name: 'Layout' },
    { name: 'Colors' },
    { name: 'Spacing' },
    { name: 'Content' }
  ];

  const generateSuggestions = async (file: File) => {
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const mockSuggestions = {
      Layout: [
        {
          title: 'Grid Alignment',
          description: 'Align elements to a consistent 12-column grid system',
          impact: 'high',
          effort: 'medium'
        },
        {
          title: 'Visual Balance',
          description: 'Redistribute elements for better visual weight distribution',
          impact: 'medium',
          effort: 'low'
        },
        {
          title: 'Content Hierarchy',
          description: 'Restructure layout to improve information flow',
          impact: 'high',
          effort: 'high'
        }
      ],
      Colors: [
        {
          title: 'Color Harmony',
          description: 'Adjust color palette for better visual harmony',
          impact: 'high',
          effort: 'low'
        },
        {
          title: 'Contrast Enhancement',
          description: 'Improve text contrast for better accessibility',
          impact: 'high',
          effort: 'medium'
        }
      ],
      Spacing: [
        {
          title: 'Consistent Margins',
          description: 'Apply consistent spacing throughout the design',
          impact: 'medium',
          effort: 'low'
        },
        {
          title: 'White Space Optimization',
          description: 'Better use of white space for improved readability',
          impact: 'medium',
          effort: 'medium'
        }
      ],
      Content: [
        {
          title: 'Content Prioritization',
          description: 'Reorganize content based on importance',
          impact: 'high',
          effort: 'high'
        },
        {
          title: 'Call-to-Action Placement',
          description: 'Optimize CTA positioning for better conversion',
          impact: 'high',
          effort: 'medium'
        }
      ]
    };
    
    setSuggestions(mockSuggestions);
    setIsGenerating(false);
  };

  const handleFileUpload = (file: File) => {
    setUploadedDesign(file);
    setSuggestions(null);
    generateSuggestions(file);
  };

  const currentSuggestions = suggestions ? suggestions[activeCategory] || [] : [];

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Sparkles className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Suggestions</h1>
          <p className="text-gray-600">Get intelligent recommendations to enhance your design automatically</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Design */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Upload className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Upload Design</h3>
          </div>
          
          <UploadArea
            title="Design File"
            description="Upload your design for AI suggestions"
            supportedFormats="PNG, JPG, PDF"
            accept="image/*,.pdf"
            onFileUpload={handleFileUpload}
          />
        </div>

        {/* Suggestion Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Suggestion Categories</h3>
          
          <div className="space-y-3">
            {suggestionCategories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategoryClick(category.name)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === category.name 
                    ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-500' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{category.name}</span>
                  {suggestions && suggestions[category.name] && (
                    <span className="ml-auto bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                      {suggestions[category.name].length}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Category Suggestions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">{activeCategory} Suggestions</h3>
          
          {!uploadedDesign ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                <Sparkles className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm text-center">Upload a design to get AI suggestions</p>
            </div>
          ) : isGenerating ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-sm text-center">Generating AI suggestions...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentSuggestions.map((suggestion: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                    <div className="flex space-x-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        suggestion.impact === 'high' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {suggestion.impact} impact
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        suggestion.effort === 'low' 
                          ? 'bg-green-100 text-green-700' 
                          : suggestion.effort === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {suggestion.effort} effort
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1">
                    <span>Apply Suggestion</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Insights */}
        <div className={`rounded-xl p-6 ${
          suggestions ? 'bg-gradient-to-br from-green-50 to-green-100' : 'bg-gradient-to-br from-gray-50 to-gray-100'
        }`}>
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className={`w-5 h-5 ${suggestions ? 'text-green-600' : 'text-gray-600'}`} />
            <h3 className={`font-semibold ${suggestions ? 'text-green-900' : 'text-gray-900'}`}>AI Insights</h3>
          </div>
          
          {!suggestions ? (
            <div className="space-y-4">
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-gray-800 text-sm mb-3">
                  Upload a design to get AI-powered suggestions for layout, colors, spacing, and content improvements.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-green-800 text-sm mb-3">
                  Our AI has analyzed your design and identified key areas for improvement based on current design trends and best practices.
                </p>
                
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-green-700 font-medium">Overall Score: </span>
                    <span className="text-green-900 font-bold">78%</span>
                  </div>
                  <div className="text-sm text-green-700">Score average compared to similar designs</div>
                </div>
              </div>

              <button className="w-full bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                Apply All Suggestions
              </button>

              {/* Quick Stats */}
              <div className="mt-6 space-y-3">
                <h4 className="font-medium text-green-900">Quick Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Total Suggestions</span>
                    <span className="text-green-900 font-medium">
                      {Object.values(suggestions).reduce((total: number, categoryItems: any) => total + categoryItems.length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">High Impact</span>
                    <span className="text-green-900 font-medium">
                      {Object.values(suggestions).flat().filter((item: any) => item.impact === 'high').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Est. Time</span>
                    <span className="text-green-900 font-medium">15 min</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AISuggestions;