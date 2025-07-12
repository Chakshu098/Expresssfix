import React, { useState } from 'react';
import { Download, FileText, Image, Share2, CheckCircle } from 'lucide-react';

function Export() {
  const [selectedFormat, setSelectedFormat] = useState('PNG');
  const [selectedQuality, setSelectedQuality] = useState('High (300 DPI)');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const exportFormats = [
    { name: 'PNG', description: 'High quality with transparency', icon: Image },
    { name: 'JPG', description: 'Compressed for web use', icon: Image },
    { name: 'PDF', description: 'Vector format for print', icon: FileText },
    { name: 'SVG', description: 'Scalable vector graphics', icon: FileText }
  ];

  const qualityOptions = [
    { name: 'High (300 DPI)', size: '~2.5 MB' },
    { name: 'Medium (150 DPI)', size: '~500KB-1MB' },
    { name: 'Web (72 DPI)', size: '~100-300KB' }
  ];

  const recentExports = [
    { name: 'landing-page-v2.png', time: '2 hours ago', size: '2.1 MB' },
    { name: 'brand-mockup.pdf', time: 'Yesterday', size: '1.8 MB' },
    { name: 'hero-section.jpg', time: '3 days ago', size: '645 KB' }
  ];

  const handleDownload = async () => {
    setIsDownloading(true);
    
    // Simulate download process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create a mock download
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a sample design
      ctx.fillStyle = '#8B5CF6';
      ctx.fillRect(0, 0, 800, 600);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '48px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('ExpressFix Enhanced Design', 400, 300);
      ctx.font = '24px Inter';
      ctx.fillText('AI-Powered Design Enhancement', 400, 350);
    }
    
    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `enhanced-design.${selectedFormat.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });
    
    setIsDownloading(false);
    setDownloadComplete(true);
    setTimeout(() => setDownloadComplete(false), 3000);
  };

  const handleShareLink = async () => {
    const shareUrl = 'https://expressfix.app/shared/enhanced-design-123';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Enhanced Design - ExpressFix',
          text: 'Check out my AI-enhanced design!',
          url: shareUrl,
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareUrl);
        alert('Share link copied to clipboard!');
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Download className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Export</h1>
          <p className="text-gray-600">Download your enhanced design in various formats</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Format */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Export Format</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {exportFormats.map((format) => {
              const Icon = format.icon;
              return (
                <button
                  key={format.name}
                  onClick={() => setSelectedFormat(format.name)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    selectedFormat === format.name
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">{format.name}</span>
                  </div>
                  <p className="text-xs text-gray-600">{format.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Preview</h3>
          
          <div className="border-2 border-dashed border-gray-200 rounded-lg h-40 flex flex-col items-center justify-center text-gray-500 mb-4">
            <FileText className="w-12 h-12 text-gray-300 mb-2" />
            <p className="text-sm">Design preview will appear here</p>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Format:</span>
              <span className="text-gray-900 font-medium">{selectedFormat}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Quality:</span>
              <span className="text-gray-900 font-medium">High (300 DPI)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Est. Size:</span>
              <span className="text-gray-900 font-medium">~2.5 MB</span>
            </div>
          </div>
        </div>

        {/* Ready to Export */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
          <h3 className="font-semibold text-purple-900 mb-4">Ready to Export</h3>
          
          <p className="text-purple-800 text-sm mb-4">
            Your enhanced design is ready for download with all AI improvements applied.
          </p>
          
          <div className="space-y-3">
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full bg-purple-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-purple-700 disabled:bg-purple-400 transition-colors flex items-center justify-center space-x-2"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Downloading...</span>
                </>
              ) : downloadComplete ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Now</span>
                </>
              )}
            </button>
            
            <button 
              onClick={handleShareLink}
              className="w-full bg-purple-100 text-purple-700 font-medium py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors flex items-center justify-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Link</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quality Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quality Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {qualityOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedQuality(option.name)}
              className={`p-4 border rounded-lg text-left transition-colors ${
                selectedQuality === option.name
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <input
                  type="radio"
                  checked={selectedQuality === option.name}
                  onChange={() => setSelectedQuality(option.name)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span className="font-medium text-gray-900">{option.name}</span>
              </div>
              <p className="text-sm text-gray-600">{option.size}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Exports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Exports</h3>
        
        <div className="space-y-3">
          {recentExports.map((export_, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{export_.name}</p>
                  <p className="text-sm text-gray-600">{export_.time} • {export_.size}</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Export;