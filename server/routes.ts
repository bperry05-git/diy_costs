import type { Express } from "express";
import { analyzeProject, analyzeImage } from "./ai";
import { db } from "../db";
import { projects, analyses } from "../db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express) {
  // Analyze a project
  app.post("/api/analyze", async (req, res) => {
    try {
      const { description, image } = req.body;
      if (!description) {
        return res.status(400).json({ error: "Description is required" });
      }
      
      let analysisInput = description;
      if (image) {
        try {
          const imageAnalysis = await analyzeImage(image);
          analysisInput = `${description}\n\nImage Analysis: ${imageAnalysis}`;
        } catch (error) {
          console.error("Image analysis failed:", error);
          // Continue with text analysis even if image analysis fails
        }
      }

      const analysis = await analyzeProject(analysisInput);
      res.json(analysis);
    } catch (error) {
      console.error("Analysis failed:", error);
      res.status(500).json({ error: "Failed to analyze project" });
    }
  });

  // Save a project
  app.post("/api/projects", async (req, res) => {
    try {
      const { title, description, imageUrl, analysis } = req.body;

      if (!title || !description || !analysis) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const result = await db.transaction(async (tx) => {
        const [project] = await tx
          .insert(projects)
          .values({
            title,
            description,
            imageUrl,
          })
          .returning();

        const [analysisRecord] = await tx
          .insert(analyses)
          .values({
            projectId: project.id,
            difficulty: analysis.difficulty,
            estimatedTime: analysis.estimatedTime,
            estimatedCost: analysis.estimatedCost,
            requiredSkills: analysis.requiredSkills,
            notes: analysis.notes,
            materials: analysis.materials,
          })
          .returning();

        return { ...project, analysis: analysisRecord };
      });

      res.status(201).json(result);
    } catch (error) {
      console.error("Failed to save project:", error);
      res.status(500).json({ error: "Failed to save project" });
    }
  });

  // Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const results = await db
        .select()
        .from(projects)
        .leftJoin(analyses, eq(projects.id, analyses.projectId));

      const formattedProjects = results.map(({ projects, analyses }) => ({
        ...projects,
        analysis: analyses,
      }));

      res.json(formattedProjects);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });
}
