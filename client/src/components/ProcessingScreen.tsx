import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ProcessingScreenProps {
  stage: "uploading" | "analyzing" | "generating";
}

export default function ProcessingScreen({ stage }: ProcessingScreenProps) {
  const stages = {
    uploading: {
      title: "Uploading Project Details",
      description: "Preparing your project information for analysis...",
      progress: 33,
    },
    analyzing: {
      title: "Analyzing Project",
      description: "Our AI is examining your project requirements...",
      progress: 66,
    },
    generating: {
      title: "Generating Recommendations",
      description: "Creating detailed materials list and instructions...",
      progress: 90,
    },
  };

  const currentStage = stages[stage];

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent mb-4" />
          <h3 className="text-xl font-semibold text-center">{currentStage.title}</h3>
          <p className="text-muted-foreground text-center mt-2">
            {currentStage.description}
          </p>
        </div>

        <div className="space-y-2">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-500 ease-in-out"
              style={{ width: `${currentStage.progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Upload</span>
            <span>Analysis</span>
            <span>Complete</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
