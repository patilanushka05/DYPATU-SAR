import { useState } from "react";
import FacultySarForm from "../../forms/FacultySarForm";
import { MOCK_PENDING_APPRAISALS } from "../mockApprovals";

// IMPORTANT: this page shows appraisals submitted by OTHER people who are
// waiting on the current (mocked) role's review — it is never the current
// role's own appraisal. "My Appraisal" (see MyAppraisalPage.jsx) is the only
// place that role's own SAR/appraisal-related form is shown.
export default function ApprovalPage() {
  const [viewingId, setViewingId] = useState(null);
  const viewingRecord = MOCK_PENDING_APPRAISALS.find((record) => record.id === viewingId);

  if (viewingRecord) {
    return (
      <div className="sar-page appraisal-form-shell">
        <div className="sar-approval-viewing-banner">
          <div>
            <p className="sar-eyebrow">Reviewing submission (mock data)</p>
            <h2>{viewingRecord.facultyName}</h2>
            <p>{viewingRecord.department} · {viewingRecord.academicYear}</p>
          </div>
          <button
            type="button"
            className="sar-row-actions__button sar-row-actions__button--add appraisal-add-row-button"
            onClick={() => setViewingId(null)}
          >
            ← Back to Approval list
          </button>
        </div>

        {/* Reuses the existing Faculty SAR UI to display the selected
            submission — no separate "review" component was invented. The
            form is not pre-filled with the mock row's data since no backend
            is connected yet. */}
        <FacultySarForm />
      </div>
    );
  }

  return (
    <div className="sar-page appraisal-form-shell">
      <div className="sar-panel">
        <div className="sar-panel__heading">
          <div>
            <p className="sar-eyebrow">Approval</p>
            <h2>Appraisals Pending Your Review</h2>
          </div>
          <span className="sar-max-marks-badge">Pending <strong>{MOCK_PENDING_APPRAISALS.length}</strong></span>
        </div>

        <p className="sar-approval-note">
          Local mock data for UI development only — no backend/API workflow is connected yet.
        </p>

        <div className="sar-table-wrap">
          <table className="sar-table sar-approval-table">
            <thead>
              <tr>
                <th>Faculty Name</th>
                <th>Department</th>
                <th>Academic Year</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PENDING_APPRAISALS.map((record) => (
                <tr key={record.id}>
                  <td className="sar-static-cell">{record.facultyName}</td>
                  <td className="sar-static-cell">{record.department}</td>
                  <td className="sar-static-cell">{record.academicYear}</td>
                  <td>
                    <span className={`sar-status-pill sar-status-pill--${record.status === "Submitted" ? "submitted" : "pending"}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>
                    <div className="sar-approval-actions">
                      <button
                        type="button"
                        className="sar-row-actions__button sar-row-actions__button--add appraisal-add-row-button"
                        onClick={() => setViewingId(record.id)}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="sar-row-actions__button"
                        disabled
                        title="Review/approve workflow is not implemented yet"
                      >
                        Review / Approve
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
