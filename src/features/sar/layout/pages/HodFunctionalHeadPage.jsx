import { AdministrativeResponsibility, HodAppraisal, ADMIN_RESPONSIBILITY_PART_A } from "../../authority";

export default function HodFunctionalHeadPage() {
  return (
    <div className="sar-page appraisal-form-shell">
      <div className="sar-authority-section">
        <HodAppraisal />

        {/*
          PDF page 15, "Evaluation of Administrative Responsibility — Part A", is explicitly
          scoped "To be filled by only Head of Departments", so it is placed on this HOD /
          Functional Head page. Whether a future distinct "Functional Head" role also files
          this section (as opposed to only HOD) is not defined by the PDF or current SAR
          config, and should be confirmed during the workflow-implementation phase.
        */}
        <AdministrativeResponsibility
          id="admin-responsibility-a"
          title="Evaluation of Administrative Responsibility — Part A"
          subtitle="To be filled by only Head of Departments (01 Mark each)"
          parameters={ADMIN_RESPONSIBILITY_PART_A}
          maxMarks={25}
        />
      </div>
    </div>
  );
}
