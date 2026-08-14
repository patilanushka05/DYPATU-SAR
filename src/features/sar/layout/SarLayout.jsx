import { useMemo, useState } from "react";
import { getSessionItem, normalizeRole } from "../../../auth/session";
import SarSidebar from "./SarSidebar";
import SarPageHeader from "./SarPageHeader";
import { MyAppraisalPage, ApprovalPage } from "./pages";
import { DEFAULT_SAR_ROLE_ID, getSarRole, navItemsForRole, sarRoleIdFromSessionRole } from "./sarRoles";
import "./SarLayout.css";

// Informational default only — read-only use of the existing session
// helpers to seed the dev role switcher. Never writes to session/auth state,
// and /dypatu-sar has no auth gate, so there may be no real session at all.
const initialRoleId = () => {
  if (typeof window === "undefined") return DEFAULT_SAR_ROLE_ID;
  try {
    const sessionRole = normalizeRole(getSessionItem("role"), "");
    return sarRoleIdFromSessionRole(sessionRole);
  } catch {
    return DEFAULT_SAR_ROLE_ID;
  }
};

export default function SarLayout() {
  const [roleId, setRoleId] = useState(initialRoleId);
  const [activePageId, setActivePageId] = useState("my-appraisal");

  const role = getSarRole(roleId);
  const navItems = useMemo(() => navItemsForRole(roleId), [roleId]);

  const handleRoleChange = (nextRoleId) => {
    setRoleId(nextRoleId);
    setActivePageId("my-appraisal");
  };

  const showApproval = activePageId === "approval" && role.hasApproval;

  return (
    <div className="sar-shell">
      <SarSidebar
        navItems={navItems}
        activePageId={activePageId}
        onNavigate={setActivePageId}
        roleId={roleId}
        roleLabel={role.label}
        onRoleChange={handleRoleChange}
      />
      <main className="sar-shell__content">
        {showApproval ? (
          <>
            <SarPageHeader eyebrow={`${role.label} · Approval`} title="Approval" />
            <ApprovalPage />
          </>
        ) : (
          <>
            {roleId !== "faculty" && <SarPageHeader eyebrow={`${role.label} · My Appraisal`} title="My Appraisal" />}
            <MyAppraisalPage roleId={roleId} />
          </>
        )}
      </main>
    </div>
  );
}
