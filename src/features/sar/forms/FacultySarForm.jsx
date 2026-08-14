import { useMemo, useState } from "react";
import { FACULTY_SAR_TABLES, GENERAL_INFORMATION_FIELDS, SAR_MAX_MARKS, SUMMARY_PARAMETERS } from "../config";
import "./FacultySarForm.css";

const emptyValueFor = (column) => (column.type === "static" ? column.value || "" : "");

const createRowsForTable = (table) => {
  const sourceRows = table.rows?.length ? table.rows : [{}, {}];
  return sourceRows.map((sourceRow) =>
    Object.fromEntries(
      table.columns.map((column) => [
        column.key,
        sourceRow[column.key] ?? emptyValueFor(column),
      ]),
    ),
  );
};

const createInitialTables = () =>
  Object.fromEntries(
    FACULTY_SAR_TABLES.flatMap((section) =>
      section.groups.flatMap((group) =>
        group.tables.map((table) => [table.id, createRowsForTable(table)]),
      ),
    ),
  );

const createGeneralInfo = () =>
  Object.fromEntries(GENERAL_INFORMATION_FIELDS.map((field) => [field.key, ""]));

function FieldControl({ field, value, onChange }) {
  if (field.type === "textarea") {
    return (
      <textarea
        className="sar-input sar-textarea"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={field.label}
      />
    );
  }

  return (
    <input
      className="sar-input"
      type={field.type || "text"}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={field.label}
    />
  );
}

function CellControl({ column, value, onChange }) {
  if (column.type === "static") {
    return <span className="sar-static-cell">{value}</span>;
  }

  if (column.type === "select") {
    return (
      <select
        className="sar-input sar-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={column.label}
      >
        <option value="">Select</option>
        {column.options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    );
  }

  if (column.type === "textarea") {
    return (
      <textarea
        className="sar-input sar-cell-textarea"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={column.label}
      />
    );
  }

  return (
    <input
      className="sar-input"
      type={column.type || "text"}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={column.label}
    />
  );
}

function CriteriaList({ items }) {
  if (!items?.length) return null;
  return (
    <div className="sar-criteria">
      <div className="sar-criteria__title">Criteria from SAR format</div>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function GuidelineTable({ table }) {
  return (
    <div className="sar-guideline">
      <div className="sar-guideline__title">{table.title || "Guidelines"}</div>
      <div className="sar-table-wrap">
        <table className="sar-table sar-guideline-table">
          <thead>
            <tr>
              {table.columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {table.columns.map((column) => (
                  <td key={column.key}>{row[column.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SarTable({ table, rows, onCellChange, onAddRow, onRemoveRow }) {
  return (
    <section className="sar-table-card">
      <div className="sar-table-card__header">
        <div>
          <h4>{table.title}</h4>
          {table.subtitle && <p>{table.subtitle}</p>}
        </div>
        {table.maxMarks !== undefined && <span>{table.maxMarks} marks</span>}
      </div>

      <div className="sar-table-wrap">
        <table className="sar-table">
          <thead>
            <tr>
              <th className="sar-sr-col">Sr. No.</th>
              {table.columns.map((column) => (
                <th key={column.key} className={column.className || ""}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`${table.id}-${rowIndex}`}>
                <td className="sar-sr-col">{rowIndex + 1}</td>
                {table.columns.map((column) => (
                  <td key={column.key} className={column.className || ""}>
                    <CellControl
                      column={column}
                      value={row[column.key] ?? ""}
                      onChange={(nextValue) => onCellChange(table.id, rowIndex, column.key, nextValue)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!table.fixedRows && (
        <div className="sar-row-actions">
          <button
            type="button"
            className="sar-row-actions__button sar-row-actions__button--add appraisal-add-row-button"
            onClick={() => onAddRow(table)}
          >
            Add Row
          </button>
          <button
            type="button"
            className="sar-row-actions__button sar-row-actions__button--remove appraisal-danger-button"
            onClick={() => onRemoveRow(table)}
            disabled={rows.length <= 1}
          >
            Remove Last Row
          </button>
        </div>
      )}
    </section>
  );
}

function SectionBlock({ section, tableData, onCellChange, onAddRow, onRemoveRow }) {
  return (
    <article className="sar-section" id={section.sectionId}>
      <div className="sar-section__heading">
        <div className="sar-section__heading-main">
          <div className="sar-section__number">{section.number}</div>
          <h2>{section.title}</h2>
        </div>
        <span className="sar-max-marks-badge">Max Marks <strong>{section.maxMarks}</strong></span>
      </div>

      <CriteriaList items={section.criteria} />

      <div className="sar-section__groups">
        {section.groups.map((group) => (
          <div key={group.id} className="sar-group">
            <div className="sar-group__heading">
              <h3>{group.title}</h3>
              {group.maxMarks !== undefined && <span>{group.maxMarks} marks</span>}
            </div>

            <CriteriaList items={group.criteria} />

            {group.tables.map((table) => (
              <SarTable
                key={table.id}
                table={table}
                rows={tableData[table.id] || []}
                onCellChange={onCellChange}
                onAddRow={onAddRow}
                onRemoveRow={onRemoveRow}
              />
            ))}

            {group.guidelineTable && <GuidelineTable table={group.guidelineTable} />}
          </div>
        ))}
      </div>
    </article>
  );
}

export default function FacultySarForm() {
  const [generalInfo, setGeneralInfo] = useState(createGeneralInfo);
  const [tableData, setTableData] = useState(createInitialTables);
  const [periodOfAppraisal, setPeriodOfAppraisal] = useState("");
  const [assessmentYear, setAssessmentYear] = useState("");
  const [place, setPlace] = useState("Kolhapur");
  const [declarationDate, setDeclarationDate] = useState("");

  const navItems = useMemo(
    () => [
      { id: "general-information", label: "General" },
      ...FACULTY_SAR_TABLES.map((section) => ({ id: section.sectionId, label: `${section.number}. ${section.title}` })),
      { id: "summary", label: "Summary" },
    ],
    [],
  );

  const updateGeneralInfo = (key, value) => {
    setGeneralInfo((current) => ({ ...current, [key]: value }));
  };

  const updateTableCell = (tableId, rowIndex, key, value) => {
    setTableData((current) => ({
      ...current,
      [tableId]: current[tableId].map((row, index) =>
        index === rowIndex ? { ...row, [key]: value } : row,
      ),
    }));
  };

  const addRow = (table) => {
    const emptyRow = Object.fromEntries(table.columns.map((column) => [column.key, emptyValueFor(column)]));
    setTableData((current) => ({
      ...current,
      [table.id]: [...(current[table.id] || []), emptyRow],
    }));
  };

  const removeRow = (table) => {
    setTableData((current) => ({
      ...current,
      [table.id]: (current[table.id] || []).slice(0, -1),
    }));
  };

  return (
    <div className="sar-page appraisal-form-shell">
      <header className="sar-hero">
        <div>
          <p className="sar-eyebrow">D. Y. Patil Agriculture and Technical University, Talsande, Kolhapur</p>
          <h1>Annual Faculty Self Appraisal Report (SAR)</h1>
          <p className="sar-hero__copy">
            Faculty SAR frontend based on the university PDF format. This Phase 2 screen uses local React state only.
          </p>
        </div>
        <div className="sar-hero__marks">
          <span>Faculty Evaluation</span>
          <strong>{SAR_MAX_MARKS.facultySelfAppraisal}</strong>
          <span>marks</span>
        </div>
      </header>

      <nav className="sar-nav" aria-label="SAR form sections">
        {navItems.map((item) => (
          <a key={item.id} href={`#${item.id}`}>{item.label}</a>
        ))}
      </nav>

      <section className="sar-panel sar-cover">
        <div>
          <p className="sar-eyebrow">Submitted by</p>
          <input
            className="sar-input sar-cover__input"
            value={generalInfo.fullName}
            onChange={(event) => updateGeneralInfo("fullName", event.target.value)}
            aria-label="Submitted by"
          />
          <input
            className="sar-input sar-cover__input"
            value={generalInfo.currentDesignation}
            onChange={(event) => updateGeneralInfo("currentDesignation", event.target.value)}
            aria-label="Designation"
            placeholder="Designation"
          />
          <input
            className="sar-input sar-cover__input"
            value={generalInfo.department}
            onChange={(event) => updateGeneralInfo("department", event.target.value)}
            aria-label="Department"
            placeholder="Department"
          />
        </div>
        <label>
          Assessment Year
          <input className="sar-input" value={assessmentYear} onChange={(event) => setAssessmentYear(event.target.value)} />
        </label>
        <label>
          Period of Appraisal: A. Y., Semester-I & Semester II
          <input className="sar-input" value={periodOfAppraisal} onChange={(event) => setPeriodOfAppraisal(event.target.value)} />
        </label>
      </section>

      <section className="sar-panel" id="general-information">
        <div className="sar-panel__heading">
          <div>
            <p className="sar-eyebrow">Part A</p>
            <h2>General Information and Academic Background</h2>
          </div>
        </div>
        <div className="sar-general-grid">
          {GENERAL_INFORMATION_FIELDS.map((field) => (
            <label key={field.key} className={field.type === "textarea" ? "sar-field sar-field--wide" : "sar-field"}>
              <span>{field.label}</span>
              <FieldControl
                field={field}
                value={generalInfo[field.key]}
                onChange={(value) => updateGeneralInfo(field.key, value)}
              />
            </label>
          ))}
        </div>
      </section>

      {FACULTY_SAR_TABLES.map((section) => (
        <SectionBlock
          key={section.sectionId}
          section={section}
          tableData={tableData}
          onCellChange={updateTableCell}
          onAddRow={addRow}
          onRemoveRow={removeRow}
        />
      ))}

      <section className="sar-panel" id="summary">
        <div className="sar-panel__heading">
          <div>
            <p className="sar-eyebrow">Summary of Evaluation Marks</p>
            <h2>Major Parameters Assessment of Teachers Evaluation</h2>
          </div>
          <span className="sar-total-pill">Total Marks {SAR_MAX_MARKS.facultySelfAppraisal}</span>
        </div>

        <div className="sar-table-wrap">
          <table className="sar-table sar-summary-table">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Major Parameters</th>
                <th>Assessment of Teachers Evaluation (300 Marks)</th>
                <th>Self-appraisal Score</th>
                <th>HoD Score</th>
                <th>Committee Score</th>
              </tr>
            </thead>
            <tbody>
              {SUMMARY_PARAMETERS.map((row) => (
                <tr key={row.number}>
                  <td>{row.number}</td>
                  <td>{row.title}</td>
                  <td>{row.maxMarks}</td>
                  <td><input className="sar-input" type="number" aria-label={`${row.title} self score`} /></td>
                  <td><input className="sar-input" type="number" aria-label={`${row.title} HOD score`} /></td>
                  <td><input className="sar-input" type="number" aria-label={`${row.title} committee score`} /></td>
                </tr>
              ))}
              <tr className="sar-total-row">
                <td colSpan="2">Total Marks</td>
                <td>{SAR_MAX_MARKS.facultySelfAppraisal}</td>
                <td><input className="sar-input" type="number" aria-label="Total self score" /></td>
                <td><input className="sar-input" type="number" aria-label="Total HOD score" /></td>
                <td><input className="sar-input" type="number" aria-label="Total committee score" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="sar-declaration">
          <p>I hereby declare that, the information given above by me is true & correct to the best of my knowledge & belief.</p>
          <div className="sar-signature-grid">
            <label>Place<input className="sar-input" value={place} onChange={(event) => setPlace(event.target.value)} /></label>
            <label>Date<input className="sar-input" type="date" value={declarationDate} onChange={(event) => setDeclarationDate(event.target.value)} /></label>
            <div>Applicant Signature</div>
            <div>H.O.D</div>
            <div>Committee Member 1</div>
            <div>Committee Member 2</div>
            <div>Committee Member 3</div>
          </div>
        </div>
      </section>
    </div>
  );
}
