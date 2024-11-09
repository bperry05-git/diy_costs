export interface Material {
  item: string;
  quantity: string;
  cost: string;
}

export interface Step {
  title: string;
  description: string;
  imageUrl?: string;
  tips?: string[];
  estimatedTime?: number;
  requiredMaterials?: string[];
}

export interface ProjectGuide {
  id: number;
  projectId: number;
  steps: Step[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectAnalysis {
  difficulty: number;
  estimatedTime: number;
  estimatedCost: number;
  requiredSkills: string[];
  notes: string;
  materialsList: Material[];
  guide?: Step[];
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
