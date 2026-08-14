/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../../services/api";
import { getActiveAcademicYear, getSessionItem, setActiveAcademicYear } from "../../../../auth/session";
import {
  canEditSelfAppraisal,
} from "../../../../services/appraisalWindowService";
import {
  APP_INFO,
} from "../../config";
import {
  loadAppraisalDocuments,
  loadSavedAppraisal,
  saveAppraisalDraftSection,
  submitAppraisal,
} from "../../services";
import {
  clampScore,
  isValidDDMMYYYY,
  maskDateDDMMYYYY,
} from "../../utils";
import {
  AppraisalHeaderImage,
  DocCell,
  RejectionNotice,
  RowButtons as RowBtns,
  SectionCard as SC,
  T,
  TD,
  TDC,
  TDS,
  TH,
  ViewCell,
} from "../../components";
import {
  RO,
  TI,
  WorkflowStatusTracker,
} from "../../shared";
import {
  profileFromsessionStorage,
  roleLabel,
} from "../../../../utils/hierarchy";
import { getSchoolByValue } from "../../../../constants/universityHierarchy";

// Helper SVG Icon component
function InlineSvgIcon({ paths, size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {Array.isArray(paths) ? paths.map((p, i) => <path key={i} d={p} />) : <path d={paths} />}
    </svg>
  );
}

function SubsectionTitle({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0 12px", fontSize: 15, fontWeight: 800, color: "#1e293b", borderBottom: "2px solid #e2e8f0", paddingBottom: 6 }}>
      <span style={{ color: "#4f46e5", fontSize: 18 }}>•</span>
      <span>{children}</span>
    </div>
  );
}

function SectionNavFooter({ prevSection, nextSection, onNavigate }) {
  const labels = {
    partA: "Part A — General Information",
    sec1: "Section 1 — Teaching-Learning Process",
    sec2: "Section 2 — Feedback from Students",
    sec3: "Section 3 — Administrative Responsibilities",
    sec4: "Section 4 — Evaluation & Assessment",
    sec5: "Section 5 — Extension & Outreach",
    sec6: "Section 6 — Domain Specific Activities",
    sec7: "Section 7 — Student Mentoring",
    sec8: "Section 8 — Collaborations",
    sec9: "Section 9 — Research Activity",
    sec10: "Section 10 — Personal Attributes",
    summary: "Summary of Evaluation Marks",
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e2e8f0", paddingTop: 16, marginTop: 24, gap: 12, flexWrap: "wrap" }}>
      {prevSection ? (
        <button
          type="button"
          onClick={() => onNavigate(prevSection)}
          style={{ padding: "10px 18px", background: "#f1f5f9", color: "#334155", border: "1px solid #cbd5e1", borderRadius: 9, cursor: "pointer", fontWeight: 800, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          ← Previous: {labels[prevSection]}
        </button>
      ) : <div />}

      {nextSection ? (
        <button
          type="button"
          onClick={() => onNavigate(nextSection)}
          style={{ padding: "10px 18px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 9, cursor: "pointer", fontWeight: 800, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6, boxShadow: "0 4px 14px rgba(79,70,229,0.28)" }}
        >
          Next: {labels[nextSection]} →
        </button>
      ) : <div />}
    </div>
  );
}

const SUMMARY_ICONS = {
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  document: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6",
};

// --- SCORING HELPER FUNCTIONS ---

function calcWorkloadRowScore(planned, conducted) {
  const p = Number(planned) || 0;
  const c = Number(conducted) || 0;
  if (p <= 0 || c < 0) return 0;
  const pct = (c / p) * 100;
  if (pct >= 85) return 20;
  if (pct >= 75) return 15;
  if (pct >= 60) return 12;
  if (pct >= 50) return 10;
  return 0;
}

function calcFeedbackSemScore(rows) {
  if (!rows || rows.length === 0) return 0;
  const validPcts = rows.map((r) => Number(r.feedbackPct)).filter((v) => !isNaN(v) && v > 0);
  if (validPcts.length === 0) return 0;
  const avg = validPcts.reduce((a, b) => a + b, 0) / validPcts.length;
  if (avg >= 85) return 5;
  if (avg >= 75) return 4;
  if (avg >= 70) return 3;
  if (avg >= 65) return 2;
  if (avg >= 60) return 1;
  return 0;
}

function calcResultAnalysisRowScore(passingPct, difficulty) {
  const pct = Number(passingPct) || 0;
  const diff = String(difficulty || "Easy").toLowerCase();
  if (diff === "easy") {
    if (pct >= 80) return 7;
    if (pct >= 70) return 6;
    if (pct >= 65) return 5;
    if (pct >= 60) return 4;
    if (pct >= 55) return 3;
    return 0;
  }
  if (diff === "medium") {
    if (pct >= 70) return 7;
    if (pct >= 65) return 6;
    if (pct >= 60) return 5;
    if (pct >= 55) return 4;
    if (pct >= 50) return 3;
    return 0;
  }
  if (diff === "high" || diff === "difficult") {
    if (pct >= 60) return 7;
    if (pct >= 55) return 6;
    if (pct >= 50) return 5;
    if (pct >= 45) return 4;
    if (pct >= 40) return 3;
    return 0;
  }
  return 0;
}

const FIXED_EXAM_DUTIES = [
  "Paper Setting",
  "Paper Assessment",
  "Supervision",
  "Internal Examiner Duty",
  "Flying Squad",
  "CAP Director",
];

const FIXED_OBE_ITEMS = [
  "CO-PO-PSO Justification sheets for all courses available",
  "Articulation Matrix of CO-PO-PSO Mapping is available",
  "Course outcome attainment calculated for all courses",
  "PSO & Program outcome attainment through CO calculated",
  "Activity Plan to overcome the gaps",
];

const FIXED_PERSONAL_ATTRIBUTES = [
  "Attitude towards work",
  "Sense of responsibility",
  "Overall behavior and personality",
  "Emotional Stability",
  "Communication Skills",
  "Professional Skills",
  "Moral courage and willingness",
  "Leadership qualities",
  "Capacity to work within timeframe",
  "Decision making ability",
];

export default function StandardMyAppraisal({
  sectionTab,
  onSectionTabChange,
  showSectionSelector = true,
  defaultDesignation = sessionStorage.getItem("designation") || "",
  defaultAcademicYear = getActiveAcademicYear(),
  titleNameFallback = "Faculty",
  subtitleSeparator = ".",
} = {}) {
  const navigate = useNavigate();
  const [localAppraisalTab, setLocalAppraisalTab] = useState("partA");
  const hodAppraisalTab = sectionTab || localAppraisalTab;
  const setHodAppraisalTab = onSectionTabChange || setLocalAppraisalTab;
  const resolvedAcademicYear = defaultAcademicYear || getActiveAcademicYear();

  // Part A General Info
  const [info, setInfo] = useState({
    name: sessionStorage.getItem("full_name") || sessionStorage.getItem("username") || "",
    department: sessionStorage.getItem("department") || "",
    designation: defaultDesignation || sessionStorage.getItem("designation") || "",
    highestQualification: sessionStorage.getItem("qualification") || "",
    qualImprovement: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    nationality: "Indian",
    correspondenceAddress: "",
    permanentAddress: "",
    mobile: sessionStorage.getItem("phone") || "",
    email: sessionStorage.getItem("email") || "",
    ay: resolvedAcademicYear,
  });

  // --- SECTION 1 STATE ---
  const [sem1Workload, setSem1Workload] = useState([
    { class: "", subject: "", planned: "", conducted: "" },
  ]);
  const [sem2Workload, setSem2Workload] = useState([
    { class: "", subject: "", planned: "", conducted: "" },
  ]);
  const [eContentRows, setEContentRows] = useState([
    { subject: "", topic: "", link: "", score: "" },
  ]);
  const [innovRows, setInnovRows] = useState([
    { subject: "", innovation: "", description: "", score: "" },
  ]);

  // --- SECTION 2 STATE ---
  const [sem1Feedback, setSem1Feedback] = useState([{ subject: "", feedbackPct: "" }]);
  const [sem2Feedback, setSem2Feedback] = useState([{ subject: "", feedbackPct: "" }]);

  // --- SECTION 3 STATE ---
  const [instAdmin, setInstAdmin] = useState([
    { name: "", role: "Institute Level Coordinator/Head" },
  ]);
  const [deptAdmin, setDeptAdmin] = useState([
    { name: "", role: "Department Level Coordinator" },
  ]);

  // --- SECTION 4 STATE ---
  const [sem1Results, setSem1Results] = useState([
    { subject: "", passingPct: "", prevYearResult: "", difficulty: "Easy" },
  ]);
  const [sem2Results, setSem2Results] = useState([
    { subject: "", passingPct: "", prevYearResult: "", difficulty: "Easy" },
  ]);
  const [examDuties, setExamDuties] = useState(
    FIXED_EXAM_DUTIES.map((duty) => ({ duty, details: "", score: "0" }))
  );

  // --- SECTION 5 STATE ---
  const [extensionActs, setExtensionActs] = useState([
    { particular: "", hours: "", dateFrom: "", dateTo: "", score: "5" },
  ]);

  // --- SECTION 6 STATE ---
  const [obeRows, setObeRows] = useState(
    FIXED_OBE_ITEMS.map((item) => ({ particular: item, available: "No" }))
  );
  const [partEvents, setPartEvents] = useState([
    { event: "", organizedBy: "", dateDuration: "", score: "5" },
  ]);
  const [condEvents, setCondEvents] = useState([
    { event: "", date: "", duration: "", score: "5" },
  ]);
  const [invitedTeachers, setInvitedTeachers] = useState([
    { event: "", organizedBy: "", dateDuration: "", level: "University" },
  ]);
  const [nptelCerts, setNptelCerts] = useState([
    { subject: "", duration: "", dateCompletion: "", pctScore: "", score: "5" },
  ]);

  // --- SECTION 7 STATE ---
  const [internships, setInternships] = useState([
    { studentName: "", industryName: "", stipendDuration: "", progressReport: "No" },
  ]);
  const [mentoringRows, setMentoringRows] = useState([
    { classDiv: "", numStudents: "", freqMeetings: "", totalMeetings: "" },
  ]);

  // --- SECTION 8 STATE ---
  const [collaborations, setCollaborations] = useState([
    { particular: "", industryName: "", nature: "", score: "5" },
  ]);
  const [sponsoredProjects, setSponsoredProjects] = useState([
    { projectTitle: "", amount: "", sponsoringAgency: "", score: "5" },
  ]);

  // --- SECTION 9 STATE ---
  const [researchGrants, setResearchGrants] = useState([
    { title: "", fundingAgency: "", grantAmount: "", score: "" },
  ]);
  const [ugcJournals, setUgcJournals] = useState([
    { title: "", journal: "", publisher: "", issn: "", authorPosition: "1st Author" },
  ]);
  const [indexedJournals, setIndexedJournals] = useState([
    { title: "", journal: "", citationIndex: "", hIndex: "", authorPosition: "1st Author" },
  ]);
  const [conferences, setConferences] = useState([
    { title: "", conference: "", proceedingsTitle: "", score: "2.5" },
  ]);
  const [booksChapters, setBooksChapters] = useState([
    { type: "Book", title: "", chapterName: "", publisher: "" },
  ]);
  const [reviewerEditorial, setReviewerEditorial] = useState([
    { journalBook: "", level: "National", role: "Reviewer", score: "5" },
  ]);
  const [patentsCopyrights, setPatentsCopyrights] = useState([
    { title: "", type: "Copyright", appNo: "", status: "Filed" },
  ]);
  const [developmentActs, setDevelopmentActs] = useState([
    { activity: "", fundingAmount: "", score: "5" },
  ]);
  const [consultancyRows, setConsultancyRows] = useState([
    { area: "", fundsGenerated: "", score: "5" },
  ]);
  const [awardsRows, setAwardsRows] = useState([
    { particular: "", agency: "", score: "5" },
  ]);
  const [otherAchievements, setOtherAchievements] = useState([
    { achievement: "", level: "", score: "5" },
  ]);

  // --- SECTION 10 STATE ---
  const [personalAttributes, setPersonalAttributes] = useState(
    FIXED_PERSONAL_ATTRIBUTES.map((attr) => ({ attribute: attr, score: "1" }))
  );

  const [docs, setDocs] = useState({});

  // --- SCORE CALCULATIONS ---

  // Sec 1
  const sem1WorkloadScores = sem1Workload.map((r) => calcWorkloadRowScore(r.planned, r.conducted));
  const sem1WorkloadMax = sem1WorkloadScores.length > 0 ? Math.max(...sem1WorkloadScores, 0) : 0;
  const sem1WorkloadScore = Math.min(20, sem1WorkloadMax);

  const sem2WorkloadScores = sem2Workload.map((r) => calcWorkloadRowScore(r.planned, r.conducted));
  const sem2WorkloadMax = sem2WorkloadScores.length > 0 ? Math.max(...sem2WorkloadScores, 0) : 0;
  const sem2WorkloadScore = Math.min(20, sem2WorkloadMax);

  const eContentScore = Math.min(6, eContentRows.reduce((sum, r) => sum + (Number(r.score) || 3), 0));
  const innovScore = Math.min(4, innovRows.reduce((sum, r) => sum + (Number(r.score) || 2), 0));
  const sec1Total = Math.min(50, sem1WorkloadScore + sem2WorkloadScore + eContentScore + innovScore);

  // Sec 2
  const sem1FeedbackScore = calcFeedbackSemScore(sem1Feedback);
  const sem2FeedbackScore = calcFeedbackSemScore(sem2Feedback);
  const sec2Total = Math.min(10, sem1FeedbackScore + sem2FeedbackScore);

  // Sec 3
  const instAdminScore = instAdmin.reduce((sum, r) => sum + (r.role === "Institute Level Coordinator/Head" ? 10 : 3), 0);
  const deptAdminScore = deptAdmin.reduce((sum, r) => sum + (r.role === "Department Level Coordinator" ? 5 : 1), 0);
  const sec3Total = Math.min(20, instAdminScore + deptAdminScore);

  // Sec 4
  const sem1ResScores = sem1Results.map((r) => calcResultAnalysisRowScore(r.passingPct, r.difficulty));
  const sem1ResultScore = Math.min(7, sem1ResScores.length > 0 ? Math.max(...sem1ResScores, 0) : 0);

  const sem2ResScores = sem2Results.map((r) => calcResultAnalysisRowScore(r.passingPct, r.difficulty));
  const sem2ResultScore = Math.min(7, sem2ResScores.length > 0 ? Math.max(...sem2ResScores, 0) : 0);

  const examDutiesScore = Math.min(6, examDuties.reduce((sum, r) => sum + (Number(r.score) || 0), 0));
  const sec4Total = Math.min(20, sem1ResultScore + sem2ResultScore + examDutiesScore);

  // Sec 5
  const sec5Total = Math.min(10, extensionActs.reduce((sum, r) => sum + (Number(r.score) || 5), 0));

  // Sec 6
  const obeScore = Math.min(20, obeRows.reduce((sum, r) => sum + (r.available === "Yes" ? 4 : 0), 0));
  const partEventsScore = Math.min(15, partEvents.reduce((sum, r) => sum + (Number(r.score) || 5), 0));
  const condEventsScore = Math.min(10, condEvents.reduce((sum, r) => sum + (Number(r.score) || 5), 0));
  const invitedScore = Math.min(5, invitedTeachers.reduce((sum, r) => {
    const lvl = r.level;
    const pts = lvl === "International" ? 5 : lvl === "National" ? 3 : lvl === "State" ? 2 : 1;
    return sum + pts;
  }, 0));
  const nptelScore = Math.min(10, nptelCerts.reduce((sum, r) => sum + (Number(r.score) || 5), 0));
  const sec6Total = Math.min(60, obeScore + partEventsScore + condEventsScore + invitedScore + nptelScore);

  // Sec 7
  const internshipScore = Math.min(10, internships.reduce((sum, r) => sum + (r.progressReport === "Yes" ? 5 : 0), 0));
  const mentoringScore = Math.min(10, mentoringRows.reduce((sum, r) => sum + (Number(r.totalMeetings) * 2.5 || 0), 0));
  const sec7Total = Math.min(20, internshipScore + mentoringScore);

  // Sec 8
  const collabScore = Math.min(10, collaborations.reduce((sum, r) => sum + (Number(r.score) || 5), 0));
  const sponsoredScore = Math.min(10, sponsoredProjects.reduce((sum, r) => sum + (Number(r.score) || 5), 0));
  const sec8Total = Math.min(20, collabScore + sponsoredScore);

  // Sec 9
  const grantsScore = Math.min(10, researchGrants.reduce((sum, r) => sum + (Number(r.score) || 5), 0));
  const ugcScore = Math.min(10, ugcJournals.reduce((sum, r) => {
    const pos = r.authorPosition;
    const pts = pos === "1st Author" ? 3 : pos === "2nd Author" ? 2 : 1;
    return sum + pts;
  }, 0));
  const indexedScore = Math.min(10, indexedJournals.reduce((sum, r) => {
    const pos = r.authorPosition;
    const pts = pos === "1st Author" ? 10 : pos === "2nd Author" ? 8 : pos === "3rd Author" ? 6 : 3;
    return sum + pts;
  }, 0));
  const confsScore = Math.min(5, conferences.reduce((sum, r) => sum + (Number(r.score) || 2.5), 0));
  const booksScore = Math.min(5, booksChapters.reduce((sum, r) => sum + (r.type === "Book" ? 5 : 2.5), 0));
  const reviewerScore = Math.min(5, reviewerEditorial.reduce((sum, r) => sum + (Number(r.score) || 5), 0));
  const patentsScore = Math.min(10, patentsCopyrights.reduce((sum, r) => {
    const t = r.type;
    const pts = t === "Utility Patent" ? 10 : t === "Design Patent" ? 5 : 2.5;
    return sum + pts;
  }, 0));
  const devScore = Math.min(5, developmentActs.reduce((sum, r) => sum + (Number(r.score) || 5), 0));
  const consultScore = Math.min(5, consultancyRows.reduce((sum, r) => sum + (Number(r.score) || 5), 0));
  const awdScore = Math.min(5, awardsRows.reduce((sum, r) => sum + (Number(r.score) || 5), 0));
  const othScore = Math.min(10, otherAchievements.reduce((sum, r) => sum + (Number(r.score) || 5), 0));
  const sec9Total = Math.min(80, grantsScore + ugcScore + indexedScore + confsScore + booksScore + reviewerScore + patentsScore + devScore + consultScore + awdScore + othScore);

  // Sec 10
  const sec10Total = Math.min(10, personalAttributes.reduce((sum, r) => sum + (Number(r.score) || 0), 0));

  // Grand Total out of 300
  const grandTotal = sec1Total + sec2Total + sec3Total + sec4Total + sec5Total + sec6Total + sec7Total + sec8Total + sec9Total + sec10Total;

  // Section options array
  const sectionOptions = [
    ["partA", "Part A — General Information"],
    ["sec1", "Section 1 — Teaching-Learning Process"],
    ["sec2", "Section 2 — Feedback from Students"],
    ["sec3", "Section 3 — Administrative Responsibilities"],
    ["sec4", "Section 4 — Evaluation & Assessment"],
    ["sec5", "Section 5 — Extension & Outreach"],
    ["sec6", "Section 6 — Domain Specific Activities"],
    ["sec7", "Section 7 — Student Mentoring"],
    ["sec8", "Section 8 — Collaborations"],
    ["sec9", "Section 9 — Research Activity"],
    ["sec10", "Section 10 — Personal Attributes"],
    ["summary", "Summary of Evaluation Marks"],
  ];

  const handleMyAppraisalSectionChange = (section) => {
    setHodAppraisalTab(section);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  // Dummy test data filler
  const fillStandardDummyData = () => {
    setSem1Workload([
      { class: "B.Tech CSE Sem 5", subject: "Database Systems", planned: "45", conducted: "42" },
      { class: "B.Tech CSE Sem 3", subject: "Data Structures", planned: "40", conducted: "38" },
    ]);
    setSem2Workload([
      { class: "B.Tech CSE Sem 6", subject: "Web Development", planned: "42", conducted: "40" },
    ]);
    setEContentRows([
      { subject: "Database Systems", topic: "SQL Indexing Video Lecture", link: "https://youtube.com/example", score: "3" },
      { subject: "Data Structures", topic: "Binary Search Tree Animation", link: "https://portal.dypiu.ac.in", score: "3" },
    ]);
    setInnovRows([
      { subject: "Web Development", innovation: "Project-Based Learning", description: "Students built full stack web apps", score: "2" },
      { subject: "Database Systems", innovation: "Flipped Classroom", description: "Active problem solving sessions", score: "2" },
    ]);
    setSem1Feedback([
      { subject: "Database Systems", feedbackPct: "88" },
      { subject: "Data Structures", feedbackPct: "86" },
    ]);
    setSem2Feedback([
      { subject: "Web Development", feedbackPct: "90" },
    ]);
    setInstAdmin([
      { name: "NAAC Steering Committee", role: "Institute Level Coordinator/Head" },
    ]);
    setDeptAdmin([
      { name: "Department Timetable Committee", role: "Department Level Coordinator" },
    ]);
    setSem1Results([
      { subject: "Database Systems", passingPct: "85", prevYearResult: "82", difficulty: "Medium" },
    ]);
    setSem2Results([
      { subject: "Web Development", passingPct: "88", prevYearResult: "85", difficulty: "Easy" },
    ]);
    setExamDuties(
      FIXED_EXAM_DUTIES.map((duty) => ({ duty, details: "Completed successfully", score: "2" }))
    );
    setExtensionActs([
      { particular: "NSS Village Survey Camp", hours: "30", dateFrom: "10/09/2026", dateTo: "15/09/2026", score: "5" },
      { particular: "Industrial Visit to IT Park", hours: "16", dateFrom: "20/10/2026", dateTo: "21/10/2026", score: "5" },
    ]);
    setObeRows(
      FIXED_OBE_ITEMS.map((item) => ({ particular: item, available: "Yes" }))
    );
    setPartEvents([
      { event: "AI & ML National FDP", organizedBy: "IIT Bombay", dateDuration: "5 Days", score: "5" },
      { event: "Outcome Based Education Workshop", organizedBy: "NITTTR", dateDuration: "3 Days", score: "5" },
    ]);
    setCondEvents([
      { event: "Python Programming Workshop", date: "15/11/2026", duration: "2 Days", score: "5" },
    ]);
    setInvitedTeachers([
      { event: "Keynote on Cloud Computing", organizedBy: "State Tech University", dateDuration: "1 Day", level: "State" },
    ]);
    setNptelCerts([
      { subject: "Cloud Computing", duration: "12 Weeks", dateCompletion: "Nov 2026", pctScore: "82%", score: "5" },
    ]);
    setInternships([
      { studentName: "Group A (4 Students)", industryName: "TCS Innovation Labs", stipendDuration: "6 Months", progressReport: "Yes" },
      { studentName: "Group B (3 Students)", industryName: "Infosys Campus", stipendDuration: "3 Months", progressReport: "Yes" },
    ]);
    setMentoringRows([
      { classDiv: "B.Tech CSE-A", numStudents: "20", freqMeetings: "Monthly", totalMeetings: "4" },
    ]);
    setCollaborations([
      { particular: "Joint Research Activity", industryName: "Tech Solutions Pvt Ltd", nature: "Research & Training", score: "5" },
    ]);
    setSponsoredProjects([
      { projectTitle: "Smart Agriculture Monitoring", amount: "2.5 Lakhs", sponsoringAgency: "DYP Seed Grant", score: "5" },
    ]);
    setResearchGrants([
      { title: "IoT Sensor Network for Smart Farming", fundingAgency: "DST-SERB (3 Years)", grantAmount: "15.5", score: "10" },
    ]);
    setUgcJournals([
      { title: "Efficient Data Indexing in Distributed Systems", journal: "Journal of Computer Science", publisher: "UGC Care", issn: "1234-5678", authorPosition: "1st Author" },
    ]);
    setIndexedJournals([
      { title: "Deep Learning for Agricultural Disease Detection", journal: "IEEE Transactions on Agriculture", citationIndex: "14", hIndex: "8", authorPosition: "1st Author" },
    ]);
    setConferences([
      { title: "Cloud Optimization Techniques", conference: "International Conference on Computing", proceedingsTitle: "IEEE Xplore", score: "2.5" },
    ]);
    setBooksChapters([
      { type: "Book", title: "Modern Software Engineering Practices", chapterName: "-", publisher: "Springer Nature" },
    ]);
    setReviewerEditorial([
      { journalBook: "Journal of Systems & Software", level: "International", role: "Reviewer", score: "5" },
    ]);
    setPatentsCopyrights([
      { title: "System for Crop Health Monitoring", type: "Utility Patent", appNo: "202641098765", status: "Published" },
    ]);
    setDevelopmentActs([
      { activity: "Setup of Advanced IoT Research Laboratory", fundingAmount: "3 Lakhs", score: "5" },
    ]);
    setConsultancyRows([
      { area: "Software Architecture Review", fundsGenerated: "50000", score: "5" },
    ]);
    setAwardsRows([
      { particular: "Best Faculty Researcher Award", agency: "University Council", score: "5" },
    ]);
    setOtherAchievements([
      { achievement: "Senior IEEE Member Elevation", level: "International", score: "5" },
    ]);
    setPersonalAttributes(
      FIXED_PERSONAL_ATTRIBUTES.map((attr) => ({ attribute: attr, score: "1" }))
    );
  };

  return (
    <div className="appraisal-form-shell" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Section Selector */}
      {showSectionSelector && (
        <div className="appraisal-section-selector" style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 20, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap", boxShadow: "0 12px 30px rgba(17,24,39,0.06)" }}>
          <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6 }}>My Appraisal Section</div>
          <select
            value={hodAppraisalTab}
            onChange={(e) => handleMyAppraisalSectionChange(e.target.value)}
            style={{ minWidth: 280, height: 44, border: "1px solid #e5e7eb", borderRadius: 12, padding: "0 14px", fontSize: 14, fontFamily: "inherit", color: "#111827", background: "#fff", outline: "none", fontWeight: 700 }}
          >
            {sectionOptions.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Header Card */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="appraisal-page-header" style={{ background: "#fff", borderRadius: 14, padding: "16px 24px", boxShadow: "0 10px 28px rgba(17,24,39,0.06)", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 260 }}>
            <AppraisalHeaderImage logo="dypiu" height={78} />
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#111827", letterSpacing: 0, lineHeight: 1.1 }}>Annual Faculty Self Appraisal Report (SAR)</h2>
              <div style={{ marginTop: 4, color: "#4b5563", fontSize: 13, fontWeight: 700 }}>D. Y. Patil Agriculture and Technical University, Talsande, Kolhapur</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8, fontSize: 13, color: "#6b7280", fontWeight: 700, flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#111827", fontWeight: 800 }}>
                  <InlineSvgIcon paths={SUMMARY_ICONS.user} size={14} />
                  <span>{info.name || titleNameFallback}</span>
                </span>
                <span aria-hidden="true" style={{ width: 1, height: 16, background: "#cbd5e1", display: "inline-block" }} />
                <span>Academic Year: <strong>{info.ay}</strong></span>
              </div>
            </div>
          </div>
          <AppraisalHeaderImage logo="iqas" height={78} />
        </div>

        {/* Dummy Data Button & Total Score Banner */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, background: "#fff", padding: "12px 20px", borderRadius: 12, border: "1px solid #e5e7eb", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#1e1b4b" }}>
            Total Self Appraisal Score: <span style={{ color: "#4f46e5", fontSize: 18, fontWeight: 900 }}>{grandTotal.toFixed(1)} / 300 Marks</span>
          </div>
          <button
            type="button"
            onClick={fillStandardDummyData}
            style={{ padding: "8px 16px", background: "#0f766e", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 800, fontSize: 13, fontFamily: "inherit", boxShadow: "0 4px 12px rgba(15,118,110,0.2)" }}
          >
            Fill Dummy Test Data
          </button>
        </div>

        {/* MAIN TABS CONTENT */}
        <div>
          {/* PART A: GENERAL INFORMATION */}
          {hodAppraisalTab === "partA" && (
            <SC title="PART A: General Information and Academic Background" accent="#4f46e5">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#374151", marginBottom: 4 }}>Full Name (in Block Letters)</label>
                  <TI val={info.name} onChange={(v) => setInfo((p) => ({ ...p, name: v }))} placeholder="Full Name" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#374151", marginBottom: 4 }}>Department</label>
                  <TI val={info.department} onChange={(v) => setInfo((p) => ({ ...p, department: v }))} placeholder="Department" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#374151", marginBottom: 4 }}>Current Designation</label>
                  <TI val={info.designation} onChange={(v) => setInfo((p) => ({ ...p, designation: v }))} placeholder="Current Designation" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#374151", marginBottom: 4 }}>Highest Qualification</label>
                  <TI val={info.highestQualification} onChange={(v) => setInfo((p) => ({ ...p, highestQualification: v }))} placeholder="e.g. Ph.D. / M.Tech" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#374151", marginBottom: 4 }}>Qualification Improvement during the year (if any)</label>
                  <TI val={info.qualImprovement} onChange={(v) => setInfo((p) => ({ ...p, qualImprovement: v }))} placeholder="e.g. Completed Ph.D. / NPTEL" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#374151", marginBottom: 4 }}>Date of Birth</label>
                  <TI val={info.dob} onChange={(v) => setInfo((p) => ({ ...p, dob: v }))} placeholder="DD/MM/YYYY" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#374151", marginBottom: 4 }}>Gender</label>
                  <select value={info.gender} onChange={(e) => setInfo((p) => ({ ...p, gender: e.target.value }))} style={{ width: "100%", height: 36, border: "1px solid #cbd5e1", borderRadius: 6, padding: "0 10px", fontSize: 13 }}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#374151", marginBottom: 4 }}>Marital Status</label>
                  <TI val={info.maritalStatus} onChange={(v) => setInfo((p) => ({ ...p, maritalStatus: v }))} placeholder="Married / Single" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#374151", marginBottom: 4 }}>Nationality</label>
                  <TI val={info.nationality} onChange={(v) => setInfo((p) => ({ ...p, nationality: v }))} placeholder="Indian" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#374151", marginBottom: 4 }}>Mobile No</label>
                  <TI val={info.mobile} onChange={(v) => setInfo((p) => ({ ...p, mobile: v }))} placeholder="Mobile Number" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#374151", marginBottom: 4 }}>Email ID</label>
                  <TI val={info.email} onChange={(v) => setInfo((p) => ({ ...p, email: v }))} placeholder="Email ID" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#374151", marginBottom: 4 }}>Address for Correspondence (with Pin code)</label>
                  <TI val={info.correspondenceAddress} onChange={(v) => setInfo((p) => ({ ...p, correspondenceAddress: v }))} placeholder="Correspondence Address" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#374151", marginBottom: 4 }}>Permanent Address (with Pin code)</label>
                  <TI val={info.permanentAddress} onChange={(v) => setInfo((p) => ({ ...p, permanentAddress: v }))} placeholder="Permanent Address" />
                </div>
              </div>
              <SectionNavFooter nextSection="sec1" onNavigate={handleMyAppraisalSectionChange} />
            </SC>
          )}

          {/* SECTION 1: TEACHING-LEARNING PROCESS */}
          {hodAppraisalTab === "sec1" && (
            <SC title="1. Teaching-Learning Process (50 Marks)" accent="#4f46e5" scoreBadge={`${sec1Total.toFixed(1)} / 50`}>
              <SubsectionTitle>A) Teaching Workload (Core Competency) (40 Marks)</SubsectionTitle>
              <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, marginBottom: 14, fontSize: 12, color: "#475569" }}>
                <strong>Grading Criteria (Per Sem, Max 20 Marks):</strong> 85% & above = 20 Marks | 75%-84.99% = 15 Marks | 60%-74.99% = 12 Marks | 50%-59.99% = 10 Marks | Below 50% = 0 Marks.
              </div>

              {/* Sem I */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 800, color: "#1e1b4b" }}>Sem I (20 Marks)</h4>
                <table style={T}>
                  <thead>
                    <tr>
                      <th style={TH}>Sr. No.</th>
                      <th style={TH}>Class</th>
                      <th style={TH}>Subject Name</th>
                      <th style={TH}>Planned</th>
                      <th style={TH}>Conducted</th>
                      <th style={TH}>% Conducted</th>
                      <th style={TH}>Self Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sem1Workload.map((r, i) => {
                      const p = Number(r.planned) || 0;
                      const c = Number(r.conducted) || 0;
                      const pct = p > 0 ? ((c / p) * 100).toFixed(1) : "0.0";
                      const sc = calcWorkloadRowScore(r.planned, r.conducted);
                      return (
                        <tr key={i}>
                          <td style={TDC}>{i + 1}</td>
                          <td style={TD}><TI val={r.class} onChange={(v) => setSem1Workload((p) => p.map((row, j) => j === i ? { ...row, class: v } : row))} placeholder="e.g. B.Tech CSE" /></td>
                          <td style={TD}><TI val={r.subject} onChange={(v) => setSem1Workload((p) => p.map((row, j) => j === i ? { ...row, subject: v } : row))} placeholder="Subject Name" /></td>
                          <td style={TDC}><TI val={r.planned} onChange={(v) => setSem1Workload((p) => p.map((row, j) => j === i ? { ...row, planned: v } : row))} center numeric placeholder="Planned" /></td>
                          <td style={TDC}><TI val={r.conducted} onChange={(v) => setSem1Workload((p) => p.map((row, j) => j === i ? { ...row, conducted: v } : row))} center numeric placeholder="Conducted" /></td>
                          <td style={{ ...TDC, fontWeight: 700 }}>{pct}%</td>
                          <td style={TDS}>{sc}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <RowBtns
                  onAdd={() => setSem1Workload((p) => [...p, { class: "", subject: "", planned: "", conducted: "" }])}
                  onDel={() => setSem1Workload((p) => p.length > 1 ? p.slice(0, -1) : p)}
                  canDel={sem1Workload.length > 1}
                />
              </div>

              {/* Sem II */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 800, color: "#1e1b4b" }}>Sem II (20 Marks)</h4>
                <table style={T}>
                  <thead>
                    <tr>
                      <th style={TH}>Sr. No.</th>
                      <th style={TH}>Class</th>
                      <th style={TH}>Subject Name</th>
                      <th style={TH}>Planned</th>
                      <th style={TH}>Conducted</th>
                      <th style={TH}>% Conducted</th>
                      <th style={TH}>Self Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sem2Workload.map((r, i) => {
                      const p = Number(r.planned) || 0;
                      const c = Number(r.conducted) || 0;
                      const pct = p > 0 ? ((c / p) * 100).toFixed(1) : "0.0";
                      const sc = calcWorkloadRowScore(r.planned, r.conducted);
                      return (
                        <tr key={i}>
                          <td style={TDC}>{i + 1}</td>
                          <td style={TD}><TI val={r.class} onChange={(v) => setSem2Workload((p) => p.map((row, j) => j === i ? { ...row, class: v } : row))} placeholder="e.g. B.Tech CSE" /></td>
                          <td style={TD}><TI val={r.subject} onChange={(v) => setSem2Workload((p) => p.map((row, j) => j === i ? { ...row, subject: v } : row))} placeholder="Subject Name" /></td>
                          <td style={TDC}><TI val={r.planned} onChange={(v) => setSem2Workload((p) => p.map((row, j) => j === i ? { ...row, planned: v } : row))} center numeric placeholder="Planned" /></td>
                          <td style={TDC}><TI val={r.conducted} onChange={(v) => setSem2Workload((p) => p.map((row, j) => j === i ? { ...row, conducted: v } : row))} center numeric placeholder="Conducted" /></td>
                          <td style={{ ...TDC, fontWeight: 700 }}>{pct}%</td>
                          <td style={TDS}>{sc}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <RowBtns
                  onAdd={() => setSem2Workload((p) => [...p, { class: "", subject: "", planned: "", conducted: "" }])}
                  onDel={() => setSem2Workload((p) => p.length > 1 ? p.slice(0, -1) : p)}
                  canDel={sem2Workload.length > 1}
                />
              </div>

              {/* B) Pedagogy */}
              <SubsectionTitle>B) Teaching Pedagogy/ Practices (10 Marks)</SubsectionTitle>

              {/* i) e-Content */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 800, color: "#374151" }}>i) e-Content Development (06 Marks) (03 Marks each)</h4>
                <table style={T}>
                  <thead>
                    <tr>
                      <th style={TH}>Sr. No.</th>
                      <th style={TH}>e-Content Developed in subject</th>
                      <th style={TH}>Topic Name</th>
                      <th style={TH}>Link</th>
                      <th style={TH}>Self Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eContentRows.map((r, i) => (
                      <tr key={i}>
                        <td style={TDC}>{i + 1}</td>
                        <td style={TD}><TI val={r.subject} onChange={(v) => setEContentRows((p) => p.map((row, j) => j === i ? { ...row, subject: v } : row))} placeholder="Subject Name" /></td>
                        <td style={TD}><TI val={r.topic} onChange={(v) => setEContentRows((p) => p.map((row, j) => j === i ? { ...row, topic: v } : row))} placeholder="Topic Name" /></td>
                        <td style={TD}><TI val={r.link} onChange={(v) => setEContentRows((p) => p.map((row, j) => j === i ? { ...row, link: v } : row))} placeholder="URL / Link" /></td>
                        <td style={TDS}><TI val={r.score} onChange={(v) => setEContentRows((p) => p.map((row, j) => j === i ? { ...row, score: v } : row))} center numeric placeholder="3" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <RowBtns
                  onAdd={() => setEContentRows((p) => [...p, { subject: "", topic: "", link: "", score: "3" }])}
                  onDel={() => setEContentRows((p) => p.length > 1 ? p.slice(0, -1) : p)}
                  canDel={eContentRows.length > 1}
                />
              </div>

              {/* ii) Innovation */}
              <div>
                <h4 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 800, color: "#374151" }}>ii) Innovation in Teaching (04 Marks)</h4>
                <table style={T}>
                  <thead>
                    <tr>
                      <th style={TH}>Sr. No.</th>
                      <th style={TH}>Subject</th>
                      <th style={TH}>Innovation</th>
                      <th style={TH}>Brief Description</th>
                      <th style={TH}>Self Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {innovRows.map((r, i) => (
                      <tr key={i}>
                        <td style={TDC}>{i + 1}</td>
                        <td style={TD}><TI val={r.subject} onChange={(v) => setInnovRows((p) => p.map((row, j) => j === i ? { ...row, subject: v } : row))} placeholder="Subject" /></td>
                        <td style={TD}><TI val={r.innovation} onChange={(v) => setInnovRows((p) => p.map((row, j) => j === i ? { ...row, innovation: v } : row))} placeholder="Innovation Name" /></td>
                        <td style={TD}><TI val={r.description} onChange={(v) => setInnovRows((p) => p.map((row, j) => j === i ? { ...row, description: v } : row))} placeholder="Brief Description" /></td>
                        <td style={TDS}><TI val={r.score} onChange={(v) => setInnovRows((p) => p.map((row, j) => j === i ? { ...row, score: v } : row))} center numeric placeholder="2" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <RowBtns
                  onAdd={() => setInnovRows((p) => [...p, { subject: "", innovation: "", description: "", score: "2" }])}
                  onDel={() => setInnovRows((p) => p.length > 1 ? p.slice(0, -1) : p)}
                  canDel={innovRows.length > 1}
                />
              </div>
              <SectionNavFooter prevSection="partA" nextSection="sec2" onNavigate={handleMyAppraisalSectionChange} />
            </SC>
          )}

          {/* SECTION 2: FEEDBACK FROM STUDENTS */}
          {hodAppraisalTab === "sec2" && (
            <SC title="2. Feedback from Students (10 Marks)" accent="#0891b2" scoreBadge={`${sec2Total.toFixed(1)} / 10`}>
              <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, marginBottom: 14, fontSize: 12, color: "#475569" }}>
                <strong>Grading Criteria (Per Semester, Max 5 Marks):</strong> 85% & above = 5 | 75%-84.99% = 4 | 70%-74.99% = 3 | 65%-69.99% = 2 | 60%-64.99% = 1 | Below 60% = 0.
              </div>

              {/* Sem I */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 800, color: "#1e1b4b" }}>Sem I (05 Marks) — Self Score: {sem1FeedbackScore}</h4>
                <table style={T}>
                  <thead>
                    <tr>
                      <th style={TH}>Sr. No.</th>
                      <th style={TH}>Subject Name</th>
                      <th style={TH}>Feedback %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sem1Feedback.map((r, i) => (
                      <tr key={i}>
                        <td style={TDC}>{i + 1}</td>
                        <td style={TD}><TI val={r.subject} onChange={(v) => setSem1Feedback((p) => p.map((row, j) => j === i ? { ...row, subject: v } : row))} placeholder="Subject Name" /></td>
                        <td style={TDC}><TI val={r.feedbackPct} onChange={(v) => setSem1Feedback((p) => p.map((row, j) => j === i ? { ...row, feedbackPct: v } : row))} center numeric placeholder="Feedback %" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <RowBtns
                  onAdd={() => setSem1Feedback((p) => [...p, { subject: "", feedbackPct: "" }])}
                  onDel={() => setSem1Feedback((p) => p.length > 1 ? p.slice(0, -1) : p)}
                  canDel={sem1Feedback.length > 1}
                />
              </div>

              {/* Sem II */}
              <div>
                <h4 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 800, color: "#1e1b4b" }}>Sem II (05 Marks) — Self Score: {sem2FeedbackScore}</h4>
                <table style={T}>
                  <thead>
                    <tr>
                      <th style={TH}>Sr. No.</th>
                      <th style={TH}>Subject Name</th>
                      <th style={TH}>Feedback %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sem2Feedback.map((r, i) => (
                      <tr key={i}>
                        <td style={TDC}>{i + 1}</td>
                        <td style={TD}><TI val={r.subject} onChange={(v) => setSem2Feedback((p) => p.map((row, j) => j === i ? { ...row, subject: v } : row))} placeholder="Subject Name" /></td>
                        <td style={TDC}><TI val={r.feedbackPct} onChange={(v) => setSem2Feedback((p) => p.map((row, j) => j === i ? { ...row, feedbackPct: v } : row))} center numeric placeholder="Feedback %" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <RowBtns
                  onAdd={() => setSem2Feedback((p) => [...p, { subject: "", feedbackPct: "" }])}
                  onDel={() => setSem2Feedback((p) => p.length > 1 ? p.slice(0, -1) : p)}
                  canDel={sem2Feedback.length > 1}
                />
              </div>
              <SectionNavFooter prevSection="sec1" nextSection="sec3" onNavigate={handleMyAppraisalSectionChange} />
            </SC>
          )}

          {/* SECTION 3: ADMINISTRATIVE RESPONSIBILITIES */}
          {hodAppraisalTab === "sec3" && (
            <SC title="3. Administrative / Executive Responsibilities (20 Marks)" accent="#059669" scoreBadge={`${sec3Total.toFixed(1)} / 20`}>
              <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, marginBottom: 14, fontSize: 12, color: "#475569" }}>
                <strong>Scoring Rules:</strong> Institute Level Coordinator/Head = 10 Marks | Institute Level Member = 03 Marks | Department Level Coordinator = 05 Marks | Department Level Member = 01 Mark. Total capped at 20 Marks.
              </div>

              {/* Institute Level */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 800, color: "#1e1b4b" }}>Institute Level</h4>
                <table style={T}>
                  <thead>
                    <tr>
                      <th style={TH}>Sr. No.</th>
                      <th style={TH}>Name of Responsibility/Committee</th>
                      <th style={TH}>Coordinator/Member</th>
                      <th style={TH}>Self Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instAdmin.map((r, i) => {
                      const sc = r.role === "Institute Level Coordinator/Head" ? 10 : 3;
                      return (
                        <tr key={i}>
                          <td style={TDC}>{i + 1}</td>
                          <td style={TD}><TI val={r.name} onChange={(v) => setInstAdmin((p) => p.map((row, j) => j === i ? { ...row, name: v } : row))} placeholder="Committee / Responsibility Name" /></td>
                          <td style={TD}>
                            <select value={r.role} onChange={(e) => setInstAdmin((p) => p.map((row, j) => j === i ? { ...row, role: e.target.value } : row))} style={{ width: "100%", height: 32, border: "1px solid #cbd5e1", borderRadius: 4 }}>
                              <option value="Institute Level Coordinator/Head">Institute Level Coordinator/Head (10 Marks)</option>
                              <option value="Institute Level Member">Institute Level Member (03 Marks)</option>
                            </select>
                          </td>
                          <td style={TDS}>{sc}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <RowBtns
                  onAdd={() => setInstAdmin((p) => [...p, { name: "", role: "Institute Level Coordinator/Head" }])}
                  onDel={() => setInstAdmin((p) => p.length > 1 ? p.slice(0, -1) : p)}
                  canDel={instAdmin.length > 1}
                />
              </div>

              {/* Department Level */}
              <div>
                <h4 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 800, color: "#1e1b4b" }}>Department Level</h4>
                <table style={T}>
                  <thead>
                    <tr>
                      <th style={TH}>Sr. No.</th>
                      <th style={TH}>Name of Responsibility/Committee</th>
                      <th style={TH}>Coordinator/Member</th>
                      <th style={TH}>Self Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deptAdmin.map((r, i) => {
                      const sc = r.role === "Department Level Coordinator" ? 5 : 1;
                      return (
                        <tr key={i}>
                          <td style={TDC}>{i + 1}</td>
                          <td style={TD}><TI val={r.name} onChange={(v) => setDeptAdmin((p) => p.map((row, j) => j === i ? { ...row, name: v } : row))} placeholder="Committee / Responsibility Name" /></td>
                          <td style={TD}>
                            <select value={r.role} onChange={(e) => setDeptAdmin((p) => p.map((row, j) => j === i ? { ...row, role: e.target.value } : row))} style={{ width: "100%", height: 32, border: "1px solid #cbd5e1", borderRadius: 4 }}>
                              <option value="Department Level Coordinator">Department Level Coordinator (05 Marks)</option>
                              <option value="Department Level Member">Department Level Member (01 Mark)</option>
                            </select>
                          </td>
                          <td style={TDS}>{sc}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <RowBtns
                  onAdd={() => setDeptAdmin((p) => [...p, { name: "", role: "Department Level Coordinator" }])}
                  onDel={() => setDeptAdmin((p) => p.length > 1 ? p.slice(0, -1) : p)}
                  canDel={deptAdmin.length > 1}
                />
              </div>
              <SectionNavFooter prevSection="sec2" nextSection="sec4" onNavigate={handleMyAppraisalSectionChange} />
            </SC>
          )}

          {/* SECTION 4: EVALUATION AND ASSESSMENT */}
          {hodAppraisalTab === "sec4" && (
            <SC title="4. Evaluation and Assessment (20 Marks)" accent="#d97706" scoreBadge={`${sec4Total.toFixed(1)} / 20`}>
              <SubsectionTitle>A) Result Analysis (14 Marks - 07 Marks per Sem)</SubsectionTitle>

              {/* Sem I */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 800, color: "#1e1b4b" }}>Sem I (07 Marks) — Self Score: {sem1ResultScore}</h4>
                <table style={T}>
                  <thead>
                    <tr>
                      <th style={TH}>Sr. No.</th>
                      <th style={TH}>Subject Name</th>
                      <th style={TH}>Student Passing %</th>
                      <th style={TH}>Previous Year Result</th>
                      <th style={TH}>Difficulty Level</th>
                      <th style={TH}>Self Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sem1Results.map((r, i) => {
                      const sc = calcResultAnalysisRowScore(r.passingPct, r.difficulty);
                      return (
                        <tr key={i}>
                          <td style={TDC}>{i + 1}</td>
                          <td style={TD}><TI val={r.subject} onChange={(v) => setSem1Results((p) => p.map((row, j) => j === i ? { ...row, subject: v } : row))} placeholder="Subject Name" /></td>
                          <td style={TDC}><TI val={r.passingPct} onChange={(v) => setSem1Results((p) => p.map((row, j) => j === i ? { ...row, passingPct: v } : row))} center numeric placeholder="Passing %" /></td>
                          <td style={TDC}><TI val={r.prevYearResult} onChange={(v) => setSem1Results((p) => p.map((row, j) => j === i ? { ...row, prevYearResult: v } : row))} center numeric placeholder="Prev %" /></td>
                          <td style={TD}>
                            <select value={r.difficulty} onChange={(e) => setSem1Results((p) => p.map((row, j) => j === i ? { ...row, difficulty: e.target.value } : row))} style={{ width: "100%", height: 32, border: "1px solid #cbd5e1", borderRadius: 4 }}>
                              <option value="Easy">Easy Subject</option>
                              <option value="Medium">Medium Subject</option>
                              <option value="High">High / Difficult Subject</option>
                            </select>
                          </td>
                          <td style={TDS}>{sc}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <RowBtns
                  onAdd={() => setSem1Results((p) => [...p, { subject: "", passingPct: "", prevYearResult: "", difficulty: "Easy" }])}
                  onDel={() => setSem1Results((p) => p.length > 1 ? p.slice(0, -1) : p)}
                  canDel={sem1Results.length > 1}
                />
              </div>

              {/* Sem II */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 800, color: "#1e1b4b" }}>Sem II (07 Marks) — Self Score: {sem2ResultScore}</h4>
                <table style={T}>
                  <thead>
                    <tr>
                      <th style={TH}>Sr. No.</th>
                      <th style={TH}>Subject Name</th>
                      <th style={TH}>Student Passing %</th>
                      <th style={TH}>Previous Year Result</th>
                      <th style={TH}>Difficulty Level</th>
                      <th style={TH}>Self Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sem2Results.map((r, i) => {
                      const sc = calcResultAnalysisRowScore(r.passingPct, r.difficulty);
                      return (
                        <tr key={i}>
                          <td style={TDC}>{i + 1}</td>
                          <td style={TD}><TI val={r.subject} onChange={(v) => setSem2Results((p) => p.map((row, j) => j === i ? { ...row, subject: v } : row))} placeholder="Subject Name" /></td>
                          <td style={TDC}><TI val={r.passingPct} onChange={(v) => setSem2Results((p) => p.map((row, j) => j === i ? { ...row, passingPct: v } : row))} center numeric placeholder="Passing %" /></td>
                          <td style={TDC}><TI val={r.prevYearResult} onChange={(v) => setSem2Results((p) => p.map((row, j) => j === i ? { ...row, prevYearResult: v } : row))} center numeric placeholder="Prev %" /></td>
                          <td style={TD}>
                            <select value={r.difficulty} onChange={(e) => setSem2Results((p) => p.map((row, j) => j === i ? { ...row, difficulty: e.target.value } : row))} style={{ width: "100%", height: 32, border: "1px solid #cbd5e1", borderRadius: 4 }}>
                              <option value="Easy">Easy Subject</option>
                              <option value="Medium">Medium Subject</option>
                              <option value="High">High / Difficult Subject</option>
                            </select>
                          </td>
                          <td style={TDS}>{sc}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <RowBtns
                  onAdd={() => setSem2Results((p) => [...p, { subject: "", passingPct: "", prevYearResult: "", difficulty: "Easy" }])}
                  onDel={() => setSem2Results((p) => p.length > 1 ? p.slice(0, -1) : p)}
                  canDel={sem2Results.length > 1}
                />
              </div>

              {/* Exam Duties */}
              <SubsectionTitle>B) Examination Duties (06 Marks - 02 Marks each)</SubsectionTitle>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Name of Duty</th>
                    <th style={TH}>Details</th>
                    <th style={TH}>Self Score</th>
                  </tr>
                </thead>
                <tbody>
                  {examDuties.map((r, i) => (
                    <tr key={i}>
                      <td style={TDC}>{i + 1}</td>
                      <td style={{ ...TD, fontWeight: 700 }}>{r.duty}</td>
                      <td style={TD}><TI val={r.details} onChange={(v) => setExamDuties((p) => p.map((row, j) => j === i ? { ...row, details: v } : row))} placeholder="Details of Duty" /></td>
                      <td style={TDS}>
                        <TI val={r.score} onChange={(v) => setExamDuties((p) => p.map((row, j) => j === i ? { ...row, score: v } : row))} center numeric placeholder="0 or 2" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <SectionNavFooter prevSection="sec3" nextSection="sec5" onNavigate={handleMyAppraisalSectionChange} />
            </SC>
          )}

          {/* SECTION 5: EXTENSION AND OUTREACH */}
          {hodAppraisalTab === "sec5" && (
            <SC title="5. Extension and Outreach Activities (10 Marks)" accent="#dc2626" scoreBadge={`${sec5Total.toFixed(1)} / 10`}>
              <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, marginBottom: 14, fontSize: 12, color: "#475569" }}>
                Participation in Field work, Field based activity, Industrial visit, Site visit, NSS/NCC, etc. (05 Marks each activity). Max 10 Marks.
              </div>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Particular</th>
                    <th style={TH}>Total hours spent</th>
                    <th style={TH}>Date From</th>
                    <th style={TH}>Date To</th>
                    <th style={TH}>Self Score</th>
                  </tr>
                </thead>
                <tbody>
                  {extensionActs.map((r, i) => (
                    <tr key={i}>
                      <td style={TDC}>{i + 1}</td>
                      <td style={TD}><TI val={r.particular} onChange={(v) => setExtensionActs((p) => p.map((row, j) => j === i ? { ...row, particular: v } : row))} placeholder="Activity / Particular" /></td>
                      <td style={TDC}><TI val={r.hours} onChange={(v) => setExtensionActs((p) => p.map((row, j) => j === i ? { ...row, hours: v } : row))} center numeric placeholder="Hours" /></td>
                      <td style={TDC}><TI val={r.dateFrom} onChange={(v) => setExtensionActs((p) => p.map((row, j) => j === i ? { ...row, dateFrom: v } : row))} center placeholder="DD/MM/YYYY" /></td>
                      <td style={TDC}><TI val={r.dateTo} onChange={(v) => setExtensionActs((p) => p.map((row, j) => j === i ? { ...row, dateTo: v } : row))} center placeholder="DD/MM/YYYY" /></td>
                      <td style={TDS}><TI val={r.score} onChange={(v) => setExtensionActs((p) => p.map((row, j) => j === i ? { ...row, score: v } : row))} center numeric placeholder="5" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <RowBtns
                onAdd={() => setExtensionActs((p) => [...p, { particular: "", hours: "", dateFrom: "", dateTo: "", score: "5" }])}
                onDel={() => setExtensionActs((p) => p.length > 1 ? p.slice(0, -1) : p)}
                canDel={extensionActs.length > 1}
              />
              <SectionNavFooter prevSection="sec4" nextSection="sec6" onNavigate={handleMyAppraisalSectionChange} />
            </SC>
          )}

          {/* SECTION 6: DOMAIN SPECIFIC ACTIVITIES */}
          {hodAppraisalTab === "sec6" && (
            <SC title="6. Domain Specific Activities (60 Marks)" accent="#7c3aed" scoreBadge={`${sec6Total.toFixed(1)} / 60`}>
              {/* A) OBE */}
              <SubsectionTitle>A) Outcome Based Education (OBE) Implementation (20 Marks - 04 Marks each)</SubsectionTitle>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Particulars</th>
                    <th style={TH}>Record Available</th>
                    <th style={TH}>Self Score</th>
                  </tr>
                </thead>
                <tbody>
                  {obeRows.map((r, i) => (
                    <tr key={i}>
                      <td style={TDC}>{i + 1}</td>
                      <td style={{ ...TD, fontWeight: 700 }}>{r.particular}</td>
                      <td style={TD}>
                        <select value={r.available} onChange={(e) => setObeRows((p) => p.map((row, j) => j === i ? { ...row, available: e.target.value } : row))} style={{ width: "100%", height: 32, border: "1px solid #cbd5e1", borderRadius: 4 }}>
                          <option value="Yes">Yes (4 Marks)</option>
                          <option value="No">No (0 Marks)</option>
                        </select>
                      </td>
                      <td style={TDS}>{r.available === "Yes" ? 4 : 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* B) Participation */}
              <SubsectionTitle>B) Faculty Participation in Refresher/Orientation/Workshops/STTP/FDP (15 Marks - 05 Marks each)</SubsectionTitle>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Name of Event</th>
                    <th style={TH}>Organized by</th>
                    <th style={TH}>Date & Duration</th>
                    <th style={TH}>Self Score</th>
                  </tr>
                </thead>
                <tbody>
                  {partEvents.map((r, i) => (
                    <tr key={i}>
                      <td style={TDC}>{i + 1}</td>
                      <td style={TD}><TI val={r.event} onChange={(v) => setPartEvents((p) => p.map((row, j) => j === i ? { ...row, event: v } : row))} placeholder="Name of Event" /></td>
                      <td style={TD}><TI val={r.organizedBy} onChange={(v) => setPartEvents((p) => p.map((row, j) => j === i ? { ...row, organizedBy: v } : row))} placeholder="Organized By" /></td>
                      <td style={TD}><TI val={r.dateDuration} onChange={(v) => setPartEvents((p) => p.map((row, j) => j === i ? { ...row, dateDuration: v } : row))} placeholder="Date / Duration" /></td>
                      <td style={TDS}><TI val={r.score} onChange={(v) => setPartEvents((p) => p.map((row, j) => j === i ? { ...row, score: v } : row))} center numeric placeholder="5" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <RowBtns
                onAdd={() => setPartEvents((p) => [...p, { event: "", organizedBy: "", dateDuration: "", score: "5" }])}
                onDel={() => setPartEvents((p) => p.length > 1 ? p.slice(0, -1) : p)}
                canDel={partEvents.length > 1}
              />

              {/* C) Conducted */}
              <SubsectionTitle>C) Workshops / Seminars / STTP / FDP Conducted / Organized (10 Marks)</SubsectionTitle>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Name of Event (WS, FDP, Seminar, STTP)</th>
                    <th style={TH}>Date</th>
                    <th style={TH}>Duration of Event</th>
                    <th style={TH}>Self Score</th>
                  </tr>
                </thead>
                <tbody>
                  {condEvents.map((r, i) => (
                    <tr key={i}>
                      <td style={TDC}>{i + 1}</td>
                      <td style={TD}><TI val={r.event} onChange={(v) => setCondEvents((p) => p.map((row, j) => j === i ? { ...row, event: v } : row))} placeholder="Event Name" /></td>
                      <td style={TDC}><TI val={r.date} onChange={(v) => setCondEvents((p) => p.map((row, j) => j === i ? { ...row, date: v } : row))} center placeholder="DD/MM/YYYY" /></td>
                      <td style={TD}><TI val={r.duration} onChange={(v) => setCondEvents((p) => p.map((row, j) => j === i ? { ...row, duration: v } : row))} placeholder="Duration" /></td>
                      <td style={TDS}><TI val={r.score} onChange={(v) => setCondEvents((p) => p.map((row, j) => j === i ? { ...row, score: v } : row))} center numeric placeholder="5" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <RowBtns
                onAdd={() => setCondEvents((p) => [...p, { event: "", date: "", duration: "", score: "5" }])}
                onDel={() => setCondEvents((p) => p.length > 1 ? p.slice(0, -1) : p)}
                canDel={condEvents.length > 1}
              />

              {/* D) Invited */}
              <SubsectionTitle>D) Teachers Invited as Resource Persons / Judges (05 Marks)</SubsectionTitle>
              <div style={{ background: "#f8fafc", padding: 10, borderRadius: 6, marginBottom: 10, fontSize: 12, color: "#475569" }}>
                University = 1 Mark | State = 2 Marks | National = 3 Marks | International = 5 Marks. Total max 5 Marks.
              </div>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Name of Event</th>
                    <th style={TH}>Organized by</th>
                    <th style={TH}>Date / Duration</th>
                    <th style={TH}>Level</th>
                    <th style={TH}>Self Score</th>
                  </tr>
                </thead>
                <tbody>
                  {invitedTeachers.map((r, i) => {
                    const pts = r.level === "International" ? 5 : r.level === "National" ? 3 : r.level === "State" ? 2 : 1;
                    return (
                      <tr key={i}>
                        <td style={TDC}>{i + 1}</td>
                        <td style={TD}><TI val={r.event} onChange={(v) => setInvitedTeachers((p) => p.map((row, j) => j === i ? { ...row, event: v } : row))} placeholder="Name of Event" /></td>
                        <td style={TD}><TI val={r.organizedBy} onChange={(v) => setInvitedTeachers((p) => p.map((row, j) => j === i ? { ...row, organizedBy: v } : row))} placeholder="Organized By" /></td>
                        <td style={TD}><TI val={r.dateDuration} onChange={(v) => setInvitedTeachers((p) => p.map((row, j) => j === i ? { ...row, dateDuration: v } : row))} placeholder="Date / Duration" /></td>
                        <td style={TD}>
                          <select value={r.level} onChange={(e) => setInvitedTeachers((p) => p.map((row, j) => j === i ? { ...row, level: e.target.value } : row))} style={{ width: "100%", height: 32, border: "1px solid #cbd5e1", borderRadius: 4 }}>
                            <option value="University">University (1 Mark)</option>
                            <option value="State">State (2 Marks)</option>
                            <option value="National">National (3 Marks)</option>
                            <option value="International">International (5 Marks)</option>
                          </select>
                        </td>
                        <td style={TDS}>{pts}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <RowBtns
                onAdd={() => setInvitedTeachers((p) => [...p, { event: "", organizedBy: "", dateDuration: "", level: "University" }])}
                onDel={() => setInvitedTeachers((p) => p.length > 1 ? p.slice(0, -1) : p)}
                canDel={invitedTeachers.length > 1}
              />

              {/* E) NPTEL */}
              <SubsectionTitle>E) NPTEL or any other Certification (10 Marks - 05 Marks each)</SubsectionTitle>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Name of Subject</th>
                    <th style={TH}>Duration of Course</th>
                    <th style={TH}>Date of Completion</th>
                    <th style={TH}>% of Score</th>
                    <th style={TH}>Self Score</th>
                  </tr>
                </thead>
                <tbody>
                  {nptelCerts.map((r, i) => (
                    <tr key={i}>
                      <td style={TDC}>{i + 1}</td>
                      <td style={TD}><TI val={r.subject} onChange={(v) => setNptelCerts((p) => p.map((row, j) => j === i ? { ...row, subject: v } : row))} placeholder="Subject Name" /></td>
                      <td style={TD}><TI val={r.duration} onChange={(v) => setNptelCerts((p) => p.map((row, j) => j === i ? { ...row, duration: v } : row))} placeholder="e.g. 12 Weeks" /></td>
                      <td style={TDC}><TI val={r.dateCompletion} onChange={(v) => setNptelCerts((p) => p.map((row, j) => j === i ? { ...row, dateCompletion: v } : row))} center placeholder="MM/YYYY" /></td>
                      <td style={TDC}><TI val={r.pctScore} onChange={(v) => setNptelCerts((p) => p.map((row, j) => j === i ? { ...row, pctScore: v } : row))} center placeholder="%" /></td>
                      <td style={TDS}><TI val={r.score} onChange={(v) => setNptelCerts((p) => p.map((row, j) => j === i ? { ...row, score: v } : row))} center numeric placeholder="5" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <RowBtns
                onAdd={() => setNptelCerts((p) => [...p, { subject: "", duration: "", dateCompletion: "", pctScore: "", score: "5" }])}
                onDel={() => setNptelCerts((p) => p.length > 1 ? p.slice(0, -1) : p)}
                canDel={nptelCerts.length > 1}
              />
              <SectionNavFooter prevSection="sec5" nextSection="sec7" onNavigate={handleMyAppraisalSectionChange} />
            </SC>
          )}

          {/* SECTION 7: STUDENT MENTORING */}
          {hodAppraisalTab === "sec7" && (
            <SC title="7. Student Mentoring (20 Marks)" accent="#2563eb" scoreBadge={`${sec7Total.toFixed(1)} / 20`}>
              {/* A) Internship */}
              <SubsectionTitle>A) Student Internship under guidance (10 Marks - 05 Marks each)</SubsectionTitle>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Name of Student/Group</th>
                    <th style={TH}>Name of Industry/Research Institute</th>
                    <th style={TH}>Stipend & Duration</th>
                    <th style={TH}>Progress Report Available</th>
                    <th style={TH}>Self Score</th>
                  </tr>
                </thead>
                <tbody>
                  {internships.map((r, i) => (
                    <tr key={i}>
                      <td style={TDC}>{i + 1}</td>
                      <td style={TD}><TI val={r.studentName} onChange={(v) => setInternships((p) => p.map((row, j) => j === i ? { ...row, studentName: v } : row))} placeholder="Student / Group Name" /></td>
                      <td style={TD}><TI val={r.industryName} onChange={(v) => setInternships((p) => p.map((row, j) => j === i ? { ...row, industryName: v } : row))} placeholder="Industry / Institute Name" /></td>
                      <td style={TD}><TI val={r.stipendDuration} onChange={(v) => setInternships((p) => p.map((row, j) => j === i ? { ...row, stipendDuration: v } : row))} placeholder="Stipend & Duration" /></td>
                      <td style={TD}>
                        <select value={r.progressReport} onChange={(e) => setInternships((p) => p.map((row, j) => j === i ? { ...row, progressReport: e.target.value } : row))} style={{ width: "100%", height: 32, border: "1px solid #cbd5e1", borderRadius: 4 }}>
                          <option value="Yes">Yes (5 Marks)</option>
                          <option value="No">No (0 Marks)</option>
                        </select>
                      </td>
                      <td style={TDS}>{r.progressReport === "Yes" ? 5 : 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <RowBtns
                onAdd={() => setInternships((p) => [...p, { studentName: "", industryName: "", stipendDuration: "", progressReport: "No" }])}
                onDel={() => setInternships((p) => p.length > 1 ? p.slice(0, -1) : p)}
                canDel={internships.length > 1}
              />

              {/* B) Counseling & Mentoring */}
              <SubsectionTitle>B) Counseling & Mentoring (10 Marks - 2.5 Marks each meeting)</SubsectionTitle>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Class & Div</th>
                    <th style={TH}>No. of Students allotted</th>
                    <th style={TH}>Frequency of meetings/year</th>
                    <th style={TH}>Total meetings conducted</th>
                    <th style={TH}>Self Score</th>
                  </tr>
                </thead>
                <tbody>
                  {mentoringRows.map((r, i) => {
                    const sc = Math.min(10, (Number(r.totalMeetings) || 0) * 2.5);
                    return (
                      <tr key={i}>
                        <td style={TDC}>{i + 1}</td>
                        <td style={TD}><TI val={r.classDiv} onChange={(v) => setMentoringRows((p) => p.map((row, j) => j === i ? { ...row, classDiv: v } : row))} placeholder="Class & Div" /></td>
                        <td style={TDC}><TI val={r.numStudents} onChange={(v) => setMentoringRows((p) => p.map((row, j) => j === i ? { ...row, numStudents: v } : row))} center numeric placeholder="Count" /></td>
                        <td style={TD}><TI val={r.freqMeetings} onChange={(v) => setMentoringRows((p) => p.map((row, j) => j === i ? { ...row, freqMeetings: v } : row))} placeholder="e.g. Monthly" /></td>
                        <td style={TDC}><TI val={r.totalMeetings} onChange={(v) => setMentoringRows((p) => p.map((row, j) => j === i ? { ...row, totalMeetings: v } : row))} center numeric placeholder="Total Meetings" /></td>
                        <td style={TDS}>{sc}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <RowBtns
                onAdd={() => setMentoringRows((p) => [...p, { classDiv: "", numStudents: "", freqMeetings: "", totalMeetings: "" }])}
                onDel={() => setMentoringRows((p) => p.length > 1 ? p.slice(0, -1) : p)}
                canDel={mentoringRows.length > 1}
              />
              <SectionNavFooter prevSection="sec6" nextSection="sec8" onNavigate={handleMyAppraisalSectionChange} />
            </SC>
          )}

          {/* SECTION 8: COLLABORATIONS */}
          {hodAppraisalTab === "sec8" && (
            <SC title="8. Collaborations (20 Marks)" accent="#0d9488" scoreBadge={`${sec8Total.toFixed(1)} / 20`}>
              {/* A) Collaborative activities */}
              <SubsectionTitle>A) Collaborative activities during the year (10 Marks - 05 Marks each)</SubsectionTitle>
              <div style={{ background: "#f8fafc", padding: 10, borderRadius: 6, marginBottom: 10, fontSize: 12, color: "#475569" }}>
                Participation in Industrial/Institutional/NGO/Government/Startups and Incubation activities.
              </div>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Particulars of Activity</th>
                    <th style={TH}>Name of Industry/Research Institute</th>
                    <th style={TH}>Nature of Collaboration</th>
                    <th style={TH}>Self Score</th>
                  </tr>
                </thead>
                <tbody>
                  {collaborations.map((r, i) => (
                    <tr key={i}>
                      <td style={TDC}>{i + 1}</td>
                      <td style={TD}><TI val={r.particular} onChange={(v) => setCollaborations((p) => p.map((row, j) => j === i ? { ...row, particular: v } : row))} placeholder="Particulars of Activity" /></td>
                      <td style={TD}><TI val={r.industryName} onChange={(v) => setCollaborations((p) => p.map((row, j) => j === i ? { ...row, industryName: v } : row))} placeholder="Industry / Institute Name" /></td>
                      <td style={TD}><TI val={r.nature} onChange={(v) => setCollaborations((p) => p.map((row, j) => j === i ? { ...row, nature: v } : row))} placeholder="Nature of Collaboration" /></td>
                      <td style={TDS}><TI val={r.score} onChange={(v) => setCollaborations((p) => p.map((row, j) => j === i ? { ...row, score: v } : row))} center numeric placeholder="5" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <RowBtns
                onAdd={() => setCollaborations((p) => [...p, { particular: "", industryName: "", nature: "", score: "5" }])}
                onDel={() => setCollaborations((p) => p.length > 1 ? p.slice(0, -1) : p)}
                canDel={collaborations.length > 1}
              />

              {/* B) Sponsored Projects */}
              <SubsectionTitle>B) Sponsored Projects from Industry/Research Institute/PGCS/Seed fund (10 Marks - 05 Marks each)</SubsectionTitle>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Title of Project</th>
                    <th style={TH}>Amount</th>
                    <th style={TH}>Name of Sponsoring Industry/Institute</th>
                    <th style={TH}>Self Score</th>
                  </tr>
                </thead>
                <tbody>
                  {sponsoredProjects.map((r, i) => (
                    <tr key={i}>
                      <td style={TDC}>{i + 1}</td>
                      <td style={TD}><TI val={r.projectTitle} onChange={(v) => setSponsoredProjects((p) => p.map((row, j) => j === i ? { ...row, projectTitle: v } : row))} placeholder="Project Title" /></td>
                      <td style={TDC}><TI val={r.amount} onChange={(v) => setSponsoredProjects((p) => p.map((row, j) => j === i ? { ...row, amount: v } : row))} center placeholder="Amount (Rs)" /></td>
                      <td style={TD}><TI val={r.sponsoringAgency} onChange={(v) => setSponsoredProjects((p) => p.map((row, j) => j === i ? { ...row, sponsoringAgency: v } : row))} placeholder="Sponsoring Agency" /></td>
                      <td style={TDS}><TI val={r.score} onChange={(v) => setSponsoredProjects((p) => p.map((row, j) => j === i ? { ...row, score: v } : row))} center numeric placeholder="5" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <RowBtns
                onAdd={() => setSponsoredProjects((p) => [...p, { projectTitle: "", amount: "", sponsoringAgency: "", score: "5" }])}
                onDel={() => setSponsoredProjects((p) => p.length > 1 ? p.slice(0, -1) : p)}
                canDel={sponsoredProjects.length > 1}
              />
              <SectionNavFooter prevSection="sec7" nextSection="sec9" onNavigate={handleMyAppraisalSectionChange} />
            </SC>
          )}

          {/* SECTION 9: RESEARCH ACTIVITY */}
          {hodAppraisalTab === "sec9" && (
            <SC title="9. Research Activity (80 Marks)" accent="#4338ca" scoreBadge={`${sec9Total.toFixed(1)} / 80`}>
              {/* A) Research Grants */}
              <SubsectionTitle>A) Research grants / projects from National funding agencies (10 Marks)</SubsectionTitle>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Title of Project</th>
                    <th style={TH}>Funding Agency & Duration</th>
                    <th style={TH}>Total Grant Sanctioned (Lakhs)</th>
                    <th style={TH}>Self Score</th>
                  </tr>
                </thead>
                <tbody>
                  {researchGrants.map((r, i) => (
                    <tr key={i}>
                      <td style={TDC}>{i + 1}</td>
                      <td style={TD}><TI val={r.title} onChange={(v) => setResearchGrants((p) => p.map((row, j) => j === i ? { ...row, title: v } : row))} placeholder="Project Title" /></td>
                      <td style={TD}><TI val={r.fundingAgency} onChange={(v) => setResearchGrants((p) => p.map((row, j) => j === i ? { ...row, fundingAgency: v } : row))} placeholder="Funding Agency & Duration" /></td>
                      <td style={TDC}><TI val={r.grantAmount} onChange={(v) => setResearchGrants((p) => p.map((row, j) => j === i ? { ...row, grantAmount: v } : row))} center numeric placeholder="Grant (Lakhs)" /></td>
                      <td style={TDS}><TI val={r.score} onChange={(v) => setResearchGrants((p) => p.map((row, j) => j === i ? { ...row, score: v } : row))} center numeric placeholder="5" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <RowBtns
                onAdd={() => setResearchGrants((p) => [...p, { title: "", fundingAgency: "", grantAmount: "", score: "5" }])}
                onDel={() => setResearchGrants((p) => p.length > 1 ? p.slice(0, -1) : p)}
                canDel={researchGrants.length > 1}
              />

              {/* B) UGC CARE Journals */}
              <SubsectionTitle>B) Research Publication in peer reviewed journals (UGC CARE List) (10 Marks)</SubsectionTitle>
              <div style={{ background: "#f8fafc", padding: 10, borderRadius: 6, marginBottom: 10, fontSize: 12, color: "#475569" }}>
                1st Author = 3 Marks | 2nd Author = 2 Marks | 3rd Author = 1 Mark. Total max 10 Marks.
              </div>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Title of Paper</th>
                    <th style={TH}>Name of Journal</th>
                    <th style={TH}>Publisher</th>
                    <th style={TH}>ISBN/ISSN Number</th>
                    <th style={TH}>Author Position</th>
                    <th style={TH}>Self Score</th>
                  </tr>
                </thead>
                <tbody>
                  {ugcJournals.map((r, i) => {
                    const pts = r.authorPosition === "1st Author" ? 3 : r.authorPosition === "2nd Author" ? 2 : 1;
                    return (
                      <tr key={i}>
                        <td style={TDC}>{i + 1}</td>
                        <td style={TD}><TI val={r.title} onChange={(v) => setUgcJournals((p) => p.map((row, j) => j === i ? { ...row, title: v } : row))} placeholder="Paper Title" /></td>
                        <td style={TD}><TI val={r.journal} onChange={(v) => setUgcJournals((p) => p.map((row, j) => j === i ? { ...row, journal: v } : row))} placeholder="Journal Name" /></td>
                        <td style={TD}><TI val={r.publisher} onChange={(v) => setUgcJournals((p) => p.map((row, j) => j === i ? { ...row, publisher: v } : row))} placeholder="Publisher" /></td>
                        <td style={TDC}><TI val={r.issn} onChange={(v) => setUgcJournals((p) => p.map((row, j) => j === i ? { ...row, issn: v } : row))} center placeholder="ISSN/ISBN" /></td>
                        <td style={TD}>
                          <select value={r.authorPosition} onChange={(e) => setUgcJournals((p) => p.map((row, j) => j === i ? { ...row, authorPosition: e.target.value } : row))} style={{ width: "100%", height: 32, border: "1px solid #cbd5e1", borderRadius: 4 }}>
                            <option value="1st Author">1st Author (3 Marks)</option>
                            <option value="2nd Author">2nd Author (2 Marks)</option>
                            <option value="3rd Author">3rd Author (1 Mark)</option>
                          </select>
                        </td>
                        <td style={TDS}>{pts}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <RowBtns
                onAdd={() => setUgcJournals((p) => [...p, { title: "", journal: "", publisher: "", issn: "", authorPosition: "1st Author" }])}
                onDel={() => setUgcJournals((p) => p.length > 1 ? p.slice(0, -1) : p)}
                canDel={ugcJournals.length > 1}
              />

              {/* C) IEEE/Scopus */}
              <SubsectionTitle>C) Research Publication in IEEE/SCOPUS/SCI/SCIE/Web of Science (10 Marks)</SubsectionTitle>
              <div style={{ background: "#f8fafc", padding: 10, borderRadius: 6, marginBottom: 10, fontSize: 12, color: "#475569" }}>
                1st Author = 10 Marks | 2nd Author = 8 Marks | 3rd Author = 6 Marks | Other = 3 Marks. Total max 10 Marks.
              </div>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Title of Paper</th>
                    <th style={TH}>Name of Journal</th>
                    <th style={TH}>Citation Index</th>
                    <th style={TH}>h Index</th>
                    <th style={TH}>Author Position</th>
                    <th style={TH}>Self Score</th>
                  </tr>
                </thead>
                <tbody>
                  {indexedJournals.map((r, i) => {
                    const pos = r.authorPosition;
                    const pts = pos === "1st Author" ? 10 : pos === "2nd Author" ? 8 : pos === "3rd Author" ? 6 : 3;
                    return (
                      <tr key={i}>
                        <td style={TDC}>{i + 1}</td>
                        <td style={TD}><TI val={r.title} onChange={(v) => setIndexedJournals((p) => p.map((row, j) => j === i ? { ...row, title: v } : row))} placeholder="Paper Title" /></td>
                        <td style={TD}><TI val={r.journal} onChange={(v) => setIndexedJournals((p) => p.map((row, j) => j === i ? { ...row, journal: v } : row))} placeholder="Journal Name" /></td>
                        <td style={TDC}><TI val={r.citationIndex} onChange={(v) => setIndexedJournals((p) => p.map((row, j) => j === i ? { ...row, citationIndex: v } : row))} center numeric placeholder="Citation" /></td>
                        <td style={TDC}><TI val={r.hIndex} onChange={(v) => setIndexedJournals((p) => p.map((row, j) => j === i ? { ...row, hIndex: v } : row))} center numeric placeholder="h-index" /></td>
                        <td style={TD}>
                          <select value={r.authorPosition} onChange={(e) => setIndexedJournals((p) => p.map((row, j) => j === i ? { ...row, authorPosition: e.target.value } : row))} style={{ width: "100%", height: 32, border: "1px solid #cbd5e1", borderRadius: 4 }}>
                            <option value="1st Author">1st Author (10 Marks)</option>
                            <option value="2nd Author">2nd Author (8 Marks)</option>
                            <option value="3rd Author">3rd Author (6 Marks)</option>
                            <option value="Other">Other (3 Marks)</option>
                          </select>
                        </td>
                        <td style={TDS}>{pts}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <RowBtns
                onAdd={() => setIndexedJournals((p) => [...p, { title: "", journal: "", citationIndex: "", hIndex: "", authorPosition: "1st Author" }])}
                onDel={() => setIndexedJournals((p) => p.length > 1 ? p.slice(0, -1) : p)}
                canDel={indexedJournals.length > 1}
              />

              {/* D) Conferences */}
              <SubsectionTitle>D) Faculty Participation in Conferences (05 Marks - 2.5 Marks each)</SubsectionTitle>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Title of Paper</th>
                    <th style={TH}>Name of Conference</th>
                    <th style={TH}>Title of proceedings of conference</th>
                    <th style={TH}>Self Score</th>
                  </tr>
                </thead>
                <tbody>
                  {conferences.map((r, i) => (
                    <tr key={i}>
                      <td style={TDC}>{i + 1}</td>
                      <td style={TD}><TI val={r.title} onChange={(v) => setConferences((p) => p.map((row, j) => j === i ? { ...row, title: v } : row))} placeholder="Paper Title" /></td>
                      <td style={TD}><TI val={r.conference} onChange={(v) => setConferences((p) => p.map((row, j) => j === i ? { ...row, conference: v } : row))} placeholder="Conference Name" /></td>
                      <td style={TD}><TI val={r.proceedingsTitle} onChange={(v) => setConferences((p) => p.map((row, j) => j === i ? { ...row, proceedingsTitle: v } : row))} placeholder="Proceedings Title" /></td>
                      <td style={TDS}><TI val={r.score} onChange={(v) => setConferences((p) => p.map((row, j) => j === i ? { ...row, score: v } : row))} center numeric placeholder="2.5" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <RowBtns
                onAdd={() => setConferences((p) => [...p, { title: "", conference: "", proceedingsTitle: "", score: "2.5" }])}
                onDel={() => setConferences((p) => p.length > 1 ? p.slice(0, -1) : p)}
                canDel={conferences.length > 1}
              />

              {/* E) Books/Chapters */}
              <SubsectionTitle>E) Books / Chapters in Edited Volumes (05 Marks - Book: 5, Chapter: 2.5)</SubsectionTitle>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Type</th>
                    <th style={TH}>Title of the Book</th>
                    <th style={TH}>Chapter Name</th>
                    <th style={TH}>Publisher</th>
                    <th style={TH}>Self Score</th>
                  </tr>
                </thead>
                <tbody>
                  {booksChapters.map((r, i) => (
                    <tr key={i}>
                      <td style={TDC}>{i + 1}</td>
                      <td style={TD}>
                        <select value={r.type} onChange={(e) => setBooksChapters((p) => p.map((row, j) => j === i ? { ...row, type: e.target.value } : row))} style={{ width: "100%", height: 32, border: "1px solid #cbd5e1", borderRadius: 4 }}>
                          <option value="Book">Book (5 Marks)</option>
                          <option value="Chapter">Chapter (2.5 Marks)</option>
                        </select>
                      </td>
                      <td style={TD}><TI val={r.title} onChange={(v) => setBooksChapters((p) => p.map((row, j) => j === i ? { ...row, title: v } : row))} placeholder="Book Title" /></td>
                      <td style={TD}><TI val={r.chapterName} onChange={(v) => setBooksChapters((p) => p.map((row, j) => j === i ? { ...row, chapterName: v } : row))} placeholder="Chapter Name" /></td>
                      <td style={TD}><TI val={r.publisher} onChange={(v) => setBooksChapters((p) => p.map((row, j) => j === i ? { ...row, publisher: v } : row))} placeholder="Publisher" /></td>
                      <td style={TDS}>{r.type === "Book" ? 5 : 2.5}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <RowBtns
                onAdd={() => setBooksChapters((p) => [...p, { type: "Book", title: "", chapterName: "", publisher: "" }])}
                onDel={() => setBooksChapters((p) => p.length > 1 ? p.slice(0, -1) : p)}
                canDel={booksChapters.length > 1}
              />

              {/* F) Reviewer/Editorial */}
              <SubsectionTitle>F) Details of teachers invited as Reviewer / Editorial Board Member (05 Marks - 05 Marks each)</SubsectionTitle>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Name of Journal/Conference/Book</th>
                    <th style={TH}>National/International</th>
                    <th style={TH}>Role</th>
                    <th style={TH}>Self Score</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewerEditorial.map((r, i) => (
                    <tr key={i}>
                      <td style={TDC}>{i + 1}</td>
                      <td style={TD}><TI val={r.journalBook} onChange={(v) => setReviewerEditorial((p) => p.map((row, j) => j === i ? { ...row, journalBook: v } : row))} placeholder="Journal / Book Name" /></td>
                      <td style={TD}>
                        <select value={r.level} onChange={(e) => setReviewerEditorial((p) => p.map((row, j) => j === i ? { ...row, level: e.target.value } : row))} style={{ width: "100%", height: 32, border: "1px solid #cbd5e1", borderRadius: 4 }}>
                          <option value="National">National</option>
                          <option value="International">International</option>
                        </select>
                      </td>
                      <td style={TD}>
                        <select value={r.role} onChange={(e) => setReviewerEditorial((p) => p.map((row, j) => j === i ? { ...row, role: e.target.value } : row))} style={{ width: "100%", height: 32, border: "1px solid #cbd5e1", borderRadius: 4 }}>
                          <option value="Reviewer">Reviewer</option>
                          <option value="Editorial Board Member">Editorial Board Member</option>
                        </select>
                      </td>
                      <td style={TDS}><TI val={r.score} onChange={(v) => setReviewerEditorial((p) => p.map((row, j) => j === i ? { ...row, score: v } : row))} center numeric placeholder="5" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <RowBtns
                onAdd={() => setReviewerEditorial((p) => [...p, { journalBook: "", level: "National", role: "Reviewer", score: "5" }])}
                onDel={() => setReviewerEditorial((p) => p.length > 1 ? p.slice(0, -1) : p)}
                canDel={reviewerEditorial.length > 1}
              />

              {/* G) Patents */}
              <SubsectionTitle>G) Patents / Copyright during the year (10 Marks)</SubsectionTitle>
              <div style={{ background: "#f8fafc", padding: 10, borderRadius: 6, marginBottom: 10, fontSize: 12, color: "#475569" }}>
                Copyright = 2.5 Marks | Design Patent = 05 Marks | Utility Patent = 10 Marks. Total max 10 Marks.
              </div>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Title of Patent/Copyright</th>
                    <th style={TH}>Type</th>
                    <th style={TH}>Application No.</th>
                    <th style={TH}>Status</th>
                    <th style={TH}>Self Score</th>
                  </tr>
                </thead>
                <tbody>
                  {patentsCopyrights.map((r, i) => {
                    const pts = r.type === "Utility Patent" ? 10 : r.type === "Design Patent" ? 5 : 2.5;
                    return (
                      <tr key={i}>
                        <td style={TDC}>{i + 1}</td>
                        <td style={TD}><TI val={r.title} onChange={(v) => setPatentsCopyrights((p) => p.map((row, j) => j === i ? { ...row, title: v } : row))} placeholder="Patent / Copyright Title" /></td>
                        <td style={TD}>
                          <select value={r.type} onChange={(e) => setPatentsCopyrights((p) => p.map((row, j) => j === i ? { ...row, type: e.target.value } : row))} style={{ width: "100%", height: 32, border: "1px solid #cbd5e1", borderRadius: 4 }}>
                            <option value="Copyright">Copyright (2.5 Marks)</option>
                            <option value="Design Patent">Design Patent (5 Marks)</option>
                            <option value="Utility Patent">Utility Patent (10 Marks)</option>
                          </select>
                        </td>
                        <td style={TDC}><TI val={r.appNo} onChange={(v) => setPatentsCopyrights((p) => p.map((row, j) => j === i ? { ...row, appNo: v } : row))} center placeholder="App No." /></td>
                        <td style={TD}>
                          <select value={r.status} onChange={(e) => setPatentsCopyrights((p) => p.map((row, j) => j === i ? { ...row, status: e.target.value } : row))} style={{ width: "100%", height: 32, border: "1px solid #cbd5e1", borderRadius: 4 }}>
                            <option value="Filed">Filed</option>
                            <option value="Published">Published</option>
                            <option value="Granted">Granted</option>
                          </select>
                        </td>
                        <td style={TDS}>{pts}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <RowBtns
                onAdd={() => setPatentsCopyrights((p) => [...p, { title: "", type: "Copyright", appNo: "", status: "Filed" }])}
                onDel={() => setPatentsCopyrights((p) => p.length > 1 ? p.slice(0, -1) : p)}
                canDel={patentsCopyrights.length > 1}
              />

              {/* H) Development Activities */}
              <SubsectionTitle>H) Development Activities (05 Marks - 05 Marks each)</SubsectionTitle>
              <div style={{ background: "#f8fafc", padding: 10, borderRadius: 6, marginBottom: 10, fontSize: 12, color: "#475569" }}>
                Product Development / Laboratories / Working models, charts, monograms etc.
              </div>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Activity</th>
                    <th style={TH}>Funding Amount (if any)</th>
                    <th style={TH}>Self Score</th>
                  </tr>
                </thead>
                <tbody>
                  {developmentActs.map((r, i) => (
                    <tr key={i}>
                      <td style={TDC}>{i + 1}</td>
                      <td style={TD}><TI val={r.activity} onChange={(v) => setDevelopmentActs((p) => p.map((row, j) => j === i ? { ...row, activity: v } : row))} placeholder="Activity Name" /></td>
                      <td style={TDC}><TI val={r.fundingAmount} onChange={(v) => setDevelopmentActs((p) => p.map((row, j) => j === i ? { ...row, fundingAmount: v } : row))} center placeholder="Amount" /></td>
                      <td style={TDS}><TI val={r.score} onChange={(v) => setDevelopmentActs((p) => p.map((row, j) => j === i ? { ...row, score: v } : row))} center numeric placeholder="5" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <RowBtns
                onAdd={() => setDevelopmentActs((p) => [...p, { activity: "", fundingAmount: "", score: "5" }])}
                onDel={() => setDevelopmentActs((p) => p.length > 1 ? p.slice(0, -1) : p)}
                canDel={developmentActs.length > 1}
              />

              {/* I) Consultancy */}
              <SubsectionTitle>I) Consultancy from Industry (05 Marks - 05 Marks each)</SubsectionTitle>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Area / Nature of Consultancy</th>
                    <th style={TH}>Funds Generated (Rs.)</th>
                    <th style={TH}>Self Score</th>
                  </tr>
                </thead>
                <tbody>
                  {consultancyRows.map((r, i) => (
                    <tr key={i}>
                      <td style={TDC}>{i + 1}</td>
                      <td style={TD}><TI val={r.area} onChange={(v) => setConsultancyRows((p) => p.map((row, j) => j === i ? { ...row, area: v } : row))} placeholder="Consultancy Area" /></td>
                      <td style={TDC}><TI val={r.fundsGenerated} onChange={(v) => setConsultancyRows((p) => p.map((row, j) => j === i ? { ...row, fundsGenerated: v } : row))} center numeric placeholder="Funds (Rs)" /></td>
                      <td style={TDS}><TI val={r.score} onChange={(v) => setConsultancyRows((p) => p.map((row, j) => j === i ? { ...row, score: v } : row))} center numeric placeholder="5" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <RowBtns
                onAdd={() => setConsultancyRows((p) => [...p, { area: "", fundsGenerated: "", score: "5" }])}
                onDel={() => setConsultancyRows((p) => p.length > 1 ? p.slice(0, -1) : p)}
                canDel={consultancyRows.length > 1}
              />

              {/* J) Awards */}
              <SubsectionTitle>J) Awards won by Teacher during the year (05 Marks - 05 Marks each)</SubsectionTitle>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Particular</th>
                    <th style={TH}>Awarding Agency</th>
                    <th style={TH}>Self Score</th>
                  </tr>
                </thead>
                <tbody>
                  {awardsRows.map((r, i) => (
                    <tr key={i}>
                      <td style={TDC}>{i + 1}</td>
                      <td style={TD}><TI val={r.particular} onChange={(v) => setAwardsRows((p) => p.map((row, j) => j === i ? { ...row, particular: v } : row))} placeholder="Award Particulars" /></td>
                      <td style={TD}><TI val={r.agency} onChange={(v) => setAwardsRows((p) => p.map((row, j) => j === i ? { ...row, agency: v } : row))} placeholder="Awarding Agency" /></td>
                      <td style={TDS}><TI val={r.score} onChange={(v) => setAwardsRows((p) => p.map((row, j) => j === i ? { ...row, score: v } : row))} center numeric placeholder="5" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <RowBtns
                onAdd={() => setAwardsRows((p) => [...p, { particular: "", agency: "", score: "5" }])}
                onDel={() => setAwardsRows((p) => p.length > 1 ? p.slice(0, -1) : p)}
                canDel={awardsRows.length > 1}
              />

              {/* K) Other Achievements */}
              <SubsectionTitle>K) Any other considerable achievements (10 Marks - 05 Marks each)</SubsectionTitle>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Achievement</th>
                    <th style={TH}>Level of Achievement (University/State/National etc.)</th>
                    <th style={TH}>Self Score</th>
                  </tr>
                </thead>
                <tbody>
                  {otherAchievements.map((r, i) => (
                    <tr key={i}>
                      <td style={TDC}>{i + 1}</td>
                      <td style={TD}><TI val={r.achievement} onChange={(v) => setOtherAchievements((p) => p.map((row, j) => j === i ? { ...row, achievement: v } : row))} placeholder="Achievement Details" /></td>
                      <td style={TD}><TI val={r.level} onChange={(v) => setOtherAchievements((p) => p.map((row, j) => j === i ? { ...row, level: v } : row))} placeholder="Level of Achievement" /></td>
                      <td style={TDS}><TI val={r.score} onChange={(v) => setOtherAchievements((p) => p.map((row, j) => j === i ? { ...row, score: v } : row))} center numeric placeholder="5" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <RowBtns
                onAdd={() => setOtherAchievements((p) => [...p, { achievement: "", level: "", score: "5" }])}
                onDel={() => setOtherAchievements((p) => p.length > 1 ? p.slice(0, -1) : p)}
                canDel={otherAchievements.length > 1}
              />
              <SectionNavFooter prevSection="sec8" nextSection="sec10" onNavigate={handleMyAppraisalSectionChange} />
            </SC>
          )}

          {/* SECTION 10: PERSONAL ATTRIBUTES */}
          {hodAppraisalTab === "sec10" && (
            <SC title="10. Personal Attributes (10 Marks) (01 Mark each)" accent="#ec4899" scoreBadge={`${sec10Total.toFixed(1)} / 10`}>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Attribute</th>
                    <th style={TH}>Self Score (0 or 1)</th>
                  </tr>
                </thead>
                <tbody>
                  {personalAttributes.map((r, i) => (
                    <tr key={i}>
                      <td style={TDC}>{i + 1}</td>
                      <td style={{ ...TD, fontWeight: 700 }}>{r.attribute}</td>
                      <td style={TDS}>
                        <TI val={r.score} onChange={(v) => setPersonalAttributes((p) => p.map((row, j) => j === i ? { ...row, score: v } : row))} center numeric placeholder="1" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <SectionNavFooter prevSection="sec9" nextSection="summary" onNavigate={handleMyAppraisalSectionChange} />
            </SC>
          )}

          {/* SUMMARY OF EVALUATION MARKS */}
          {hodAppraisalTab === "summary" && (
            <SC title="Summary of Evaluation Marks (300 Marks)" accent="#1e1b4b" scoreBadge={`${grandTotal.toFixed(1)} / 300`}>
              <table style={T}>
                <thead>
                  <tr>
                    <th style={TH}>Sr. No.</th>
                    <th style={TH}>Major Parameters Assessment of Teachers</th>
                    <th style={TH}>Evaluation (300 Marks)</th>
                    <th style={TH}>Self Appraisal Score</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["1", "Teaching Learning Process", 50, sec1Total],
                    ["2", "Feedback from Students", 10, sec2Total],
                    ["3", "Administrative / Executive responsibilities / Institutional Commitments", 20, sec3Total],
                    ["4", "Evaluation and Assessment", 20, sec4Total],
                    ["5", "Extension and Outreach Activities", 10, sec5Total],
                    ["6", "Domain Specific Activities", 60, sec6Total],
                    ["7", "Students Mentoring", 20, sec7Total],
                    ["8", "Collaborations", 20, sec8Total],
                    ["9", "Research Activity", 80, sec9Total],
                    ["10", "Personal Attributes", 10, sec10Total],
                  ].map(([sn, name, max, score]) => (
                    <tr key={sn} style={{ background: Number(sn) % 2 === 0 ? "#f8fafc" : "#fff" }}>
                      <td style={TDC}>{sn}</td>
                      <td style={{ ...TD, fontWeight: 700 }}>{name}</td>
                      <td style={TDC}>{max}</td>
                      <td style={{ ...TDS, fontWeight: 800, color: "#4f46e5" }}>{Number(score).toFixed(1)}</td>
                    </tr>
                  ))}
                  <tr style={{ background: "#eff6ff", borderTop: "2px solid #93c5fd" }}>
                    <td style={{ ...TDC, fontWeight: 900 }} colSpan={2}>Total Marks</td>
                    <td style={{ ...TDC, fontWeight: 900 }}>300</td>
                    <td style={{ ...TDS, fontWeight: 900, color: "#1e1b4b", fontSize: 16 }}>{grandTotal.toFixed(1)}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ marginTop: 24, padding: 16, background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                <p style={{ margin: 0, fontSize: 13, color: "#334155", fontStyle: "italic", fontWeight: 600 }}>
                  I hereby declare that, the information given above by me is true & correct to the best of my knowledge & belief.
                </p>
                <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, color: "#475569" }}>
                  <div>Place: Kolhapur</div>
                  <div>Applicant Signature: {info.name || titleNameFallback}</div>
                </div>
              </div>
              <SectionNavFooter prevSection="sec10" onNavigate={handleMyAppraisalSectionChange} />
            </SC>
          )}
        </div>
      </div>
    </div>
  );
}
