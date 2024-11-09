import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProjectAnalysis as AnalysisType } from "../lib/types";
import { HelpCircle } from "lucide-react";

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
  1: "Perfect for first-time DIYers. Basic tools and minimal expertise required.",
  2: "Simple project with straightforward steps. Some basic DIY experience helpful.",
  3: "Moderate complexity requiring some specific skills and tools.",
  4: "Complex project requiring significant experience and specialized tools.",
  5: "Expert-level project demanding extensive knowledge and advanced techniques.",
};

export default function ProjectAnalysis({ analysis }: ProjectAnalysisProps) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Project Analysis</h2>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium">Difficulty Level</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    {DIFFICULTY_DESCRIPTIONS[analysis.difficulty as keyof typeof DIFFICULTY_DESCRIPTIONS]}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full transition-colors ${
                    i < analysis.difficulty
                      ? "bg-accent"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {DIFFICULTY_LABELS[analysis.difficulty as keyof typeof DIFFICULTY_LABELS]}
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Estimated Time</h3>
          <p className="text-lg">
            {analysis.estimatedTime} hours
          </p>
        </div>

        <div>
          <h3 className="font-medium mb-2">Total Cost Estimate</h3>
          <p className="text-lg">${analysis.estimatedCost}</p>
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
          <h3 className="font-medium mb-2">Notes</h3>
          <p className="text-muted-foreground">{analysis.notes}</p>
        </div>
      </div>
    </Card>
  );
}
