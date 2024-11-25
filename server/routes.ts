import type { Express } from "express";
import { analyzeProject, analyzeImage } from "./ai";
import { db } from "../db";
import { projects, analyses } from "../db/schema";
import { eq } from "drizzle-orm";
import axios from "axios";

export function registerRoutes(app: Express) {
  // Analyze a project
  app.post("/api/analyze", async (req, res) => {
    try {
      const { description, image } = req.body;
      
      // Updated validation to accept either description or image
      if (!description && !image) {
        return res.status(400).json({ error: "Either description or image is required" });
      }
      
      let analysisInput = description || "";
      if (image) {
        try {
          const imageAnalysis = await analyzeImage(image);
          analysisInput = description 
            ? `${description}\n\nImage Analysis: ${imageAnalysis}`
            : imageAnalysis;
        } catch (error) {
          console.error("Image analysis failed:", error);
          if (!description) {
            return res.status(400).json({ error: "Image analysis failed. Please provide a description or try another image." });
          }
          // Continue with text analysis if description is available
        }
      }

      const analysis = await analyzeProject(analysisInput);
      res.json(analysis);
    } catch (error) {
      console.error("Analysis failed:", error);
      res.status(500).json({ 
        error: "Failed to analyze project", 
        details: error.message 
      });
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
  // Search Home Depot products
  app.get("/api/search-products", async (req, res) => {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }

      console.log("Searching Home Depot products for:", query);
      
      const response = await axios.get("https://serpapi.com/search", {
        params: {
          engine: "home_depot",
          q: query,
          api_key: process.env.SERPAPI_API_KEY,
        },
      });

      if (!response.data) {
        console.error("No data received from SerpAPI");
        return res.status(500).json({ error: "No data received from product search" });
      }

      if (!response.data.products) {
        console.error("No products found in response:", response.data);
        return res.status(404).json({ error: "No products found" });
      }

      const products = response.data.products.map((product: any) => ({
        title: product.title,
        price: product.price,
        link: product.link,
        thumbnail: product.thumbnail,
        rating: product.rating,
        reviews: product.reviews,
        store: product.store || "Home Depot",
      }));

      console.log(`Found ${products.length} products`);
      res.json({ products });
    } catch (error: any) {
      console.error("Product search failed:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      const errorMessage = error.response?.data?.error || error.message || "Failed to search products";
      res.status(error.response?.status || 500).json({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? {
          status: error.response?.status,
          data: error.response?.data
        } : undefined
      });
    }
  });
    }
  });
}
