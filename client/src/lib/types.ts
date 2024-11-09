export interface Material {
  item: string;
  quantity: string;
  cost: string;
}

export interface ProjectAnalysis {
  difficulty: number;
  estimatedTime: number;
  estimatedCost: number;
  requiredSkills: string[];
  notes: string;
  materialsList: Material[];
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
