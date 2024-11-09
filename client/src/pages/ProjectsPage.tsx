import { Card } from "@/components/ui/card";
import useSWR from "swr";
import { ProjectWithAnalysis } from "../lib/types";

export default function ProjectsPage() {
  const { data: projects, error } = useSWR<ProjectWithAnalysis[]>("/api/projects");

  if (error) return <div>Failed to load projects</div>;
  if (!projects) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Projects</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="p-6">
            {project.imageUrl && (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
            <p className="text-muted-foreground mb-4">{project.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm">
                Estimated Cost: ${project.analysis.estimatedCost}
              </span>
              <span className="text-sm">
                Time: {project.analysis.estimatedTime}h
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
