// Complete DYPATU SAR report generator.
//
// This mirrors the full "D. Y. Patil Agriculture and Technical University — Annual
// Faculty Self Appraisal Report (SAR)" proforma end to end: Part A (general info),
// Faculty Sections 1-10, the 300-mark Summary, Declaration/signatures, and the
// evaluator sheets that follow it in the PDF (HOD, Registrar, Administrative
// Responsibility A & B, Dean, Vice Chancellor, Final Summary out of 400, Remarks &
// Recommendations).
//
// This app currently has no reviewer UI/persistence for the DYPATU SAR form, so the
// evaluator sections have no entered data to show — they are rendered as blank,
// print-ready tables (matching the blank PDF proforma) rather than fabricated scores.
// This is intentionally separate from src/utils/fullFormReport.js, which builds the
// OLD Standard Appraisal (Part A-E / 700-725 mark) report and does not fit this
// form's 300/400-mark structure.

const esc = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const cell = (value) => `<td>${esc(value) || "&nbsp;"}</td>`;
const cellC = (value) => `<td style="text-align:center">${esc(value) || "&nbsp;"}</td>`;

const table = (headers, rowsHtml, extraClass = "") => `
  <table class="${extraClass}">
    <thead><tr>${headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
    <tbody>${rowsHtml || `<tr><td colspan="${headers.length}" style="text-align:center;color:#94a3b8">No entries</td></tr>`}</tbody>
  </table>`;

const sectionHeading = (title) => `<h3 class="sec-title">${esc(title)}</h3>`;
const subHeading = (title) => `<h4 class="sub-title">${esc(title)}</h4>`;

// ---- Faculty Sections 1-10 row renderers ----

const workloadRows = (rows) =>
  rows
    .map(
      (r, i) => `<tr>
        ${cellC(i + 1)}${cell(r.class)}${cell(r.subject)}${cellC(r.planned)}${cellC(r.conducted)}${cellC(r.score)}
      </tr>`
    )
    .join("");

const eContentRowsHtml = (rows) =>
  rows.map((r, i) => `<tr>${cellC(i + 1)}${cell(r.subject)}${cell(r.topic)}${cell(r.link)}${cellC(r.score)}</tr>`).join("");

const innovRowsHtml = (rows) =>
  rows.map((r, i) => `<tr>${cellC(i + 1)}${cell(r.subject)}${cell(r.innovation)}${cell(r.description)}${cellC(r.score)}</tr>`).join("");

const feedbackRowsHtml = (rows) =>
  rows.map((r, i) => `<tr>${cellC(i + 1)}${cell(r.subject)}${cellC(r.feedbackPct)}</tr>`).join("");

const adminRowsHtml = (rows) =>
  rows.map((r, i) => `<tr>${cellC(i + 1)}${cell(r.name)}${cell(r.role)}${cellC(r.score)}</tr>`).join("");

const resultRowsHtml = (rows) =>
  rows
    .map(
      (r, i) => `<tr>${cellC(i + 1)}${cell(r.subject)}${cellC(r.passingPct)}${cellC(r.prevYearResult)}${cell(r.difficulty)}${cellC(r.score)}</tr>`
    )
    .join("");

const examDutiesRowsHtml = (rows) =>
  rows.map((r, i) => `<tr>${cellC(i + 1)}${cell(r.duty)}${cell(r.details)}${cellC(r.score)}</tr>`).join("");

const extensionRowsHtml = (rows) =>
  rows
    .map(
      (r, i) => `<tr>${cellC(i + 1)}${cell(r.particular)}${cellC(r.hours)}${cellC(r.dateFrom)}${cellC(r.dateTo)}${cellC(r.score)}</tr>`
    )
    .join("");

const obeRowsHtml = (rows) =>
  rows.map((r, i) => `<tr>${cellC(i + 1)}${cell(r.particular)}${cellC(r.available)}${cellC(r.score)}</tr>`).join("");

const eventRowsHtml = (rows) =>
  rows.map((r, i) => `<tr>${cellC(i + 1)}${cell(r.event)}${cell(r.organizedBy)}${cell(r.dateDuration)}${cellC(r.score)}</tr>`).join("");

const condEventRowsHtml = (rows) =>
  rows.map((r, i) => `<tr>${cellC(i + 1)}${cell(r.event)}${cellC(r.date)}${cell(r.duration)}${cellC(r.score)}</tr>`).join("");

const invitedRowsHtml = (rows) =>
  rows
    .map(
      (r, i) => `<tr>${cellC(i + 1)}${cell(r.event)}${cell(r.organizedBy)}${cell(r.dateDuration)}${cell(r.level)}${cellC(r.score)}</tr>`
    )
    .join("");

const nptelRowsHtml = (rows) =>
  rows
    .map(
      (r, i) => `<tr>${cellC(i + 1)}${cell(r.subject)}${cell(r.duration)}${cellC(r.dateCompletion)}${cellC(r.pctScore)}${cellC(r.score)}</tr>`
    )
    .join("");

const internshipRowsHtml = (rows) =>
  rows
    .map(
      (r, i) => `<tr>${cellC(i + 1)}${cell(r.studentName)}${cell(r.industryName)}${cell(r.stipendDuration)}${cellC(r.progressReport)}${cellC(r.score)}</tr>`
    )
    .join("");

const mentoringRowsHtml = (rows) =>
  rows
    .map(
      (r, i) => `<tr>${cellC(i + 1)}${cell(r.classDiv)}${cellC(r.numStudents)}${cell(r.freqMeetings)}${cellC(r.totalMeetings)}${cellC(r.score)}</tr>`
    )
    .join("");

const collabRowsHtml = (rows) =>
  rows.map((r, i) => `<tr>${cellC(i + 1)}${cell(r.particular)}${cell(r.industryName)}${cell(r.nature)}${cellC(r.score)}</tr>`).join("");

const sponsoredRowsHtml = (rows) =>
  rows
    .map(
      (r, i) => `<tr>${cellC(i + 1)}${cell(r.projectTitle)}${cellC(r.amount)}${cell(r.sponsoringAgency)}${cellC(r.score)}</tr>`
    )
    .join("");

const grantsRowsHtml = (rows) =>
  rows.map((r, i) => `<tr>${cellC(i + 1)}${cell(r.title)}${cell(r.fundingAgency)}${cellC(r.grantAmount)}${cellC(r.score)}</tr>`).join("");

const ugcRowsHtml = (rows) =>
  rows
    .map(
      (r, i) => `<tr>${cellC(i + 1)}${cell(r.title)}${cell(r.journal)}${cell(r.publisher)}${cellC(r.issn)}${cell(r.authorPosition)}${cellC(r.score)}</tr>`
    )
    .join("");

const indexedRowsHtml = (rows) =>
  rows
    .map(
      (r, i) => `<tr>${cellC(i + 1)}${cell(r.title)}${cell(r.journal)}${cellC(r.citationIndex)}${cellC(r.hIndex)}${cell(r.authorPosition)}${cellC(r.score)}</tr>`
    )
    .join("");

const conferenceRowsHtml = (rows) =>
  rows.map((r, i) => `<tr>${cellC(i + 1)}${cell(r.title)}${cell(r.conference)}${cell(r.proceedingsTitle)}${cellC(r.score)}</tr>`).join("");

const booksRowsHtml = (rows) =>
  rows.map((r, i) => `<tr>${cellC(i + 1)}${cell(r.type)}${cell(r.title)}${cell(r.chapterName)}${cell(r.publisher)}${cellC(r.score)}</tr>`).join("");

const reviewerRowsHtml = (rows) =>
  rows.map((r, i) => `<tr>${cellC(i + 1)}${cell(r.journalBook)}${cell(r.level)}${cell(r.role)}${cellC(r.score)}</tr>`).join("");

const patentsRowsHtml = (rows) =>
  rows.map((r, i) => `<tr>${cellC(i + 1)}${cell(r.title)}${cell(r.type)}${cellC(r.appNo)}${cell(r.status)}${cellC(r.score)}</tr>`).join("");

const devRowsHtml = (rows) =>
  rows.map((r, i) => `<tr>${cellC(i + 1)}${cell(r.activity)}${cellC(r.fundingAmount)}${cellC(r.score)}</tr>`).join("");

const consultRowsHtml = (rows) =>
  rows.map((r, i) => `<tr>${cellC(i + 1)}${cell(r.area)}${cellC(r.fundsGenerated)}${cellC(r.score)}</tr>`).join("");

const awardRowsHtml = (rows) =>
  rows.map((r, i) => `<tr>${cellC(i + 1)}${cell(r.particular)}${cell(r.agency)}${cellC(r.score)}</tr>`).join("");

const otherAchRowsHtml = (rows) =>
  rows.map((r, i) => `<tr>${cellC(i + 1)}${cell(r.achievement)}${cell(r.level)}${cellC(r.score)}</tr>`).join("");

const attributeRowsHtml = (rows) =>
  rows.map((r, i) => `<tr>${cellC(i + 1)}${cell(r.attribute)}${cellC(r.score)}</tr>`).join("");

// ---- Evaluator sheets (no data source in this app yet — rendered blank/fillable) ----

const ADMIN_RESP_A_PARAMS = [
  "Contribution to curriculum development or revision",
  "Promotion of innovative teaching and learning methods",
  "Research output (e.g., publications, patents, grants)",
  "Faculty development and mentoring",
  "Encouraging interdisciplinary work and collaboration",
  "Effective planning and execution of departmental activities",
  "Timely preparation of reports, budgets, and schedules",
  "Resource management (labs, classrooms, equipment)",
  "Handling grievances and conflict resolution",
  "Policy implementation and compliance",
  "Student feedback and grievance redressal mechanisms",
  "Academic performance and progression of students",
  "Support for student placements, internships, and career guidance",
  "Promotion of extracurricular and co-curricular activities",
  "Fair and transparent allocation of workload",
  "Monitoring of faculty performance and appraisals",
  "Encouraging participation in FDPs, workshops, and conferences",
  "Grants and projects obtained by the department",
  "Enhancement in Research collaborations and industry linkages",
  "Increase in number and quality of publications under the department",
  "Participation in accreditation and ranking activities",
  "Involvement in committees and decision-making bodies",
  "Initiative and proactiveness in departmental development",
  "Effective communication with staff, students, and management",
  "Leadership qualities and decision-making ability",
];

const ADMIN_RESP_B_PARAMS = [
  "Strategic planning and vision execution",
  "Active participation in meetings",
  "Implementation of institutional policies.",
  "Implementation of new initiatives.",
  "Representation in academic councils, boards, or external bodies.",
  "Efficiency in managing operations",
  "Implementation of IDP at institute level",
  "Oversight of infrastructure development",
  "Oversight of resource allocation & monitoring",
  "Mentoring and professional development initiatives.",
  "Recruitment, onboarding, and appraisal of faculty and staff.",
  "Curriculum review and development.",
  "Supporting innovative teaching and learning practices.",
  "Support for faculty publication and collaboration efforts.",
  "Engagement in student grievance redressal.",
  "Timely submission of reports (accreditation, rankings, audit and external evaluations).",
  "Effective communication with staff, students, and management",
  "Transparency in decision-making and communication.",
  "Leadership qualities and decision-making ability",
  "Timely completion of work",
  "Handling grievances and conflict resolution",
  "Timely preparation of reports, budgets, and schedules",
  "Encouraging interdisciplinary work and collaboration",
  "Initiative and proactiveness in institutional development",
  "Integrity and professional ethics",
];

const HOD_SHEET_PARAMS = [
  "Quality of Course File",
  "Regularity in maintaining academic diaries",
  "Punctuality",
  "Involvement in Developmental work",
  "Involvement in laboratory development",
];

const VC_SHEET_PARAMS = [
  "Overall Performance",
  "Interpersonal Skills",
  "Disciplinary Skills",
  "Involvement in Developmental work",
  "Value Addition to the institute",
];

const blankRatingSheet = (params) =>
  params
    .map(
      (p, i) => `<tr>${cellC(i + 1)}${cell(p)}<td></td><td></td><td></td><td></td><td></td></tr>`
    )
    .join("");

const adminRespSheet = (params) =>
  params
    .map((p, i) => `<tr>${cellC(i + 1)}${cell(p)}<td></td><td></td><td></td></tr>`)
    .join("");

export function buildSarReportHtml(data) {
  const {
    info,
    sem1Workload, sem2Workload, eContentRows, innovRows,
    sem1Feedback, sem2Feedback, sem1FeedbackSelfScore, sem2FeedbackSelfScore,
    instAdmin, deptAdmin,
    sem1Results, sem2Results, examDuties,
    extensionActs,
    obeRows, partEvents, condEvents, invitedTeachers, nptelCerts,
    internships, mentoringRows,
    collaborations, sponsoredProjects,
    researchGrants, ugcJournals, indexedJournals, conferences, booksChapters,
    reviewerEditorial, patentsCopyrights, developmentActs, consultancyRows,
    awardsRows, otherAchievements,
    personalAttributes,
    sec1Total, sec2Total, sec3Total, sec4Total, sec5Total,
    sec6Total, sec7Total, sec8Total, sec9Total, sec10Total,
    grandTotal,
    titleNameFallback,
  } = data;

  const summaryRows = [
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
  ];
  const summaryRowsHtml = summaryRows
    .map(
      ([sn, name, max, score]) => `<tr>${cellC(sn)}${cell(name)}${cellC(max)}${cellC(Number(score).toFixed(1))}</tr>`
    )
    .join("");

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>DYPATU SAR Report${info.name ? " - " + esc(info.name) : ""}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; padding: 28px; color: #111827; font-size: 12.5px; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  h2.univ { font-size: 13px; color: #4b5563; margin: 0 0 4px; font-weight: 700; }
  h2.proforma { font-size: 13px; color: #374151; margin: 0 0 20px; font-weight: 700; text-align: center; }
  .part-page { page-break-before: always; padding-top: 8px; }
  .part-page:first-of-type { page-break-before: auto; }
  h3.sec-title { font-size: 15px; margin: 26px 0 10px; padding-bottom: 6px; border-bottom: 2px solid #cbd5e1; color: #1e1b4b; }
  h4.sub-title { font-size: 12.5px; margin: 16px 0 6px; color: #1f2937; }
  .meta { font-size: 12.5px; line-height: 1.7; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; font-size: 11.5px; margin-bottom: 14px; }
  th, td { border: 1px solid #cbd5e1; padding: 6px; text-align: left; vertical-align: top; }
  th { background: #f1f5f9; }
  .total-row { font-weight: 800; background: #eff6ff; }
  .declaration { margin-top: 20px; font-size: 12px; color: #334155; font-style: italic; }
  .sign { margin-top: 30px; display: flex; justify-content: space-between; font-size: 12.5px; font-weight: 700; }
  .rating-scale { font-size: 11px; color: #475569; margin-bottom: 8px; }
  .fill-note { font-size: 10.5px; color: #94a3b8; margin: -8px 0 10px; }
  .remarks-line { border-bottom: 1px solid #94a3b8; height: 22px; margin-bottom: 10px; }
</style>
</head>
<body>

  <div class="part-page">
    <h1>Annual Faculty Self Appraisal Report (SAR)</h1>
    <h2 class="univ">D. Y. Patil Agriculture and Technical University, Talsande, Kolhapur</h2>
    <h2 class="proforma">SAR Proforma (Period of Appraisal: A.Y. ${esc(info.ay)}, Semester-I &amp; Semester II)</h2>

    ${sectionHeading("PART A: General Information and Academic Background")}
    ${table(["Field", "Details"], [
      ["Full Name (in Block Letters)", info.name],
      ["Department", info.department],
      ["Current Designation", info.designation],
      ["Highest Qualification", info.highestQualification],
      ["Qualification Improvement during the year (if any)", info.qualImprovement],
      ["Date of Birth", info.dob],
      ["Gender", info.gender],
      ["Marital Status", info.maritalStatus],
      ["Nationality", info.nationality],
      ["Address for Correspondence (with Pin code)", info.correspondenceAddress],
      ["Permanent Address (with Pin code)", info.permanentAddress],
      ["Mobile No", info.mobile],
      ["Email ID", info.email],
    ].map(([k, v]) => `<tr><td style="font-weight:700;width:280px">${esc(k)}</td>${cell(v)}</tr>`).join(""))}
  </div>

  <div class="part-page">
    ${sectionHeading("1. Teaching-Learning Process (50 Marks)")}
    ${subHeading("A) Teaching Workload — Sem I (20 Marks)")}
    ${table(["Sr.No.", "Class", "Subject", "Planned", "Conducted", "Self Score"], workloadRows(sem1Workload))}
    ${subHeading("A) Teaching Workload — Sem II (20 Marks)")}
    ${table(["Sr.No.", "Class", "Subject", "Planned", "Conducted", "Self Score"], workloadRows(sem2Workload))}
    ${subHeading("B) i) e-Content Development (06 Marks)")}
    ${table(["Sr.No.", "Subject", "Topic Name", "Link", "Self Score"], eContentRowsHtml(eContentRows))}
    ${subHeading("B) ii) Innovation in Teaching (04 Marks)")}
    ${table(["Sr.No.", "Subject", "Innovation", "Brief Description", "Self Score"], innovRowsHtml(innovRows))}
  </div>

  <div class="part-page">
    ${sectionHeading("2. Feedback from Students (10 Marks)")}
    ${subHeading(`Sem I (05 Marks) — Self-Appraisal Score: ${esc(sem1FeedbackSelfScore || "-")}`)}
    ${table(["Sr.No.", "Subject Name", "Feedback %"], feedbackRowsHtml(sem1Feedback))}
    ${subHeading(`Sem II (05 Marks) — Self-Appraisal Score: ${esc(sem2FeedbackSelfScore || "-")}`)}
    ${table(["Sr.No.", "Subject Name", "Feedback %"], feedbackRowsHtml(sem2Feedback))}

    ${sectionHeading("3. Administrative / Executive Responsibilities (20 Marks)")}
    ${subHeading("Institute Level")}
    ${table(["Sr.No.", "Name of Responsibility/Committee", "Coordinator/Member", "Self Score"], adminRowsHtml(instAdmin))}
    ${subHeading("Department Level")}
    ${table(["Sr.No.", "Name of Responsibility/Committee", "Coordinator/Member", "Self Score"], adminRowsHtml(deptAdmin))}
  </div>

  <div class="part-page">
    ${sectionHeading("4. Evaluation and Assessment (20 Marks)")}
    ${subHeading("A) Result Analysis — Sem I (07 Marks)")}
    ${table(["Sr.No.", "Subject", "Passing %", "Previous Year %", "Difficulty", "Self Score"], resultRowsHtml(sem1Results))}
    ${subHeading("A) Result Analysis — Sem II (07 Marks)")}
    ${table(["Sr.No.", "Subject", "Passing %", "Previous Year %", "Difficulty", "Self Score"], resultRowsHtml(sem2Results))}
    ${subHeading("B) Examination Duties (06 Marks)")}
    ${table(["Sr.No.", "Name of Duty", "Details", "Self Score"], examDutiesRowsHtml(examDuties))}

    ${sectionHeading("5. Extension and Outreach Activities (10 Marks)")}
    ${table(["Sr.No.", "Particular", "Hours", "Date From", "Date To", "Self Score"], extensionRowsHtml(extensionActs))}
  </div>

  <div class="part-page">
    ${sectionHeading("6. Domain Specific Activities (60 Marks)")}
    ${subHeading("A) OBE Implementation (20 Marks)")}
    ${table(["Sr.No.", "Particulars", "Record Available", "Self Score"], obeRowsHtml(obeRows))}
    ${subHeading("B) Refresher/Orientation/Workshop/STTP/FDP Participation (15 Marks)")}
    ${table(["Sr.No.", "Name of Event", "Organized By", "Date & Duration", "Self Score"], eventRowsHtml(partEvents))}
    ${subHeading("C) Workshops/Seminars/STTP/FDP Conducted (10 Marks)")}
    ${table(["Sr.No.", "Name of Event", "Date", "Duration", "Self Score"], condEventRowsHtml(condEvents))}
    ${subHeading("D) Teachers Invited as Resource Persons/Judges (05 Marks)")}
    ${table(["Sr.No.", "Name of Event", "Organized By", "Date/Duration", "Level", "Self Score"], invitedRowsHtml(invitedTeachers))}
    ${subHeading("E) NPTEL or Other Certification (10 Marks)")}
    ${table(["Sr.No.", "Subject", "Duration", "Date of Completion", "% Score", "Self Score"], nptelRowsHtml(nptelCerts))}
  </div>

  <div class="part-page">
    ${sectionHeading("7. Student Mentoring (20 Marks)")}
    ${subHeading("A) Student Internship under Guidance (10 Marks)")}
    ${table(["Sr.No.", "Student/Group", "Industry/Institute", "Stipend & Duration", "Progress Report", "Self Score"], internshipRowsHtml(internships))}
    ${subHeading("B) Counseling & Mentoring (10 Marks)")}
    ${table(["Sr.No.", "Class & Div", "Students Allotted", "Frequency", "Total Meetings", "Self Score"], mentoringRowsHtml(mentoringRows))}

    ${sectionHeading("8. Collaborations (20 Marks)")}
    ${subHeading("A) Collaborative Activities (10 Marks)")}
    ${table(["Sr.No.", "Particulars", "Industry/Institute", "Nature", "Self Score"], collabRowsHtml(collaborations))}
    ${subHeading("B) Sponsored Projects (10 Marks)")}
    ${table(["Sr.No.", "Project Title", "Amount", "Sponsoring Agency", "Self Score"], sponsoredRowsHtml(sponsoredProjects))}
  </div>

  <div class="part-page">
    ${sectionHeading("9. Research Activity (80 Marks)")}
    ${subHeading("A) Research Grants/Projects (10 Marks)")}
    ${table(["Sr.No.", "Title", "Funding Agency", "Grant (Lakhs)", "Self Score"], grantsRowsHtml(researchGrants))}
    ${subHeading("B) UGC CARE Journal Publications (10 Marks)")}
    ${table(["Sr.No.", "Title", "Journal", "Publisher", "ISSN/ISBN", "Author Position", "Self Score"], ugcRowsHtml(ugcJournals))}
    ${subHeading("C) IEEE/Scopus/SCI/SCIE/Web of Science Publications (10 Marks)")}
    ${table(["Sr.No.", "Title", "Journal", "Citation Index", "h-Index", "Author Position", "Self Score"], indexedRowsHtml(indexedJournals))}
    ${subHeading("D) Conference Participation (05 Marks)")}
    ${table(["Sr.No.", "Title", "Conference", "Proceedings", "Self Score"], conferenceRowsHtml(conferences))}
    ${subHeading("E) Books/Chapters (05 Marks)")}
    ${table(["Sr.No.", "Type", "Title", "Chapter", "Publisher", "Self Score"], booksRowsHtml(booksChapters))}
    ${subHeading("F) Reviewer/Editorial Board Member (05 Marks)")}
    ${table(["Sr.No.", "Journal/Conference/Book", "Level", "Role", "Self Score"], reviewerRowsHtml(reviewerEditorial))}
    ${subHeading("G) Patents/Copyright (10 Marks)")}
    ${table(["Sr.No.", "Title", "Type", "Application No.", "Status", "Self Score"], patentsRowsHtml(patentsCopyrights))}
    ${subHeading("H) Development Activities (05 Marks)")}
    ${table(["Sr.No.", "Activity", "Funding Amount", "Self Score"], devRowsHtml(developmentActs))}
    ${subHeading("I) Consultancy from Industry (05 Marks)")}
    ${table(["Sr.No.", "Area/Nature", "Funds Generated", "Self Score"], consultRowsHtml(consultancyRows))}
    ${subHeading("J) Awards (05 Marks)")}
    ${table(["Sr.No.", "Particular", "Awarding Agency", "Self Score"], awardRowsHtml(awardsRows))}
    ${subHeading("K) Other Considerable Achievements (10 Marks)")}
    ${table(["Sr.No.", "Achievement", "Level", "Self Score"], otherAchRowsHtml(otherAchievements))}
  </div>

  <div class="part-page">
    ${sectionHeading("10. Personal Attributes (10 Marks)")}
    ${table(["Sr.No.", "Attribute", "Self Score"], attributeRowsHtml(personalAttributes))}

    ${sectionHeading("Summary of Evaluation Marks")}
    ${table(["Sr.No.", "Major Parameters Assessment of Teachers", "Evaluation (300 Marks)", "Self Appraisal Score"],
      summaryRowsHtml + `<tr class="total-row"><td colspan="2">Total Marks</td><td style="text-align:center">300</td><td style="text-align:center">${grandTotal.toFixed(1)}</td></tr>`
    )}

    <p class="declaration">I hereby declare that, the information given above by me is true &amp; correct to the best of my knowledge &amp; belief.</p>
    <div class="sign">
      <div>Place: Kolhapur</div>
      <div>Applicant Signature: ${esc(info.name || titleNameFallback)}</div>
    </div>
  </div>

  <div class="part-page">
    ${sectionHeading("HOD Appraisal Sheet")}
    <div class="rating-scale">1. Unacceptable (0-5) &nbsp; 2. Below Average (6-10) &nbsp; 3. Average (11-15) &nbsp; 4. Above Average (16-20) &nbsp; 5. Outstanding (Above 20)</div>
    <div class="fill-note">To be completed by the Head of Department — not entered in this system.</div>
    ${table(["Sr.No.", "Parameters", "5", "4", "3", "2", "1"], blankRatingSheet(HOD_SHEET_PARAMS))}
    <div>Total Score out of (25) = ______</div>
    <div style="margin-top:10px">Remarks If Any: <span class="remarks-line" style="display:inline-block;width:60%"></span></div>
    <div class="sign"><div></div><div>HoD Signature: ______________________</div></div>

    ${sectionHeading("Registrar Appraisal Sheet")}
    <div class="rating-scale">1. Unacceptable (0-5) &nbsp; 2. Below Average (6-10) &nbsp; 3. Average (11-15) &nbsp; 4. Above Average (16-20) &nbsp; 5. Outstanding (Above 20)</div>
    <div class="fill-note">To be completed by the Registrar's office — not entered in this system.</div>
    ${table(["Particular", "CL", "ML", "OD", "C/Off", "Total"], `
      <tr><td>1. No. of leaves taken in the Year</td><td></td><td></td><td></td><td></td><td></td></tr>
      <tr><td>Out of</td><td></td><td></td><td></td><td></td><td></td></tr>
    `)}
    ${table(["Particular", "Value"], `
      <tr><td>2. No. of Late Remarks in the Year</td><td></td></tr>
      <tr><td>3. Total Actual Working Days for the current academic year</td><td></td></tr>
    `)}
    ${table(["4. Management of leaves", "25", "20", "15", "10", "5"], `<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>`)}
    <div>Total Score out of (25) = ______</div>
    <div style="margin-top:10px">Any other Feedback by Registrar: <span class="remarks-line" style="display:inline-block;width:60%"></span></div>
    <div class="sign"><div></div><div>Registrar Signature: ______________________</div></div>
  </div>

  <div class="part-page">
    ${sectionHeading("Evaluation of Administrative Responsibility (25 Marks) — Part A")}
    <div class="fill-note">A. To be filled by only Head of Departments (01 Mark each) — not entered in this system.</div>
    ${table(["Sr.No.", "Parameters", "Self-Appraisal Score", "Dean (School) Score", "Vice Chancellor Score"], adminRespSheet(ADMIN_RESP_A_PARAMS))}
  </div>

  <div class="part-page">
    ${sectionHeading("Evaluation of Administrative Responsibility (25 Marks) — Part B")}
    <div class="fill-note">B. To be filled by only Deans and All Functional Heads (01 Mark each) — not entered in this system.</div>
    ${table(["Sr.No.", "Parameters", "Self-Appraisal Score", "Dean (School) Score", "Vice Chancellor Score"], adminRespSheet(ADMIN_RESP_B_PARAMS))}
  </div>

  <div class="part-page">
    ${sectionHeading("Dean (School) Appraisal Sheet")}
    <div class="fill-note">To be filled by Dean (School) only — not entered in this system.</div>
    ${table(["1. Involvement in college development", "25", "20", "15", "10", "5"], `<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>`)}
    <div>Total Score out of (25) = ______</div>
    <div style="margin-top:10px">Any other Feedback by Dean (School): <span class="remarks-line" style="display:inline-block;width:60%"></span></div>
    <div class="sign"><div></div><div>Principal Signature: ______________________</div></div>

    ${sectionHeading("Appraisal Sheet (To be Filed by Vice Chancellor)")}
    <div class="rating-scale">1. Unacceptable (0-5) &nbsp; 2. Below Average (6-10) &nbsp; 3. Average (11-15) &nbsp; 4. Above Average (16-20) &nbsp; 5. Outstanding (Above 20)</div>
    <div class="fill-note">To be completed by the Vice Chancellor — not entered in this system.</div>
    ${table(["Sr.No.", "Parameters", "5", "4", "3", "2", "1"], blankRatingSheet(VC_SHEET_PARAMS))}
    <div>Total Score out of (25) = ______</div>
    <div style="margin-top:10px">Any other Remarks: <span class="remarks-line" style="display:inline-block;width:60%"></span></div>
    <div class="sign"><div></div><div>Signature of Vice Chancellor: ______________________</div></div>
  </div>

  <div class="part-page">
    ${sectionHeading("Final Summary — Overall Marks (out of 400)")}
    <div class="meta">
      <div><strong>Name of Faculty:</strong> ${esc(info.name)}</div>
      <div><strong>Department:</strong> ${esc(info.department)}</div>
    </div>
    ${table(["", "SAR Marks", "HOD/Dean/Functional Head Marks", "Registrar Marks", "Dean Marks", "Vice Chancellor Marks", "Overall Marks out of 400"], `
      <tr><td style="font-weight:700">Out of</td><td style="text-align:center">300</td><td style="text-align:center">25</td><td style="text-align:center">25</td><td style="text-align:center">25</td><td style="text-align:center">25</td><td style="text-align:center">400</td></tr>
      <tr><td style="font-weight:700">Marks Obtained</td><td style="text-align:center;font-weight:800">${grandTotal.toFixed(1)}</td><td></td><td></td><td></td><td></td><td></td></tr>
    `)}
    <div class="fill-note">HOD/Registrar/Dean/Vice Chancellor marks are completed outside this system and are left blank here pending that review.</div>

    ${sectionHeading("Remarks and Recommendations")}
    <div style="margin-top:6px">Remarks:</div>
    <div>1. <span class="remarks-line" style="display:block"></span></div>
    <div>2. <span class="remarks-line" style="display:block"></span></div>
    <div style="margin-top:10px">Recommendations:</div>
    <div class="remarks-line" style="display:block"></div>
    <div class="remarks-line" style="display:block"></div>
  </div>

</body>
</html>`;
}

export function openSarReport(data) {
  const html = buildSarReportHtml(data);
  const win = window.open("", "_blank", "width=1000,height=1000");
  if (!win) {
    alert("Please allow pop-ups for this site to generate the report.");
    return;
  }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 250);
}
