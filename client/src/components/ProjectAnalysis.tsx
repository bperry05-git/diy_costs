import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, Tool, AlertTriangle } from "lucide-react";
import { ProjectAnalysis as AnalysisType } from "../lib/types";

interface ProjectAnalysisProps {
  analysis: AnalysisType;
}

export default function ProjectAnalysis({ analysis }: ProjectAnalysisProps) {
  const [currentStep, setCurrentStep] = useState(0);

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

        {hasInstructions && (
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Step-by-Step Guide</h3>
              <div className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {instructions.length}
              </div>
            </div>

            <div className="min-h-[200px] mb-4">
              <div className="space-y-4">
                {instructions[currentStep]?.tools && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tool className="w-4 h-4" />
                    <span>Tools needed: {instructions[currentStep].tools.join(", ")}</span>
                  </div>
                )}

                {instructions[currentStep]?.estimatedTime && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Estimated time: {instructions[currentStep].estimatedTime}</span>
                  </div>
                )}

                <p className="text-lg">{instructions[currentStep]}</p>

                {instructions[currentStep]?.safetyNotes && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-700">{instructions[currentStep].safetyNotes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={() => setCurrentStep((prev) => Math.min(instructions.length - 1, prev + 1))}
                disabled={currentStep === instructions.length - 1}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        <div>
          <h3 className="font-medium mb-2">Additional Notes</h3>
          <p className="text-muted-foreground">{analysis.notes}</p>
        </div>
      </div>
    </Card>
  );
}
