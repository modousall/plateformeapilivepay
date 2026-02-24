'use server';
/**
 * @fileOverview This file implements a Genkit flow to intelligently suggest the best pricing plan
 * (per-transaction commission or monthly subscription) to a merchant based on their sales activity.
 *
 * - suggestPricingPlan - The main function to call the AI flow for pricing plan suggestions.
 * - SuggestPricingPlanInput - The input type for the suggestPricingPlan function.
 * - SuggestPricingPlanOutput - The return type for the suggestPricingPlan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestPricingPlanInputSchema = z.object({
  totalTransactions: z
    .number()
    .int()
    .min(0)
    .describe('Total number of transactions for the merchant over a period.'),
  totalSalesVolume: z
    .number()
    .min(0)
    .describe('Total sales volume in FCFA for the merchant over a period.'),
  periodDescription: z
    .string()
    .optional()
    .describe('Description of the period for which the data is provided (e.g., "last month").'),
});
export type SuggestPricingPlanInput = z.infer<typeof SuggestPricingPlanInputSchema>;

const SuggestPricingPlanOutputSchema = z.object({
  suggestedPlan: z
    .enum(['commission_per_transaction', 'monthly_subscription'])
    .describe('The suggested pricing plan for the merchant.'),
  reasoning: z
    .string()
    .describe('An explanation for the suggested pricing plan based on the sales activity.'),
  estimatedBenefit: z
    .string()
    .optional()
    .describe('An estimated benefit or savings from the suggested plan, if applicable.'),
});
export type SuggestPricingPlanOutput = z.infer<typeof SuggestPricingPlanOutputSchema>;

export async function suggestPricingPlan(
  input: SuggestPricingPlanInput
): Promise<SuggestPricingPlanOutput> {
  return suggestPricingPlanFlow(input);
}

const suggestPricingPlanPrompt = ai.definePrompt({
  name: 'suggestPricingPlanPrompt',
  input: { schema: SuggestPricingPlanInputSchema },
  output: { schema: SuggestPricingPlanOutputSchema },
  prompt: `You are an intelligent financial advisor for online merchants. Your goal is to help a merchant optimize their costs by suggesting the best pricing plan: 'commission_per_transaction' or 'monthly_subscription'.

Consider the following sales activity for the merchant:
- Total Transactions: {{{totalTransactions}}}
- Total Sales Volume: {{{totalSalesVolume}}} FCFA
{{#if periodDescription}}- Period: {{{periodDescription}}}{{/if}}

Assume a hypothetical commission rate of 2% per transaction, and a hypothetical monthly subscription fee of 10,000 FCFA.

Analyze the provided sales data and determine which plan would likely be more cost-effective for the merchant.

Suggest 'commission_per_transaction' if the merchant has low transaction volume (e.g., less than 20 transactions) and sales, as this plan is more flexible and cheaper for infrequent sales.
Suggest 'monthly_subscription' if the merchant has a high transaction volume (e.g., 20 transactions or more) and substantial sales volume, as a fixed monthly fee would likely be cheaper than cumulative commissions.

Provide a clear 'reasoning' for your suggestion, and if possible, an 'estimatedBenefit' explaining why your suggested plan is better based on the provided data and hypothetical rates.`,
});

const suggestPricingPlanFlow = ai.defineFlow(
  {
    name: 'suggestPricingPlanFlow',
    inputSchema: SuggestPricingPlanInputSchema,
    outputSchema: SuggestPricingPlanOutputSchema,
  },
  async (input) => {
    const { output } = await suggestPricingPlanPrompt(input);
    return output!;
  }
);
