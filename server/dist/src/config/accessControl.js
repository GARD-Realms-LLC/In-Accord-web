"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROTECTED_ROUTES = exports.PAGE_PERMISSIONS = void 0;
exports.normalizeRole = normalizeRole;
exports.getAllowedRoutesForRole = getAllowedRoutesForRole;
exports.getRouteAccessMap = getRouteAccessMap;
exports.isRouteAllowed = isRouteAllowed;
exports.getDefaultRole = getDefaultRole;
const ROLE_NORMALIZATION = {
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
exports.PAGE_PERMISSIONS = {
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
const PUBLIC_ROUTES = new Set(["/", "/home", "/support", "/team"]);
exports.PROTECTED_ROUTES = Object.keys(exports.PAGE_PERMISSIONS).filter((route) => !PUBLIC_ROUTES.has(route));
function normalizeRoute(route) {
    if (!route)
        return "/";
    const trimmed = route.trim();
    if (trimmed === "")
        return "/";
    const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    const withoutTrailing = normalized.replace(/\/+$/, "");
    return withoutTrailing === "" ? "/" : withoutTrailing;
}
function normalizeRole(rawRole) {
    var _a;
    if (!rawRole || typeof rawRole !== "string")
        return "Guest";
    const lower = rawRole.trim().toLowerCase();
    if (!lower)
        return "Guest";
    return (_a = ROLE_NORMALIZATION[lower]) !== null && _a !== void 0 ? _a : "User";
}
function getAllowedRoutesForRole(rawRole) {
    const role = normalizeRole(rawRole);
    if (role === "Admin") {
        return Array.from(new Set(Object.keys(exports.PAGE_PERMISSIONS))).sort();
    }
    const allowed = new Set();
    for (const [path, roles] of Object.entries(exports.PAGE_PERMISSIONS)) {
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
function getRouteAccessMap(rawRole) {
    const role = normalizeRole(rawRole);
    const allowed = new Set(getAllowedRoutesForRole(role));
    const map = {};
    for (const path of Object.keys(exports.PAGE_PERMISSIONS)) {
        map[path] = role === "Admin" || allowed.has(path);
    }
    return map;
}
function isRouteAllowed(rawRole, route) {
    const role = normalizeRole(rawRole);
    if (role === "Admin")
        return true;
    const normalizedRoute = normalizeRoute(route);
    const allowedRoutes = getAllowedRoutesForRole(role);
    return allowedRoutes.some((allowed) => {
        const normalizedAllowed = normalizeRoute(allowed);
        if (normalizedAllowed === normalizedRoute)
            return true;
        return normalizedRoute.startsWith(`${normalizedAllowed}/`);
    });
}
function getDefaultRole() {
    return "User";
}
