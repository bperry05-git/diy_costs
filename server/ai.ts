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
            text: "Analyze this DIY project image and describe the materials, tools, and complexity level visible in the image."
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
        content: `You are a DIY project expert. Analyze the project description and provide detailed recommendations in the following JSON format:
{
  "DifficultyLevel": number (1-5),
  "EstimatedTimeHours": number,
  "EstimatedCost": number,
  "RequiredSkills": string[],
  "MaterialsList": [
    {
      "Material": string,
      "Quantity": string,
      "EstimatedCost": number
    }
  ],
  "StepByStepInstructions": [
    {
      "StepNumber": number,
      "Instruction": string
    }
  ]
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
