import { SAR_MAX_MARKS, SAR_SECTIONS, SAR_WORKFLOW_STAGES } from "../config";

const page = {
  minHeight: "100vh",
  background: "#f6f8fb",
  color: "#102033",
  fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
  padding: "32px min(5vw, 64px)",
};

const shell = {
  maxWidth: 1180,
  margin: "0 auto",
  display: "grid",
  gap: 24,
};

const header = {
  background: "#ffffff",
  border: "1px solid #dbe4ee",
  borderRadius: 8,
  padding: "26px 30px",
  boxShadow: "0 16px 36px rgba(15, 35, 62, 0.07)",
};

const eyebrow = {
  margin: "0 0 8px",
  color: "#315f8f",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 0,
  textTransform: "uppercase",
};

const title = {
  margin: 0,
  color: "#0f2740",
  fontSize: 30,
  lineHeight: 1.18,
  fontWeight: 850,
  letterSpacing: 0,
};

const subtitle = {
  margin: "10px 0 0",
  maxWidth: 760,
  color: "#516274",
  fontSize: 14,
  lineHeight: 1.6,
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: 12,
};

const summaryTile = {
  background: "#ffffff",
  border: "1px solid #dbe4ee",
  borderRadius: 8,
  padding: "16px 18px",
};

const summaryLabel = {
  margin: 0,
  color: "#657589",
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: 0,
  textTransform: "uppercase",
};

const summaryValue = {
  margin: "8px 0 0",
  color: "#113657",
  fontSize: 24,
  fontWeight: 900,
  lineHeight: 1,
};

const sectionGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 14,
};

const sectionCard = {
  background: "#ffffff",
  border: "1px solid #dbe4ee",
  borderRadius: 8,
  padding: 18,
  minHeight: 210,
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const sectionTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
};

const sectionNumber = {
  width: 34,
  height: 34,
  borderRadius: 8,
  background: "#e9f2fb",
  color: "#205b8f",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 900,
  flexShrink: 0,
};

const sectionTitle = {
  margin: 0,
  color: "#102033",
  fontSize: 16,
  fontWeight: 850,
  lineHeight: 1.3,
};

const marksBadge = {
  border: "1px solid #b8d3ec",
  background: "#f2f8fd",
  color: "#17466f",
  borderRadius: 8,
  padding: "6px 9px",
  fontSize: 12,
  fontWeight: 850,
  whiteSpace: "nowrap",
};

const subsectionList = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "grid",
  gap: 8,
};

const subsectionItem = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto",
  gap: 10,
  alignItems: "baseline",
  color: "#46586b",
  fontSize: 13,
  lineHeight: 1.35,
};

const subsectionMarks = {
  color: "#6b7b8d",
  fontWeight: 800,
  fontSize: 12,
};

const workflow = {
  background: "#ffffff",
  border: "1px solid #dbe4ee",
  borderRadius: 8,
  padding: 18,
};

const workflowList = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginTop: 12,
};

const workflowChip = {
  border: "1px solid #d8e1eb",
  background: "#fafcff",
  color: "#40566d",
  borderRadius: 8,
  padding: "8px 10px",
  fontSize: 12,
  fontWeight: 800,
};

function renderNestedSubsections(items = []) {
  return items.flatMap((item) => {
    const current = [{ id: item.id, title: item.title, maxMarks: item.maxMarks }];
    return item.subsections?.length ? [...current, ...renderNestedSubsections(item.subsections)] : current;
  });
}

export default function FacultySarForm() {
  return (
    <main style={page}>
      <div style={shell}>
        <header style={header}>
          <p style={eyebrow}>D. Y. Patil Agriculture and Technical University</p>
          <h1 style={title}>Annual Faculty Self Appraisal Report (SAR)</h1>
          <p style={subtitle}>
            Phase 1 foundation page for the new DYPATU SAR. This view lists the faculty evaluation structure from the SAR format and is isolated from the legacy appraisal forms.
          </p>
        </header>

        <section style={summaryGrid} aria-label="SAR maximum marks summary">
          <div style={summaryTile}>
            <p style={summaryLabel}>Faculty SAR</p>
            <p style={summaryValue}>{SAR_MAX_MARKS.facultySelfAppraisal}</p>
          </div>
          <div style={summaryTile}>
            <p style={summaryLabel}>Authority Appraisals</p>
            <p style={summaryValue}>25 each</p>
          </div>
          <div style={summaryTile}>
            <p style={summaryLabel}>Overall Total</p>
            <p style={summaryValue}>{SAR_MAX_MARKS.overall}</p>
          </div>
        </section>

        <section style={sectionGrid} aria-label="Faculty SAR sections">
          {SAR_SECTIONS.map((section) => (
            <article key={section.id} style={sectionCard}>
              <div style={sectionTop}>
                <div style={{ display: "flex", gap: 12, minWidth: 0 }}>
                  <span style={sectionNumber}>{section.number}</span>
                  <h2 style={sectionTitle}>{section.title}</h2>
                </div>
                <span style={marksBadge}>{section.maxMarks} marks</span>
              </div>

              <ul style={subsectionList}>
                {renderNestedSubsections(section.subsections).map((subsection) => (
                  <li key={subsection.id} style={subsectionItem}>
                    <span>{subsection.title}</span>
                    <span style={subsectionMarks}>{subsection.maxMarks}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section style={workflow} aria-label="SAR workflow stages">
          <p style={summaryLabel}>Workflow Stages Represented In PDF</p>
          <div style={workflowList}>
            {SAR_WORKFLOW_STAGES.map((stage) => (
              <span key={stage.id} style={workflowChip}>{stage.label}</span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
