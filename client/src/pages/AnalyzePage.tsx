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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { mutate } from "swr";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Please provide a detailed description"),
});

export default function AnalyzePage() {
  const [imageData, setImageData] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsAnalyzing(true);
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          image: imageData,
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const result = await response.json();
      setAnalysisData(result);
      toast({
        title: "Analysis Complete",
        description: "Your project has been analyzed successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Failed to analyze project. Please try again.",
      });
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!analysisData || !form.getValues("title")) return;

    try {
      setIsSaving(true);
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.getValues("title"),
          description: form.getValues("description"),
          imageUrl: imageData ? `data:image/jpeg;base64,${imageData}` : null,
          analysis: analysisData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save project");
      }

      await mutate("/api/projects");
      toast({
        title: "Project Saved",
        description: "Your project has been saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Failed to save project. Please try again.",
      });
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Project Analysis</h1>

      <div className="grid md:grid-cols-2 gap-8">
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
                <Button type="submit" disabled={isAnalyzing}>
                  {isAnalyzing ? "Analyzing..." : "Analyze Project"}
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

        {analysisData && (
          <div className="space-y-8">
            <ProjectAnalysis analysis={analysisData} />
            <MaterialsList materials={analysisData.materials} />
          </div>
        )}
      </div>
    </div>
  );
}
