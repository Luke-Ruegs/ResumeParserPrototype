import { ParsedResume, CareerSuggestion } from '../types';

// Career path definitions with required skills and experience
const CAREER_PATHS = {
  'Senior Software Architect': {
    requiredSkills: ['javascript', 'typescript', 'aws', 'system design', 'architecture'],
    minYearsExperience: 5,
    weight: 1.5
  },
  'Technical Lead': {
    requiredSkills: ['javascript', 'react', 'node', 'team management'],
    minYearsExperience: 3,
    weight: 1.3
  },
  'Full Stack Developer': {
    requiredSkills: ['javascript', 'react', 'node', 'database'],
    minYearsExperience: 2,
    weight: 1.0
  }
};

export function analyzeCareerPath(resume: ParsedResume): CareerSuggestion[] {
  const suggestions: CareerSuggestion[] = [];
  const skills = new Set(resume.skills.map(s => s.toLowerCase()));

  for (const [path, requirements] of Object.entries(CAREER_PATHS)) {
    const matchedSkills = requirements.requiredSkills.filter(skill => 
      skills.has(skill.toLowerCase())
    );

    const skillMatch = matchedSkills.length / requirements.requiredSkills.length;
    
    if (skillMatch >= 0.6) { // At least 60% skill match
      suggestions.push({
        title: path,
        confidence: Math.round(skillMatch * 100),
        matchedSkills: matchedSkills,
        description: generateDescription(path, skillMatch, matchedSkills)
      });
    }
  }

  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

function generateDescription(path: string, match: number, skills: string[]): string {
  if (match > 0.8) {
    return `Your profile strongly aligns with ${path} roles, particularly due to your expertise in ${skills.join(', ')}.`;
  } else {
    return `You have good potential for ${path} positions, with relevant experience in ${skills.join(', ')}.`;
  }
}