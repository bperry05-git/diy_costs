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
      
      let analysisInput = description;
      if (image) {
        const imageAnalysis = await analyzeImage(image);
        analysisInput = `${description}\n\nImage Analysis: ${imageAnalysis}`;
      }

      const analysis = await analyzeProject(analysisInput);
      res.json(analysis);
    } catch (error) {
      console.error("Analysis failed:", error);
      res.status(500).json({ error: "Failed to analyze project" });
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
