import { z } from "zod";

export const MembershipSchema = z.object({
  standing: z.enum(["REQUESTED", "ACTIVE", "DELINQUENT", "SUSPENDED", "TERMINATED"]),
});

export type Membership = z.infer<typeof MembershipSchema>;

export function canMembershipVote(m: Membership): boolean {
  return MembershipSchema.parse(m).standing === "ACTIVE";
}
