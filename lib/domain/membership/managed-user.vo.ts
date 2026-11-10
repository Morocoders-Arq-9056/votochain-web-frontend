import { z } from "zod";

export const ManagedUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["VOTER", "ADMIN"]),
  standing: z.enum(["ACTIVE", "SUSPENDED"]),
});

export type ManagedUser = z.infer<typeof ManagedUserSchema>;

export const ManagedUserListSchema = z.object({
  items: z.array(ManagedUserSchema),
  total: z.number().int().nonnegative(),
});

export type ManagedUserList = z.infer<typeof ManagedUserListSchema>;

export type MembershipAction = "GRANT_ADMIN" | "REVOKE_ADMIN" | "SUSPEND" | "REINSTATE";

export function describeMembershipAction(action: MembershipAction): string {
  switch (action) {
    case "GRANT_ADMIN":
      return "Dar rol";
    case "REVOKE_ADMIN":
      return "Quitar rol";
    case "SUSPEND":
      return "Suspender";
    case "REINSTATE":
      return "Rehabilitar";
  }
}
