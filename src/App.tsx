import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SmartFix from './pages/SmartFix';
import BrandChecker from './pages/BrandChecker';
import TypographyGuide from './pages/TypographyGuide';
import AISuggestions from './pages/AISuggestions';
import Export from './pages/Export';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<SmartFix />} />
          <Route path="/smart-fix" element={<SmartFix />} />
          <Route path="/brand-checker" element={<BrandChecker />} />
          <Route path="/typography-guide" element={<TypographyGuide />} />
          <Route path="/ai-suggestions" element={<AISuggestions />} />
          <Route path="/export" element={<Export />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;