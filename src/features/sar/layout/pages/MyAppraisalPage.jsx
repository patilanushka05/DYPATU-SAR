import FacultySarForm from "../../forms/FacultySarForm";
import {
  AdministrativeResponsibility,
  DeanAppraisal,
  FinalSummary,
  HodAppraisal,
  RegistrarAppraisal,
  VcAppraisal,
  ADMIN_RESPONSIBILITY_PART_A,
  ADMIN_RESPONSIBILITY_PART_B,
} from "../../authority";

function HodMyAppraisal() {
  return (
    <>
      <HodAppraisal />
      {/*
        PDF page 15, "Evaluation of Administrative Responsibility — Part A", is
        explicitly scoped "To be filled by only Head of Departments", so it is
        shown as part of the HOD's own appraisal.
      */}
      <AdministrativeResponsibility
        id="admin-responsibility-a"
        title="Evaluation of Administrative Responsibility — Part A"
        subtitle="To be filled by only Head of Departments (01 Mark each)"
        parameters={ADMIN_RESPONSIBILITY_PART_A}
        maxMarks={25}
      />
    </>
  );
}

function FunctionalHeadMyAppraisal() {
  return (
    <>
      {/*
        The PDF has no distinct "Functional Head appraisal sheet". Part B,
        "Evaluation of Administrative Responsibility — Part B" (PDF page 16),
        is the only PDF content that explicitly names Functional Heads as
        filers ("To be filled by only Deans and All Functional Heads"), so it
        is shown here as this role's own appraisal.

        Whether a Functional Head should also see the shared "HOD / Dean /
        Functional Head" sheet (HodAppraisal — the PDF's Final Summary buckets
        HOD, Dean, and Functional Head into one combined 25-mark score) is
        ambiguous from the PDF alone and should be confirmed during the
        workflow-implementation phase.
      */}
      <AdministrativeResponsibility
        id="admin-responsibility-b"
        title="Evaluation of Administrative Responsibility — Part B"
        subtitle="To be filled by only Deans and All Functional Heads (01 Mark each)"
        parameters={ADMIN_RESPONSIBILITY_PART_B}
        maxMarks={25}
      />
    </>
  );
}

function DeanMyAppraisal() {
  return (
    <>
      <DeanAppraisal />
      {/*
        Part B ("Deans and All Functional Heads") is shown on the Functional
        Head page instead of duplicating it here, since the PDF names both
        roles jointly for that section — see the note in
        FunctionalHeadMyAppraisal above. This split is provisional pending the
        workflow-implementation phase.
      */}
    </>
  );
}

function VcMyAppraisal() {
  return (
    <>
      <VcAppraisal />
      {/* Final Summary (PDF page 18) follows the VC appraisal sheet in the
          source document and is kept alongside it here, with no automatic
          aggregation or scoring wired up. */}
      <FinalSummary />
    </>
  );
}

const ROLE_CONTENT = {
  hod: HodMyAppraisal,
  functionalHead: FunctionalHeadMyAppraisal,
  registrar: RegistrarAppraisal,
  dean: DeanMyAppraisal,
  viceChancellor: VcMyAppraisal,
};

export default function MyAppraisalPage({ roleId }) {
  if (roleId === "faculty") {
    return <FacultySarForm />;
  }

  const RoleContent = ROLE_CONTENT[roleId];
  if (!RoleContent) return null;

  return (
    <div className="sar-page appraisal-form-shell">
      <div className="sar-authority-section">
        <RoleContent />
      </div>
    </div>
  );
}
