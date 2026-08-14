import { useState } from "react";
import RatingGrid from "./RatingGrid";
import { MARKS_RATING_COLUMNS } from "./authoritySchema";

export default function DeanAppraisal() {
  const [rating, setRating] = useState([null]);
  const [totalScore, setTotalScore] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleRatingChange = (_rowIndex, value) => setRating([value]);

  return (
    <section className="sar-panel" id="dean-appraisal">
      <div className="sar-panel__heading">
        <div>
          <p className="sar-eyebrow">Authority Appraisal</p>
          <h2>Dean (School) Appraisal Sheet</h2>
        </div>
        <span className="sar-max-marks-badge">Max Marks <strong>25</strong></span>
      </div>

      <RatingGrid
        idPrefix="dean-appraisal"
        columns={MARKS_RATING_COLUMNS}
        rows={["Involvement in college development (To be filled by Dean- School Only)"]}
        values={rating}
        onChange={handleRatingChange}
      />

      <div className="sar-authority-footer">
        <label className="sar-field">
          <span>Total Score out of (25)</span>
          <input className="sar-input" type="number" value={totalScore} onChange={(event) => setTotalScore(event.target.value)} />
        </label>
        <label className="sar-field sar-field--wide">
          <span>Any other Feedback by Dean (School)</span>
          <textarea className="sar-input sar-textarea" value={feedback} onChange={(event) => setFeedback(event.target.value)} />
        </label>
        <div className="sar-signature-line">Principal Signature</div>
      </div>
    </section>
  );
}
