// SAR-specific role model for the "My Appraisal" / "Approval" navigation
// structure. This is UI-only — it does not gate access, persist anything, or
// replace the app's real authentication/role system in src/auth/session.js.
export const SAR_ROLES = [
  { id: "faculty", label: "Faculty", hasApproval: false },
  { id: "hod", label: "HOD", hasApproval: true },
  { id: "functionalHead", label: "Functional Head", hasApproval: true },
  { id: "registrar", label: "Registrar", hasApproval: true },
  { id: "dean", label: "Dean", hasApproval: true },
  { id: "viceChancellor", label: "Vice Chancellor", hasApproval: true },
];

export const DEFAULT_SAR_ROLE_ID = "faculty";

export const getSarRole = (roleId) => SAR_ROLES.find((role) => role.id === roleId) || SAR_ROLES[0];

export const navItemsForRole = (roleId) => {
  const role = getSarRole(roleId);
  const items = [{ id: "my-appraisal", label: "My Appraisal" }];
  if (role.hasApproval) items.push({ id: "approval", label: "Approval" });
  return items;
};

// Best-effort mapping from the app's real session role (see
// src/auth/session.js normalizeRole/VALID_ROLES) to a SAR role. Used only as
// an informational default for the development role switcher — the SAR
// system does not currently model "registrar" or "functionalHead" as real
// session roles, so those (and any unmapped role) fall back to "faculty".
export const sarRoleIdFromSessionRole = (sessionRole) => {
  switch (sessionRole) {
    case "faculty":
      return "faculty";
    case "hod":
      return "hod";
    case "dean":
      return "dean";
    case "vc":
      return "viceChancellor";
    default:
      return DEFAULT_SAR_ROLE_ID;
  }
};
