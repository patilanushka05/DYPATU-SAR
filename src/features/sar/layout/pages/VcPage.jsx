import { FinalSummary, VcAppraisal } from "../../authority";

export default function VcPage() {
  return (
    <div className="sar-page appraisal-form-shell">
      <div className="sar-authority-section">
        <VcAppraisal />

        {/*
          Final Summary (PDF page 18) is the overall rollup that follows the Vice
          Chancellor appraisal sheet in the source document, so it is kept on the VC
          page. It remains a standalone view with local state only — no automatic
          aggregation or scoring is wired up yet.
        */}
        <FinalSummary />
      </div>
    </div>
  );
}
