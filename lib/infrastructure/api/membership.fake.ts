import type { ManagedUserList } from "@/lib/domain/membership/managed-user.vo";
import type { MembershipPort } from "@/lib/domain/membership/ports";

const SEED: ManagedUserList = {
  total: 4,
  items: [
    {
      id: "u-01",
      name: "María Quispe",
      email: "maria@example.pe",
      role: "VOTER",
      standing: "ACTIVE",
    },
    {
      id: "u-02",
      name: "José Huamán",
      email: "jose@example.pe",
      role: "ADMIN",
      standing: "ACTIVE",
    },
    {
      id: "u-03",
      name: "Ana Torres",
      email: "ana@example.pe",
      role: "VOTER",
      standing: "SUSPENDED",
    },
    {
      id: "u-04",
      name: "Luis Paredes",
      email: "luis@example.pe",
      role: "VOTER",
      standing: "ACTIVE",
    },
  ],
};

export class FakeMembershipAdapter implements MembershipPort {
  async list(query: string): Promise<ManagedUserList> {
    const q = query.trim().toLowerCase();
    if (!q) return SEED;
    return {
      total: SEED.items.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q),
      ).length,
      items: SEED.items.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q),
      ),
    };
  }

  async applyAction(): Promise<{ ok: boolean }> {
    return { ok: true };
  }
}
