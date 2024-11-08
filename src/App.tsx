import React from 'react';
import { FileText } from 'lucide-react';
import ResumeUpload from './components/ResumeUpload';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Career Mapper</span>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="py-12">
        <ResumeUpload />
      </main>
    </div>
  );
}

export default App;