import SarDevRoleSwitcher from "./SarDevRoleSwitcher";

const ICON_PATHS = {
  "my-appraisal": (
    <>
      <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </>
  ),
  approval: (
    <>
      <path d="M9 11 11 13 15 9" />
      <path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path d="M14 3v4h4" />
    </>
  ),
};

function NavIcon({ name }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICON_PATHS[name]}
    </svg>
  );
}

export default function SarSidebar({ navItems, activePageId, onNavigate, roleId, roleLabel, onRoleChange }) {
  return (
    <aside className="sar-shell__sidebar" aria-label="SAR navigation">
      <div className="sar-shell__brand">
        <span className="sar-shell__brand-mark">SAR</span>
        <div>
          <strong>DYPATU SAR</strong>
          <span>{roleLabel}</span>
        </div>
      </div>

      <nav className="sar-shell__nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`sar-shell__nav-item${item.id === activePageId ? " is-active" : ""}`}
            onClick={() => onNavigate(item.id)}
            aria-current={item.id === activePageId ? "page" : undefined}
          >
            <span className="sar-shell__nav-icon"><NavIcon name={item.id} /></span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sar-shell__sidebar-spacer" />

      <SarDevRoleSwitcher roleId={roleId} onRoleChange={onRoleChange} />
    </aside>
  );
}
