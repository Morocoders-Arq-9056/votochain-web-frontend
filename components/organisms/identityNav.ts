import type { NavigationItem } from "./BottomNavigation";
import {
  NAV_ACCOUNT,
  NAV_HOME,
  NAV_VERIFICATION,
  NAV_VOTE,
} from "@/lib/ui/copy";
import { routes } from "@/lib/ui/routes";

export function identityNav(active: NavigationItem["icon"]): NavigationItem[] {
  return [
    { href: routes.home(), label: NAV_HOME, icon: "dashboard", active: active === "dashboard" },
    { href: routes.votar(), label: NAV_VOTE, icon: "vote", active: active === "vote" },
    {
      href: routes.miVerificacion(),
      label: NAV_VERIFICATION,
      icon: "identity",
      active: active === "identity",
    },
    { href: routes.cuenta(), label: NAV_ACCOUNT, icon: "account", active: active === "account" },
  ];
}
