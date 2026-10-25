import { z } from "zod";

export const CommunityStandingSchema = z.enum([
  "REGISTERED",
  "ACTIVE",
  "SUSPENDED",
  "ARCHIVED",
]);

export type CommunityStanding = z.infer<typeof CommunityStandingSchema>;

export function acceptsMembers(standing: CommunityStanding): boolean {
  return CommunityStandingSchema.parse(standing) === "ACTIVE";
}
