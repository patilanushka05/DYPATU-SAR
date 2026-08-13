import { useState } from "react";
import RatingGrid from "./RatingGrid";
import { HOD_APPRAISAL_PARAMETERS, RATING_COLUMNS, RATING_LEGEND } from "./authoritySchema";

export default function HodAppraisal() {
  const [ratings, setRatings] = useState(() => HOD_APPRAISAL_PARAMETERS.map(() => null));
  const [totalScore, setTotalScore] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleRatingChange = (rowIndex, value) => {
    setRatings((current) => current.map((existing, index) => (index === rowIndex ? value : existing)));
  };

  return (
    <section className="sar-panel" id="hod-appraisal">
      <div className="sar-panel__heading">
        <div>
          <p className="sar-eyebrow">Authority Appraisal</p>
          <h2>HOD Appraisal Sheet</h2>
        </div>
      </div>

      <RatingGrid
        idPrefix="hod-appraisal"
        columns={RATING_COLUMNS}
        rows={HOD_APPRAISAL_PARAMETERS}
        values={ratings}
        onChange={handleRatingChange}
        legend={RATING_LEGEND}
        showPleaseTick
      />

      <div className="sar-authority-footer">
        <label className="sar-field">
          <span>Total Score out of (25)</span>
          <input className="sar-input" type="number" value={totalScore} onChange={(event) => setTotalScore(event.target.value)} />
        </label>
        <label className="sar-field sar-field--wide">
          <span>Remarks If Any</span>
          <textarea className="sar-input sar-textarea" value={remarks} onChange={(event) => setRemarks(event.target.value)} />
        </label>
        <div className="sar-signature-line">HoD Signature</div>
      </div>
    </section>
  );
}
