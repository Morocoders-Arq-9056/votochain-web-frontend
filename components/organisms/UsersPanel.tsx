"use client";

import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { SearchBar } from "@/components/molecules/SearchBar";
import { Select } from "@/components/atoms/Select";
import type { ManagedUser } from "@/lib/domain/membership/managed-user.vo";
import { USERS_VIEW_PROFILE } from "@/lib/ui/copy";

type UsersPanelProps = {
  query: string;
  role: string;
  standing: string;
  users: ManagedUser[];
  total: number;
  onQuery: (q: string) => void;
  onRole: (r: string) => void;
  onStanding: (s: string) => void;
  onOpen: (id: string) => void;
  searchLabel: string;
  roleLabel: string;
  standingLabel: string;
};

export function UsersPanel({
  query,
  role,
  standing,
  users,
  total,
  onQuery,
  onRole,
  onStanding,
  onOpen,
  searchLabel,
  roleLabel,
  standingLabel,
}: UsersPanelProps) {
  return (
    <div className="flex w-full flex-col gap-[var(--spacing-form-gap)] rounded-card border border-border bg-surface p-[var(--panel-pad)] shadow-card">
      <SearchBar label={searchLabel} value={query} onSearch={onQuery} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-2">
        <Select id="users-role" label={roleLabel} value={role} onChange={(e) => onRole(e.target.value)}>
          <option value="">Todos</option>
          <option value="VOTER">Votante</option>
          <option value="ADMIN">Admin</option>
        </Select>
        <Select
          id="users-standing"
          label={standingLabel}
          value={standing}
          onChange={(e) => onStanding(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="ACTIVE">Activo</option>
          <option value="SUSPENDED">Suspendido</option>
        </Select>
      </div>
      <div className="flex flex-col gap-3 lg:hidden">
        {users.map((u) => (
          <article key={u.id} className="flex flex-col gap-2 rounded-card border border-border bg-surface p-4 shadow-card">
            <p className="text-base font-semibold text-text-primary">{u.name}</p>
            <p className="text-sm text-text-secondary">{u.email}</p>
            <Badge tone={u.standing === "ACTIVE" ? "success" : "danger"}>{u.standing}</Badge>
            <Button type="button" variant="secondary" onClick={() => onOpen(u.id)}>
              {USERS_VIEW_PROFILE}
            </Button>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[1172px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border text-xs font-semibold tracking-wide text-text-secondary uppercase">
              <th scope="col" className="px-4 py-4">Persona</th>
              <th scope="col" className="px-4 py-4">Correo</th>
              <th scope="col" className="px-4 py-4">Estado</th>
              <th scope="col" className="px-4 py-4">Roles</th>
              <th scope="col" className="px-4 py-4">Última actividad</th>
              <th scope="col" className="px-4 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-base font-semibold text-text-primary">{u.name}</td>
                <td className="px-4 py-3 text-sm text-text-secondary">{u.email}</td>
                <td className="px-4 py-3">
                  <Badge tone={u.standing === "ACTIVE" ? "success" : "danger"}>{u.standing}</Badge>
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {u.role === "ADMIN" ? "Administrador" : "Miembro"}
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">12/02/2026 09:10 PET (UTC−5)</td>
                <td className="px-4 py-3">
                  <Button type="button" variant="secondary" onClick={() => onOpen(u.id)}>
                    {USERS_VIEW_PROFILE}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-text-secondary">
        {total} registros · Página 1 de 1
      </p>
    </div>
  );
}
