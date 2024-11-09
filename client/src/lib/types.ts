export interface Material {
  name: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
}

export interface ProjectAnalysis {
  difficulty: number;
  estimatedTime: number;
  estimatedCost: number;
  requiredSkills: string[];
  notes: string;
  materials: Material[];
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
