import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, Wrench, AlertTriangle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProjectAnalysis as AnalysisType, Instruction } from "../lib/types";

interface ProjectAnalysisProps {
  analysis: AnalysisType;
}

const DIFFICULTY_LABELS = {
  1: "Beginner",
  2: "Easy",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

const DIFFICULTY_DESCRIPTIONS = {
  1: "Perfect for first-time DIYers. Basic tools and minimal experience required.",
  2: "Simple project with straightforward steps. Some basic DIY experience helpful.",
  3: "Requires moderate skill level and familiarity with tools and techniques.",
  4: "Complex project requiring significant experience and specialized skills.",
  5: "Expert-level project demanding advanced expertise and professional-grade tools.",
};

export default function ProjectAnalysis({ analysis }: ProjectAnalysisProps) {
  const difficultyLabel = DIFFICULTY_LABELS[analysis.difficulty as keyof typeof DIFFICULTY_LABELS] || "Unknown";
  const instructions = analysis.instructions || [];
  const hasInstructions = instructions.length > 0;

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Project Analysis</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-secondary/50 rounded-lg">
            <h3 className="font-medium mb-2">Total Cost Estimate</h3>
            <p className="text-lg">${analysis.estimatedCost}</p>
          </div>

          <div className="p-4 bg-secondary/50 rounded-lg">
            <h3 className="font-medium mb-2">Estimated Time</h3>
            <p className="text-lg">{analysis.estimatedTime} hours</p>
          </div>

          <div className="p-4 bg-secondary/50 rounded-lg">
            <h3 className="font-medium mb-2">Difficulty Level</h3>
            <p className="text-lg">{difficultyLabel}</p>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.requiredSkills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-secondary rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        

        <div>
          <h3 className="font-medium mb-2">Additional Notes</h3>
          <p className="text-muted-foreground whitespace-pre-line">{analysis.notes}</p>
        </div>
      </div>
    </Card>
  );
}
