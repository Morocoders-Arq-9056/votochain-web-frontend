import type { ManagedUserList, MembershipAction } from "./managed-user.vo";

export interface MembershipPort {
  list(query: string, role: string, standing: string): Promise<ManagedUserList>;
  applyAction(userId: string, action: MembershipAction): Promise<{ ok: boolean }>;
}
