export interface ParsedResume {
  email: string;
  phone: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
  }[];
  education: {
    degree: string;
    school: string;
  }[];
  rawText: string;
}

export interface CareerSuggestion {
  title: string;
  confidence: number;
  matchedSkills: string[];
  description: string;
}

export interface AnalysisResult {
  parsedResume: ParsedResume;
  suggestions: CareerSuggestion[];
}