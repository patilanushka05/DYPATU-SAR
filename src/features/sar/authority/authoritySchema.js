// Rating columns for the "Please Tick the appropriate box" 5-level scales (page 14 / page 17).
// Column order matches the PDF table header exactly: 5, 4, 3, 2, 1.
export const RATING_COLUMNS = [5, 4, 3, 2, 1];

// Legend printed above the HOD and Vice Chancellor rating tables.
export const RATING_LEGEND = [
  { level: 1, label: "Unacceptable", range: "0-5" },
  { level: 2, label: "Below Average", range: "6-10" },
  { level: 3, label: "Average", range: "11-15" },
  { level: 4, label: "Above Average", range: "16-20" },
  { level: 5, label: "Outstanding", range: "Above 20" },
];

// Mark-value columns used for "Management of leaves" (Registrar) and
// "Involvement in college development" (Dean) single-parameter ratings.
export const MARKS_RATING_COLUMNS = [25, 20, 15, 10, 5];

export const HOD_APPRAISAL_PARAMETERS = [
  "Quality of Course File",
  "Regularity in maintaining academic diaries",
  "Punctuality",
  "Involvement in Developmental work",
  "Involvement in laboratory development",
];

export const VC_APPRAISAL_PARAMETERS = [
  "Overall Performance",
  "Interpersonal Skills",
  "Disciplinary Skills",
  "Involvement in Developmental work",
  "Value Addition to the institute",
];

export const LEAVE_COLUMNS = ["CL", "ML", "OD", "C/Off", "Total"];

export const ADMIN_RESPONSIBILITY_PART_A = [
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

export const ADMIN_RESPONSIBILITY_PART_B = [
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

export const FINAL_SUMMARY_COLUMNS = [
  { key: "sarMarks", label: "SAR Marks", outOf: 300 },
  { key: "hodDeanFunctionalHeadMarks", label: "HOD / Dean/ Functional Head Marks", outOf: 25 },
  { key: "registrarMarks", label: "Registrar Marks", outOf: 25 },
  { key: "deanMarks", label: "Dean Marks", outOf: 25 },
  { key: "viceChancellorMarks", label: "Vice Chancellor Marks", outOf: 25 },
  { key: "overallMarks", label: "Overall Marks out of 400", outOf: 400 },
];

export const AUTHORITY_NAV_ITEMS = [
  { id: "hod-appraisal", label: "HOD Appraisal" },
  { id: "registrar-appraisal", label: "Registrar Appraisal" },
  { id: "admin-responsibility-a", label: "Admin. Responsibility A" },
  { id: "admin-responsibility-b", label: "Admin. Responsibility B" },
  { id: "dean-appraisal", label: "Dean (School) Appraisal" },
  { id: "vc-appraisal", label: "Vice Chancellor Appraisal" },
  { id: "final-summary", label: "Final Summary" },
];
