export type UserRole =
  | "Admin"
  | "Manager"
  | "Support"
  | "User"
  | "Viewer"
  | "Guest";

const ROLE_NORMALIZATION: Record<string, UserRole> = {
  admin: "Admin",
  administrator: "Admin",
  manager: "Manager",
  support: "Support",
  helper: "Support",
  user: "User",
  member: "User",
  viewer: "Viewer",
  guest: "Guest",
  anonymous: "Guest",
};

export const PAGE_PERMISSIONS: Record<string, UserRole[]> = {
  "/": ["Guest", "Viewer", "User", "Manager", "Support", "Admin"],
  "/home": ["Guest", "Viewer", "User", "Manager", "Support", "Admin"],
  "/plugins": ["Viewer", "User", "Manager", "Support", "Admin"],
  "/themes": ["Viewer", "User", "Manager", "Support", "Admin"],
  "/ide": ["Manager", "Support", "Admin"],
  "/uploads": ["Manager", "Support", "Admin"],
  "/dashboard": ["User", "Manager", "Support", "Admin"],
  "/inventory": ["User", "Manager", "Support", "Admin"],
  "/products": ["Manager", "Support", "Admin"],
  "/profile": ["Viewer", "User", "Manager", "Support", "Admin"],
  "/expenses": ["Manager", "Support", "Admin"],
  "/bots": ["Manager", "Support", "Admin"],
  "/servers": ["Manager", "Support", "Admin"],
  "/hosting": ["Manager", "Support", "Admin"],
  "/users": ["Viewer", "User", "Manager", "Support", "Admin"],
  "/support": ["Guest", "Viewer", "User", "Manager", "Support", "Admin"],
  "/team": ["Guest", "Viewer", "User", "Manager", "Support", "Admin"],
  "/administrator": ["Admin"],
};

const PUBLIC_ROUTES = new Set<string>(["/", "/home", "/support", "/team"]);

export const PROTECTED_ROUTES = Object.keys(PAGE_PERMISSIONS).filter(
  (route) => !PUBLIC_ROUTES.has(route)
);

function normalizeRoute(route: string): string {
  if (!route) return "/";
  const trimmed = route.trim();
  if (trimmed === "") return "/";
  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const withoutTrailing = normalized.replace(/\/+$/, "");
  return withoutTrailing === "" ? "/" : withoutTrailing;
}

export function normalizeRole(rawRole?: string | null): UserRole {
  if (!rawRole || typeof rawRole !== "string") return "Guest";
  const lower = rawRole.trim().toLowerCase();
  if (!lower) return "Guest";
  return ROLE_NORMALIZATION[lower] ?? "User";
}

export function getAllowedRoutesForRole(rawRole?: string | null): string[] {
  const role = normalizeRole(rawRole);
  if (role === "Admin") {
    return Array.from(new Set(Object.keys(PAGE_PERMISSIONS))).sort();
  }
  const allowed = new Set<string>();
  for (const [path, roles] of Object.entries(PAGE_PERMISSIONS)) {
    if (roles.includes(role)) {
      allowed.add(path);
    }
  }
  // Always include public routes
  for (const publicRoute of PUBLIC_ROUTES) {
    allowed.add(publicRoute);
  }
  return Array.from(allowed).sort();
}

export function getRouteAccessMap(rawRole?: string | null): Record<string, boolean> {
  const role = normalizeRole(rawRole);
  const allowed = new Set(getAllowedRoutesForRole(role));
  const map: Record<string, boolean> = {};
  for (const path of Object.keys(PAGE_PERMISSIONS)) {
    map[path] = role === "Admin" || allowed.has(path);
  }
  return map;
}

export function isRouteAllowed(rawRole: string | null | undefined, route: string): boolean {
  const role = normalizeRole(rawRole);
  if (role === "Admin") return true;
  const normalizedRoute = normalizeRoute(route);
  const allowedRoutes = getAllowedRoutesForRole(role);
  return allowedRoutes.some((allowed) => {
    const normalizedAllowed = normalizeRoute(allowed);
    if (normalizedAllowed === normalizedRoute) return true;
    return normalizedRoute.startsWith(`${normalizedAllowed}/`);
  });
}

export function getDefaultRole(): UserRole {
  return "User";
}
