import { Card } from "@/components/ui/card";
import { ProjectAnalysis as AnalysisType } from "../lib/types";

interface ProjectAnalysisProps {
  analysis: AnalysisType;
}

export default function ProjectAnalysis({ analysis }: ProjectAnalysisProps) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Project Analysis</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Total Cost Estimate</h3>
          <p className="text-lg">${analysis.estimatedCost}</p>
        </div>

        <div>
          <h3 className="font-medium mb-2">Estimated Time</h3>
          <p className="text-lg">{analysis.estimatedTime} hours</p>
        </div>

        <div>
          <h3 className="font-medium mb-2">Difficulty Level</h3>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full ${
                  i < analysis.difficulty
                    ? "bg-accent"
                    : "bg-muted"
                }`}
              />
            ))}
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
          <h3 className="font-medium mb-2">Notes</h3>
          <p className="text-muted-foreground">{analysis.notes}</p>
        </div>

        {analysis.instructions && (
          <div>
            <h3 className="font-medium mb-2">Instructions</h3>
            <ul className="list-disc pl-5 space-y-2">
              {analysis.instructions.map((instruction, index) => (
                <li key={index} className="text-muted-foreground">
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
