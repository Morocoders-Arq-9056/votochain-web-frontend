"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IdentityTemplate } from "@/components/templates/IdentityTemplate";
import { UsersPanel } from "@/components/organisms/UsersPanel";
import { identityNav } from "@/components/organisms/identityNav";
import { membershipPort } from "@/lib/infrastructure/api/composition";
import { routes } from "@/lib/ui/routes";
import type { ManagedUser } from "@/lib/domain/membership/managed-user.vo";
import {
  USERS_DESCRIPTION,
  USERS_ERROR,
  USERS_LOADING,
  USERS_ROLE_FILTER,
  USERS_SEARCH_LABEL,
  USERS_STATUS_FILTER,
  USERS_TITLE,
} from "@/lib/ui/copy";

export function UsersFlow() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [standing, setStanding] = useState("");
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    membershipPort()
      .list(query, role, standing)
      .then((list) => {
        if (!active) return;
        setUsers(list.items);
        setTotal(list.total);
        setError(null);
      })
      .catch(() => {
        if (active) setError(USERS_ERROR);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [query, role, standing]);

  return (
    <IdentityTemplate
      title={USERS_TITLE}
      description={USERS_DESCRIPTION}
      nav={identityNav("dashboard")}
    >
      {loading ? (
        <p role="status" className="text-sm text-text-secondary">
          {USERS_LOADING}
        </p>
      ) : error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : (
        <UsersPanel
          query={query}
          role={role}
          standing={standing}
          users={users}
          total={total}
          searchLabel={USERS_SEARCH_LABEL}
          roleLabel={USERS_ROLE_FILTER}
          standingLabel={USERS_STATUS_FILTER}
          onQuery={(value) => {
            setLoading(true);
            setQuery(value);
          }}
          onRole={(value) => {
            setLoading(true);
            setRole(value);
          }}
          onStanding={(value) => {
            setLoading(true);
            setStanding(value);
          }}
          onOpen={(id) => router.push(`${routes.cuenta()}?user=${id}`)}
        />
      )}
    </IdentityTemplate>
  );
}
