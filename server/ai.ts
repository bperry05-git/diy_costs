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
            text: "Analyze this DIY project image and provide an EXHAUSTIVE list of ALL required materials down to the smallest items. Include foundation materials, structural components, hardware, tools, and finishing materials. Nothing should be omitted. Consider safety equipment, consumables, and specialized tools that might be needed."
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
        content: `You are a DIY project expert with extensive knowledge of building materials and supplies. For any project, provide an EXHAUSTIVE list of ALL required materials down to the smallest items. Include foundation materials, structural components, hardware, tools, and finishing materials. Nothing should be omitted.

For example, for a deck project you must include:
1. Foundation (concrete, post hole digger, gravel)
2. Structure (posts, beams, joists, blocking)
3. Hardware (post anchors, joist hangers, structural screws, nails)
4. Decking (boards, fascia)
5. Railings (posts, rails, balusters, post caps)
6. Stairs (stringers, treads, risers)
7. Tools (saw, drill, level, tape measure)
8. Finishing (stain, sealer, brushes)

Format your response in the following JSON format:
{
  "DifficultyLevel": number (1-5),
  "EstimatedTimeHours": number,
  "EstimatedCost": number,
  "RequiredSkills": string[],
  "MaterialsList": [
    {
      "Material": string,
      "Category": string,
      "Quantity": string,
      "EstimatedCost": number,
      "Specifications": string (Include dimensions, grade, type),
      "UsageInstructions": string,
      "ImportantNotes": string
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

  if (!response.choices[0].message.content) {
    throw new Error("No content in response");
  }

  return JSON.parse(response.choices[0].message.content);
}
