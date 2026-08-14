import { useState } from "react";

export default function AdministrativeResponsibility({ id, title, subtitle, parameters, maxMarks }) {
  const [rows, setRows] = useState(() => parameters.map(() => ({ selfScore: "", deanScore: "", vcScore: "" })));

  const updateCell = (rowIndex, key, value) => {
    setRows((current) => current.map((row, index) => (index === rowIndex ? { ...row, [key]: value } : row)));
  };

  return (
    <section className="sar-panel" id={id}>
      <div className="sar-panel__heading">
        <div>
          <p className="sar-eyebrow">Evaluation of Administrative Responsibility (25 Marks)</p>
          <h2>{title}</h2>
        </div>
        {maxMarks !== undefined && <span className="sar-max-marks-badge">Max Marks <strong>{maxMarks}</strong></span>}
      </div>

      {subtitle && <p className="sar-authority-subtitle">{subtitle}</p>}

      <div className="sar-table-wrap">
        <table className="sar-table">
          <thead>
            <tr>
              <th className="sar-sr-col">Sr. No.</th>
              <th>Parameters</th>
              <th>Self-Appraisal Score</th>
              <th>Dean (School) Score</th>
              <th>Vice Chancellor Score</th>
            </tr>
          </thead>
          <tbody>
            {parameters.map((parameter, index) => (
              <tr key={parameter}>
                <td className="sar-sr-col">{index + 1}</td>
                <td className="sar-static-cell">{parameter}</td>
                <td>
                  <input
                    className="sar-input"
                    type="number"
                    value={rows[index].selfScore}
                    onChange={(event) => updateCell(index, "selfScore", event.target.value)}
                    aria-label={`${parameter} self-appraisal score`}
                  />
                </td>
                <td>
                  <input
                    className="sar-input"
                    type="number"
                    value={rows[index].deanScore}
                    onChange={(event) => updateCell(index, "deanScore", event.target.value)}
                    aria-label={`${parameter} dean score`}
                  />
                </td>
                <td>
                  <input
                    className="sar-input"
                    type="number"
                    value={rows[index].vcScore}
                    onChange={(event) => updateCell(index, "vcScore", event.target.value)}
                    aria-label={`${parameter} vice chancellor score`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
