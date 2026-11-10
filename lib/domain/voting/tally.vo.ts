import { z } from "zod";

export const TallyOptionSchema = z.object({
  value: z.enum(["SI", "NO", "ABSTENCION"]),
  label: z.string().min(1),
  count: z.number().int().nonnegative(),
  percent: z.number().min(0).max(100),
});

export type TallyOption = z.infer<typeof TallyOptionSchema>;

export const TallyResultSchema = z.object({
  proposalId: z.string().min(1),
  proposalTitle: z.string().min(1),
  options: z.array(TallyOptionSchema).length(3),
  confirmed: z.number().int().nonnegative(),
  eligible: z.number().int().positive(),
  quorumReached: z.boolean(),
  frozenRule: z.string().min(1),
});

export type TallyResult = z.infer<typeof TallyResultSchema>;

export function tallyPercent(count: number, confirmed: number): number {
  if (confirmed <= 0) return 0;
  return Math.round((count / confirmed) * 10000) / 100;
}

export function participationPercent(confirmed: number, eligible: number): number {
  if (eligible <= 0) return 0;
  return Math.round((confirmed / eligible) * 10000) / 100;
}
