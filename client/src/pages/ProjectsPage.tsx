import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useSWR from "swr";
import { ProjectWithAnalysis } from "../lib/types";

const DIFFICULTY_LABELS = {
  1: "Beginner",
  2: "Easy",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

export default function ProjectsPage() {
  const { data: projects, error } = useSWR<ProjectWithAnalysis[]>("/api/projects");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  if (error) return <div>Failed to load projects</div>;
  if (!projects) return <div>Loading...</div>;

  const filteredProjects = projects.filter(project => 
    difficultyFilter === "all" || project.analysis.difficulty === parseInt(difficultyFilter)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <div className="w-48">
          <Select
            value={difficultyFilter}
            onValueChange={setDifficultyFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              {Object.entries(DIFFICULTY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">
                  Estimated Cost: ${project.analysis.estimatedCost}
                </span>
                <span className="text-sm">
                  Time: {project.analysis.estimatedTime}h
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${
                        i < project.analysis.difficulty
                          ? "bg-accent"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {DIFFICULTY_LABELS[project.analysis.difficulty as keyof typeof DIFFICULTY_LABELS]}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
