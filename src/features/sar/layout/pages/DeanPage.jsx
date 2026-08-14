import { AdministrativeResponsibility, DeanAppraisal, ADMIN_RESPONSIBILITY_PART_B } from "../../authority";

export default function DeanPage() {
  return (
    <div className="sar-page appraisal-form-shell">
      <div className="sar-authority-section">
        <DeanAppraisal />

        {/*
          PDF page 16, "Evaluation of Administrative Responsibility — Part B", is scoped
          "To be filled by only Deans and All Functional Heads" — i.e. it spans both the
          Dean stage and the Functional Head half of the "HOD / Functional Head" stage.
          It is placed on this Dean page as a provisional choice since "Dean" is named
          first in the PDF's own subtitle; final role ownership between Dean and
          Functional Head should be confirmed during the workflow-implementation phase.
        */}
        <AdministrativeResponsibility
          id="admin-responsibility-b"
          title="Evaluation of Administrative Responsibility — Part B"
          subtitle="To be filled by only Deans and All Functional Heads (01 Mark each)"
          parameters={ADMIN_RESPONSIBILITY_PART_B}
          maxMarks={25}
        />
      </div>
    </div>
  );
}
