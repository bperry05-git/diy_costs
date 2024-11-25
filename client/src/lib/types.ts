export interface Material {
  item: string;
  category?: string;
  quantity: string;
  cost: string;
  specifications?: string;
  recommendedBrands?: string[];
  alternativeOptions?: string[];
  whereToBuy?: string[];
  usageInstructions?: string;
  importantNotes?: string;
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
export interface Product {
  title: string;
  price: string;
  link: string;
  thumbnail: string;
  rating?: number;
  reviews?: number;
  store: string;
}
