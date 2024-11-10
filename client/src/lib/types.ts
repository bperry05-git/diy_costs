export interface Material {
  item: string;
  quantity: string;
  cost: string;
}

export interface Instruction {
  stepNumber: number;
  instruction: string;
  estimatedTime?: string;
  safetyNotes?: string;
  tools?: string[];
}

export interface ProjectAnalysis {
  difficulty: number;
  estimatedTime: number;
  estimatedCost: number;
  requiredSkills: string[];
  notes: string;
  materialsList: Material[];
  instructions?: string[] | Instruction[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  createdAt: string;
}

export interface ProjectWithAnalysis extends Project {
  analysis: ProjectAnalysis;
}
