import OpenAI from "openai";
import { ProjectAnalysis } from "../client/src/lib/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const DIFFICULTY_CRITERIA = {
  1: "Basic DIY skills, common household tools, simple assembly or decoration",
  2: "Basic power tools, some measuring, simple cuts and attachments",
  3: "Multiple tools and skills, precise measurements, moderate complexity",
  4: "Specialized tools, advanced techniques, complex assembly or modifications",
  5: "Expert knowledge, professional tools, complex planning and execution"
};

export async function analyzeImage(base64Image: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Analyze this DIY project image and describe the materials, tools, complexity level, and step-by-step instructions visible in the image. Pay special attention to the complexity level based on tools needed, precision required, and skill level needed."
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
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a DIY project expert. Analyze the project description and provide detailed recommendations.
Consider these difficulty levels carefully:
${Object.entries(DIFFICULTY_CRITERIA).map(([level, criteria]) => `Level ${level}: ${criteria}`).join('\n')}

Include in your analysis:
- Difficulty level (1-5) based on the criteria above
- Estimated time in hours
- Required skills (be specific about tool proficiency and techniques needed)
- Materials list with quantities and estimated costs
- Important notes or warnings
- Step-by-step guide with detailed instructions

For the step-by-step guide, include:
- Clear titles for each step
- Detailed descriptions
- Required materials per step
- Time estimates per step
- Helpful tips and tricks

Respond in JSON format matching the ProjectAnalysis type with an additional guide array containing steps.`
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
