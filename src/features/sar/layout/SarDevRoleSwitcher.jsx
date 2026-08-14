import { SAR_ROLES } from "./sarRoles";

// DEVELOPMENT-ONLY. Lets a developer preview the SAR sidebar/pages as any
// role without a real login. It never reads or writes real session/auth
// state and has no effect outside this component's own local state.
export default function SarDevRoleSwitcher({ roleId, onRoleChange }) {
  return (
    <div className="sar-dev-role-switcher">
      <p className="sar-dev-role-switcher__label">DEV — Preview Role</p>
      <select
        className="sar-dev-role-switcher__select"
        value={roleId}
        onChange={(event) => onRoleChange(event.target.value)}
        aria-label="Development role preview"
      >
        {SAR_ROLES.map((role) => (
          <option key={role.id} value={role.id}>{role.label}</option>
        ))}
      </select>
      <p className="sar-dev-role-switcher__hint">Testing only — does not affect real login/session.</p>
    </div>
  );
}
