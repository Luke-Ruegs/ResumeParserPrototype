import { ParsedResume } from '../types';

// Common patterns to extract information
const PATTERNS = {
  email: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi,
  phone: /(\+?1?\s*\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/g,
  skills: [
    'javascript', 'typescript', 'python', 'java', 'c++', 'ruby', 'php',
    'react', 'angular', 'vue', 'node', 'express', 'django', 'flask',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd',
    'machine learning', 'ai', 'data science', 'analytics'
  ],
  jobTitles: [
    'engineer', 'developer', 'architect', 'manager', 'lead', 'director',
    'consultant', 'analyst', 'specialist', 'administrator'
  ]
};

export async function parseResume(file: File): Promise<ParsedResume> {
  const text = await extractTextFromFile(file);
  
  // Extract basic information
  const email = extractPattern(text, PATTERNS.email)[0] || '';
  const phone = extractPattern(text, PATTERNS.phone)[0] || '';
  
  // Extract skills
  const skills = PATTERNS.skills.filter(skill => 
    new RegExp(`\\b${skill}\\b`, 'i').test(text)
  );

  // Extract experience
  const experience = extractExperience(text);

  // Extract education
  const education = extractEducation(text);

  return {
    email,
    phone,
    skills,
    experience,
    education,
    rawText: text
  };
}

async function extractTextFromFile(file: File): Promise<string> {
  // For now, we'll simulate text extraction
  // In a real implementation, you'd use libraries like pdf.js or mammoth for DOCX
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Simulate extracted text
      resolve(`
        John Doe
        john.doe@example.com
        (123) 456-7890
        
        Senior Software Engineer with expertise in React, Node.js, and TypeScript.
        
        Experience:
        Senior Developer at Tech Corp (2020-2023)
        - Led team of 5 developers
        - Implemented CI/CD pipeline
        
        Education:
        B.S. Computer Science, University of Technology
      `);
    };
    reader.readAsText(file);
  });
}

function extractPattern(text: string, pattern: RegExp | string[]): string[] {
  if (pattern instanceof RegExp) {
    return Array.from(text.matchAll(pattern), m => m[0]);
  }
  return pattern.filter(p => new RegExp(`\\b${p}\\b`, 'i').test(text));
}

function extractExperience(text: string): { title: string; company: string; duration: string }[] {
  // In a real implementation, you'd use more sophisticated NLP
  // This is a simplified version
  return [{
    title: 'Senior Developer',
    company: 'Tech Corp',
    duration: '2020-2023'
  }];
}

function extractEducation(text: string): { degree: string; school: string }[] {
  // Simplified education extraction
  return [{
    degree: 'B.S. Computer Science',
    school: 'University of Technology'
  }];
}