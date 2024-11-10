import OpenAI from "openai";
import { ProjectAnalysis } from "../client/src/lib/types";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeImage(base64Image: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this DIY project image and provide detailed information about the materials, tools needed, step-by-step instructions, and complexity level visible in the image. For materials, include specific brands, where to buy, and important specifications."
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          }
        ],
      },
    ],
  });

  return response.choices[0].message.content || "";
}

export async function analyzeProject(description: string): Promise<ProjectAnalysis> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are a DIY project expert with extensive knowledge of building materials and supplies. Analyze the project description and provide comprehensive recommendations. Focus on detailed material specifications and alternatives. Format your response in the following JSON format:

{
  "DifficultyLevel": number (1-5),
  "EstimatedTimeHours": number,
  "EstimatedCost": number,
  "RequiredSkills": string[],
  "MaterialsList": [
    {
      "Material": string,
      "Quantity": string,
      "EstimatedCost": number,
      "Specifications": string (Include dimensions, grade, type, etc.),
      "RecommendedBrands": string[] (2-3 specific brand recommendations),
      "AlternativeOptions": string[] (1-2 alternative materials),
      "WhereToBuy": string[] (List of stores or online retailers),
      "UsageInstructions": string (Brief handling/application instructions),
      "ImportantNotes": string (Any crucial specifications or warnings)
    }
  ],
  "StepByStepInstructions": [
    {
      "StepNumber": number,
      "Instruction": string,
      "EstimatedTime": string,
      "SafetyNotes": string,
      "ToolsNeeded": string[]
    }
  ],
  "ImportantNotesWarnings": string[]
}`
      },
      {
        role: "user",
        content: description
      }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
}
