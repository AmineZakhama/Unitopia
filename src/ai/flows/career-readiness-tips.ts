'use server';
/**
 * @fileOverview A Genkit flow for generating personalized career readiness tips for students.
 *
 * - getCareerReadinessTips - A function that generates career readiness tips based on student profile.
 * - CareerReadinessTipsInput - The input type for the getCareerReadinessTips function.
 * - CareerReadinessTipsOutput - The return type for the getCareerReadinessTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CareerReadinessTipsInputSchema = z.object({
  studentProfile: z
    .string()
    .describe(
      "A description of the student's interests, fields of study, and career aspirations, used to personalize tips."
    ),
});
export type CareerReadinessTipsInput = z.infer<
  typeof CareerReadinessTipsInputSchema
>;

const CareerReadinessTipSchema = z.object({
  title: z.string().describe('A concise title for the career readiness tip or resource.'),
  description: z
    .string()
    .describe('Detailed advice, resources, or steps for the career readiness tip.'),
});

const CareerReadinessTipsOutputSchema = z.object({
  tips: z
    .array(CareerReadinessTipSchema)
    .describe('An array of personalized career readiness tips and resources.'),
});
export type CareerReadinessTipsOutput = z.infer<
  typeof CareerReadinessTipsOutputSchema
>;

export async function getCareerReadinessTips(
  input: CareerReadinessTipsInput
): Promise<CareerReadinessTipsOutput> {
  return careerReadinessTipsFlow(input);
}

const careerReadinessTipsPrompt = ai.definePrompt({
  name: 'careerReadinessTipsPrompt',
  input: {schema: CareerReadinessTipsInputSchema},
  output: {schema: CareerReadinessTipsOutputSchema},
  prompt: `You are an AI career coach specializing in helping university students prepare for the job market.
Given the student's profile, generate a list of personalized career readiness tips and resources.
Focus on areas such as improving their GitHub profile, crafting a compelling CV, and preparing for job interviews.

Student Profile:
{{{studentProfile}}}

Generate 3-5 distinct tips that are highly relevant to the student's profile.`,
});

const careerReadinessTipsFlow = ai.defineFlow(
  {
    name: 'careerReadinessTipsFlow',
    inputSchema: CareerReadinessTipsInputSchema,
    outputSchema: CareerReadinessTipsOutputSchema,
  },
  async (input) => {
    const {output} = await careerReadinessTipsPrompt(input);
    return output!;
  }
);
