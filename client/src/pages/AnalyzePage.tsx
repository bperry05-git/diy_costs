import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "../components/ImageUpload";
import ProjectAnalysis from "../components/ProjectAnalysis";
import MaterialsList from "../components/MaterialsList";
import ProcessingScreen from "../components/ProcessingScreen";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { mutate } from "swr";
import type { ProjectAnalysis as ProjectAnalysisType } from "../lib/types";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
}).refine(() => true, {
  message: "Please provide either a description or an image",
});

type FormData = z.infer<typeof formSchema>;

export default function AnalyzePage() {
  const [imageData, setImageData] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<ProjectAnalysisType | null>(null);
  const [processingStage, setProcessingStage] = useState<"uploading" | "analyzing" | "generating" | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleAnalysisError = (error: unknown, response?: Response) => {
    console.error("Analysis failed:", error);
    let errorMessage = "Failed to analyze project. Please try again.";

    if (response?.status === 413) {
      errorMessage = "The image is too large. Please try a smaller image or use the compression feature.";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    toast({
      variant: "destructive",
      title: "Analysis Failed",
      description: errorMessage,
    });
    setProcessingStage(null);
  };

  const onSubmit = async (data: FormData) => {
    console.log("Form submission started with data:", { ...data, hasImage: !!imageData });
    
    if (!data.description && !imageData) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please provide either a description or an image",
      });
      return;
    }

    try {
      setProcessingStage("uploading");
      console.log("Sending request to /api/analyze");
      
      // Simulate upload time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProcessingStage("analyzing");
      
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          image: imageData,
        }),
      });

      console.log("Response status:", response.status);
      
      setProcessingStage("generating");
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Analysis failed");
      }

      console.log("Analysis result:", result);

      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Transform the API response to match our frontend types
      const transformedAnalysis: ProjectAnalysisType = {
        difficulty: result.DifficultyLevel || result.difficulty_level || 1,
        estimatedTime: result.EstimatedTimeHours || result.estimated_time_hours || 0,
        estimatedCost: result.EstimatedCost || 0,
        requiredSkills: result.RequiredSkills || result.required_skills || [],
        notes: (result.ImportantNotesWarnings || result.important_notes_warnings || []).join('\n'),
        materialsList: (result.MaterialsList || result.materials_list || []).map((item: any) => ({
          item: item.Material || item.item || '',
          category: item.Category || item.category || '',
          quantity: item.Quantity || item.quantity || '',
          cost: `$${item.EstimatedCost || item.estimated_cost || 0}`,
          specifications: item.Specifications || item.specifications,
          recommendedBrands: item.RecommendedBrands || item.recommended_brands,
          alternativeOptions: item.AlternativeOptions || item.alternative_options,
          whereToBuy: item.WhereToBuy || item.where_to_buy,
          usageInstructions: item.UsageInstructions || item.usage_instructions,
          importantNotes: item.ImportantNotes || item.important_notes
        })),
        instructions: (result.StepByStepInstructions || []).map((step: any) => ({
          instruction: step.Instruction,
          stepNumber: step.StepNumber,
          estimatedTime: step.EstimatedTime,
          safetyNotes: step.SafetyNotes,
          tools: step.ToolsNeeded
        }))
      };

      setAnalysisData(transformedAnalysis);
      setProcessingStage(null);
      toast({
        title: "Analysis Complete",
        description: "Your project has been analyzed successfully.",
      });
    } catch (error) {
      handleAnalysisError(error);
    }
  };

  const handleSave = async () => {
    if (!analysisData || !form.getValues("title")) return;

    try {
      setIsSaving(true);
      console.log("Saving project with data:", {
        title: form.getValues("title"),
        description: form.getValues("description"),
        hasImage: !!imageData,
      });

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.getValues("title"),
          description: form.getValues("description") || "",
          imageUrl: imageData ? `data:image/jpeg;base64,${imageData}` : null,
          analysis: analysisData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save project");
      }

      await mutate("/api/projects");
      toast({
        title: "Project Saved",
        description: "Your project has been saved successfully.",
      });
    } catch (error) {
      console.error("Save failed:", error);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save project. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (processingStage) {
    return (
      <div className="container mx-auto px-4 py-16">
        <ProcessingScreen stage={processingStage} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Project Analysis</h1>

      <div className="space-y-8">
        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  placeholder="Project Title"
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-destructive text-sm mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <Tabs defaultValue="image">
                <TabsList className="mb-4">
                  <TabsTrigger value="image">Upload Image</TabsTrigger>
                  <TabsTrigger value="text">Text Description</TabsTrigger>
                </TabsList>

                <TabsContent value="image">
                  <ImageUpload 
                    onImageUpload={setImageData}
                    onError={(error) => {
                      toast({
                        variant: "destructive",
                        title: "Upload Failed",
                        description: error,
                      });
                    }}
                  />
                </TabsContent>

                <TabsContent value="text">
                  <Textarea
                    placeholder="Describe your DIY project in detail..."
                    {...form.register("description")}
                    className="mb-4"
                  />
                  {form.formState.errors.description && (
                    <p className="text-destructive text-sm mb-4">
                      {form.formState.errors.description.message}
                    </p>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex gap-4">
                <Button type="submit">
                  Analyze Project
                </Button>
                {analysisData && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Project"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </Card>

        {imageData && (
          <Card className="p-6 mb-8">
            <img 
              src={`data:image/jpeg;base64,${imageData}`}
              alt="Project"
              className="w-full max-h-[400px] object-contain rounded-lg"
            />
          </Card>
        )}

        {analysisData && (
          <div className="space-y-8">
            <ProjectAnalysis analysis={analysisData} />
            <MaterialsList materials={analysisData.materialsList} />
          </div>
        )}
      </div>
    </div>
  );
}
