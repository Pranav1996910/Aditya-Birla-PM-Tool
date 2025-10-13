
import { GoogleGenAI } from "@google/genai";
import { Project } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY not found in environment variables. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateProjectSummary = async (project: Project): Promise<string> => {
  if (!API_KEY) {
    return "Gemini API key is not configured. Could not generate summary.";
  }
  
  const prompt = `
    Generate a concise, professional project status report summary based on the following data.
    The tone should be suitable for a client update.
    Analyze the progress data and timeline to identify key achievements and potential risks.

    Project Data:
    - Name: ${project.name}
    - Client: ${project.client}
    - Description: ${project.description}
    - Current Status: ${project.status}
    - Completion Percentage: ${project.completionPercentage}%
    - Start Date: ${project.startDate}
    - Target End Date: ${project.endDate}
    - Completed Timeline Events: ${project.timeline.filter(t => t.completed).map(t => t.title).join(', ') || 'None'}
    - Upcoming Timeline Events: ${project.timeline.filter(t => !t.completed).map(t => `${t.title} (due ${t.date})`).join(', ') || 'None'}

    Generate a summary covering:
    1.  An overall status overview.
    2.  Key accomplishments to date.
    3.  Next steps and upcoming milestones.
    4.  A brief risk assessment based on the current status.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating project summary:", error);
    return "An error occurred while generating the summary. Please try again.";
  }
};
