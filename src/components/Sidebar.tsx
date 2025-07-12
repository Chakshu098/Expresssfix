import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Zap,
  Shield,
  Type,
  Sparkles,
  Download,
  Settings,
  HelpCircle,
  TrendingUp,
  User
} from 'lucide-react';

function Sidebar() {
  const location = useLocation();

  const mainTools = [
    { name: 'Smart Fix', icon: Zap, path: '/smart-fix' },
    { name: 'Brand Checker', icon: Shield, path: '/brand-checker' },
    { name: 'Typography Guide', icon: Type, path: '/typography-guide' },
    { name: 'AI Suggestions', icon: Sparkles, path: '/ai-suggestions' },
    { name: 'Export', icon: Download, path: '/export' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || (path === '/smart-fix' && location.pathname === '/');
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <img src="/Express.png" alt="ExpressFix Logo" className="w-8 h-8 rounded-lg" />
          <div>
            <div className="font-bold text-lg">ExpressFix</div>
            <div className="text-gray-400 text-sm">AI Design Platform</div>
          </div>
        </div>
      </div>

      {/* Main Tools */}
      <div className="flex-1 p-4">
        <div className="mb-6">
          <h3 className="text-gray-400 text-sm font-medium mb-3 uppercase tracking-wider">
            Main Tools
          </h3>
          <nav className="space-y-2">
            {mainTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.name}
                  to={tool.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(tool.path)
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tool.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Progress Section */}
        <div className="mb-6">
          <h3 className="text-gray-400 text-sm font-medium mb-3 uppercase tracking-wider">
            Today's Progress
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Designs Fixed</span>
              <span className="text-white font-medium">12</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">AI Suggestions</span>
              <span className="text-white font-medium">24</span>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              75% of daily goal completed
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-700">
        <nav className="space-y-2">
          <Link
            to="/settings"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
          <Link
            to="/help"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            <span>Help</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;