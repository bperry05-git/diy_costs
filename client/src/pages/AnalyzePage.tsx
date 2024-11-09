import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUpload from "../components/ImageUpload";
import ProjectAnalysis from "../components/ProjectAnalysis";
import MaterialsList from "../components/MaterialsList";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  description: z.string().min(10, "Please provide a detailed description"),
});

export default function AnalyzePage() {
  const [imageData, setImageData] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: data.description,
          image: imageData,
        }),
      });
      const result = await response.json();
      setAnalysisData(result);
    } catch (error) {
      console.error("Analysis failed:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Project Analysis</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
          <Tabs defaultValue="image">
            <TabsList className="mb-4">
              <TabsTrigger value="image">Upload Image</TabsTrigger>
              <TabsTrigger value="text">Text Description</TabsTrigger>
            </TabsList>

            <TabsContent value="image">
              <ImageUpload onImageUpload={setImageData} />
            </TabsContent>

            <TabsContent value="text">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <Textarea
                    placeholder="Describe your DIY project in detail..."
                    {...form.register("description")}
                    className="mb-4"
                  />
                  <Button type="submit">Analyze Project</Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
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
