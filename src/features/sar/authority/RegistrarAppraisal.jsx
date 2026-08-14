import { useState } from "react";
import RatingGrid from "./RatingGrid";
import { LEAVE_COLUMNS, MARKS_RATING_COLUMNS } from "./authoritySchema";

const emptyLeaveRow = () => Object.fromEntries(LEAVE_COLUMNS.map((column) => [column, ""]));

function LeaveTable({ taken, onTakenChange, outOf, onOutOfChange }) {
  return (
    <div className="sar-table-wrap">
      <table className="sar-table sar-leave-table">
        <thead>
          <tr>
            <th>No. of leaves taken in the Year</th>
            {LEAVE_COLUMNS.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="sar-static-cell">Taken</td>
            {LEAVE_COLUMNS.map((column) => (
              <td key={column}>
                <input
                  className="sar-input"
                  type="number"
                  value={taken[column]}
                  onChange={(event) => onTakenChange(column, event.target.value)}
                  aria-label={`${column} leaves taken`}
                />
              </td>
            ))}
          </tr>
          <tr>
            <td className="sar-static-cell">Out of</td>
            {LEAVE_COLUMNS.map((column) => (
              <td key={column}>
                <input
                  className="sar-input"
                  type="number"
                  value={outOf[column]}
                  onChange={(event) => onOutOfChange(column, event.target.value)}
                  aria-label={`${column} leaves out of`}
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function RegistrarAppraisal() {
  const [leavesTaken, setLeavesTaken] = useState(emptyLeaveRow);
  const [leavesOutOf, setLeavesOutOf] = useState(emptyLeaveRow);
  const [lateRemarks, setLateRemarks] = useState("");
  const [totalWorkingDays, setTotalWorkingDays] = useState("");
  const [leaveManagementRating, setLeaveManagementRating] = useState([null]);
  const [totalScore, setTotalScore] = useState("");
  const [feedback, setFeedback] = useState("");

  const updateLeavesTaken = (column, value) => setLeavesTaken((current) => ({ ...current, [column]: value }));
  const updateLeavesOutOf = (column, value) => setLeavesOutOf((current) => ({ ...current, [column]: value }));
  const handleLeaveManagementChange = (_rowIndex, value) => setLeaveManagementRating([value]);

  return (
    <section className="sar-panel" id="registrar-appraisal">
      <div className="sar-panel__heading">
        <div>
          <p className="sar-eyebrow">Authority Appraisal</p>
          <h2>Registrar Appraisal Sheet</h2>
        </div>
        <span className="sar-max-marks-badge">Max Marks <strong>25</strong></span>
      </div>

      <div className="sar-rating-legend">
        <div className="sar-rating-legend__item"><span className="sar-rating-legend__level">1. Unacceptable</span><span className="sar-rating-legend__range">0-5</span></div>
        <div className="sar-rating-legend__item"><span className="sar-rating-legend__level">2. Below Average</span><span className="sar-rating-legend__range">6-10</span></div>
        <div className="sar-rating-legend__item"><span className="sar-rating-legend__level">3. Average</span><span className="sar-rating-legend__range">11-15</span></div>
        <div className="sar-rating-legend__item"><span className="sar-rating-legend__level">4. Above Average</span><span className="sar-rating-legend__range">16-20</span></div>
        <div className="sar-rating-legend__item"><span className="sar-rating-legend__level">5. Outstanding</span><span className="sar-rating-legend__range">Above 20</span></div>
      </div>

      <LeaveTable
        taken={leavesTaken}
        onTakenChange={updateLeavesTaken}
        outOf={leavesOutOf}
        onOutOfChange={updateLeavesOutOf}
      />

      <div className="sar-general-grid sar-authority-inline-fields">
        <label className="sar-field">
          <span>No. of Late Remarks in the Year</span>
          <input className="sar-input" type="number" value={lateRemarks} onChange={(event) => setLateRemarks(event.target.value)} />
        </label>
        <label className="sar-field">
          <span>Total Actual Working Days for the current academic year</span>
          <input className="sar-input" type="number" value={totalWorkingDays} onChange={(event) => setTotalWorkingDays(event.target.value)} />
        </label>
      </div>

      <RatingGrid
        idPrefix="registrar-leave-management"
        columns={MARKS_RATING_COLUMNS}
        rows={["Management of leaves"]}
        values={leaveManagementRating}
        onChange={handleLeaveManagementChange}
      />

      <div className="sar-authority-footer">
        <label className="sar-field">
          <span>Total Score out of (25)</span>
          <input className="sar-input" type="number" value={totalScore} onChange={(event) => setTotalScore(event.target.value)} />
        </label>
        <label className="sar-field sar-field--wide">
          <span>Any other Feedback by Registrar</span>
          <textarea className="sar-input sar-textarea" value={feedback} onChange={(event) => setFeedback(event.target.value)} />
        </label>
        <div className="sar-signature-line">Registrar Signature</div>
      </div>
    </section>
  );
}
