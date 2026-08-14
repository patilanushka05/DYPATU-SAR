import { useState } from "react";
import { FINAL_SUMMARY_COLUMNS } from "./authoritySchema";

export default function FinalSummary() {
  const [nameOfFaculty, setNameOfFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [marksObtained, setMarksObtained] = useState(() =>
    Object.fromEntries(FINAL_SUMMARY_COLUMNS.map((column) => [column.key, ""])),
  );
  const [remarks, setRemarks] = useState(["", ""]);
  const [recommendations, setRecommendations] = useState("");

  const updateMarks = (key, value) => setMarksObtained((current) => ({ ...current, [key]: value }));
  const updateRemark = (index, value) =>
    setRemarks((current) => current.map((existing, existingIndex) => (existingIndex === index ? value : existing)));

  return (
    <section className="sar-panel" id="final-summary">
      <div className="sar-panel__heading">
        <div>
          <p className="sar-eyebrow">Summary</p>
          <h2>Summary</h2>
        </div>
        <span className="sar-max-marks-badge">Overall <strong>400</strong></span>
      </div>

      <div className="sar-general-grid">
        <label className="sar-field">
          <span>Name of Faculty</span>
          <input className="sar-input" value={nameOfFaculty} onChange={(event) => setNameOfFaculty(event.target.value)} />
        </label>
        <label className="sar-field">
          <span>Department</span>
          <input className="sar-input" value={department} onChange={(event) => setDepartment(event.target.value)} />
        </label>
      </div>

      <div className="sar-table-wrap">
        <table className="sar-table sar-final-summary-table">
          <thead>
            <tr>
              <th></th>
              {FINAL_SUMMARY_COLUMNS.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="sar-static-cell">Out of</td>
              {FINAL_SUMMARY_COLUMNS.map((column) => (
                <td key={column.key} className="sar-static-cell">{column.outOf}</td>
              ))}
            </tr>
            <tr>
              <td className="sar-static-cell">Marks Obtained</td>
              {FINAL_SUMMARY_COLUMNS.map((column) => (
                <td key={column.key}>
                  <input
                    className="sar-input"
                    type="number"
                    value={marksObtained[column.key]}
                    onChange={(event) => updateMarks(column.key, event.target.value)}
                    aria-label={`${column.label} obtained`}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="sar-field sar-field--wide sar-remarks-list">
        <span>Remarks</span>
        {remarks.map((value, index) => (
          <input
            key={index}
            className="sar-input"
            value={value}
            onChange={(event) => updateRemark(index, event.target.value)}
            aria-label={`Remark ${index + 1}`}
            placeholder={`${index + 1}.`}
          />
        ))}
      </div>

      <label className="sar-field sar-field--wide">
        <span>Recommendations</span>
        <textarea className="sar-input sar-textarea" value={recommendations} onChange={(event) => setRecommendations(event.target.value)} />
      </label>
    </section>
  );
}
