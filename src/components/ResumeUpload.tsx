import React, { useState } from 'react';
import { Upload, FileWarning, CheckCircle } from 'lucide-react';
import { ConfirmationDialog } from './ConfirmationDialog';
import { parseResume } from '../services/resumeParser';
import { analyzeCareerPath } from '../services/careerAnalyzer';
import { ParsedResume, AnalysisResult } from '../types';

type UploadStatus = 'idle' | 'uploading' | 'parsing' | 'confirming' | 'complete';

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError('');
    
    if (!selectedFile) return;
    
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        .includes(selectedFile.type)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      setStatus('uploading');
      
      // Parse resume
      const parsedResume = await parseResume(file);
      
      // Analyze career paths
      const suggestions = analyzeCareerPath(parsedResume);
      
      setAnalysisResult({ parsedResume, suggestions });
      setStatus('confirming');
    } catch (err) {
      setError('Error processing resume. Please try again.');
      setStatus('idle');
    }
  };

  const handleConfirmation = (confirmedData: ParsedResume) => {
    if (analysisResult) {
      const suggestions = analyzeCareerPath(confirmedData);
      setAnalysisResult({ parsedResume: confirmedData, suggestions });
      setStatus('complete');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Resume Analysis</h1>
        <p className="mt-2 text-gray-600">Upload your resume for personalized career mapping</p>
      </div>

      <form onSubmit={handleUpload} className="space-y-6">
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 transition-colors">
          <input
            type="file"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".pdf,.docx"
          />
          <div className="text-center space-y-4">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="text-gray-600">
              <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
            </div>
            <p className="text-sm text-gray-500">PDF or DOCX (max. 5MB)</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600">
            <FileWarning className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {file && !error && (
          <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-gray-700">{file.name}</span>
            </div>
            <span className="text-sm text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)}MB
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={!file || !!error || status === 'uploading'}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors
            ${!file || !!error || status === 'uploading'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {status === 'uploading' ? 'Processing...' : 'Analyze Resume'}
        </button>
      </form>

      {status === 'confirming' && analysisResult && (
        <ConfirmationDialog
          data={analysisResult.parsedResume}
          onConfirm={handleConfirmation}
          onCancel={() => setStatus('idle')}
        />
      )}

      {status === 'complete' && analysisResult && (
        <div className="mt-8 space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Career Path Analysis</h2>
            <div className="space-y-4">
              {analysisResult.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    suggestion.confidence > 80
                      ? 'bg-blue-50'
                      : suggestion.confidence > 60
                      ? 'bg-green-50'
                      : 'bg-yellow-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900">{suggestion.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      suggestion.confidence > 80
                        ? 'bg-blue-100 text-blue-800'
                        : suggestion.confidence > 60
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {suggestion.confidence}% Match
                    </span>
                  </div>
                  <p className="text-gray-700 mt-2">{suggestion.description}</p>
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">Matched Skills:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {suggestion.matchedSkills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-1 bg-white rounded-full text-sm text-gray-600 border border-gray-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}