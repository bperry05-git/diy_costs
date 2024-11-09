import { Step } from "../lib/types";
import { Card } from "@/components/ui/card";
import { Clock, Tool, Lightbulb } from "lucide-react";

interface StepByStepGuideProps {
  steps: Step[];
}

export default function StepByStepGuide({ steps }: StepByStepGuideProps) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Step-by-Step Guide</h2>
      <div className="space-y-8">
        {steps.map((step, index) => (
          <div
            key={`step-${index}`}
            className="relative pl-8 border-l-2 border-accent last:border-l-0"
          >
            <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-accent flex items-center justify-center text-sm font-medium text-white">
              {index + 1}
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-medium">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              
              {step.imageUrl && (
                <img
                  src={step.imageUrl}
                  alt={`Step ${index + 1}: ${step.title}`}
                  className="rounded-lg w-full max-w-2xl mx-auto my-4"
                />
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {step.estimatedTime && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Estimated time: {step.estimatedTime} minutes</span>
                  </div>
                )}
                
                {step.requiredMaterials && step.requiredMaterials.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Tool className="w-4 h-4" />
                      <span>Materials needed:</span>
                    </div>
                    <ul className="list-disc list-inside text-sm text-muted-foreground pl-4">
                      {step.requiredMaterials.map((material, idx) => (
                        <li key={idx}>{material}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {step.tips && step.tips.length > 0 && (
                <div className="mt-4 bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 font-medium">
                    <Lightbulb className="w-4 h-4 text-accent" />
                    <span>Pro Tips:</span>
                  </div>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {step.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
