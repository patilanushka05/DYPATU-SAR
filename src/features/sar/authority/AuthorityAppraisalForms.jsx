import HodAppraisal from "./HodAppraisal";
import RegistrarAppraisal from "./RegistrarAppraisal";
import AdministrativeResponsibility from "./AdministrativeResponsibility";
import DeanAppraisal from "./DeanAppraisal";
import VcAppraisal from "./VcAppraisal";
import FinalSummary from "./FinalSummary";
import { ADMIN_RESPONSIBILITY_PART_A, ADMIN_RESPONSIBILITY_PART_B } from "./authoritySchema";
import "./AuthorityAppraisalForms.css";

export default function AuthorityAppraisalForms() {
  return (
    <div className="sar-authority-section">
      <HodAppraisal />
      <RegistrarAppraisal />
      <AdministrativeResponsibility
        id="admin-responsibility-a"
        title="Evaluation of Administrative Responsibility — Part A"
        subtitle="To be filled by only Head of Departments (01 Mark each)"
        parameters={ADMIN_RESPONSIBILITY_PART_A}
      />
      <AdministrativeResponsibility
        id="admin-responsibility-b"
        title="Evaluation of Administrative Responsibility — Part B"
        subtitle="To be filled by only Deans and All Functional Heads (01 Mark each)"
        parameters={ADMIN_RESPONSIBILITY_PART_B}
      />
      <DeanAppraisal />
      <VcAppraisal />
      <FinalSummary />
    </div>
  );
}
