export const SAR_FACULTY_TOTAL_MARKS = 300;

export const SAR_SECTIONS = [
  {
    id: "teaching_learning_process",
    number: 1,
    title: "Teaching-Learning Process",
    maxMarks: 50,
    subsections: [
      {
        id: "teaching_workload",
        title: "Teaching Workload (Core Competency)",
        maxMarks: 40,
        subsections: [
          { id: "teaching_workload_sem_i", title: "Sem I", maxMarks: 20 },
          { id: "teaching_workload_sem_ii", title: "Sem II", maxMarks: 20 },
        ],
      },
      {
        id: "teaching_pedagogy_practices",
        title: "Teaching Pedagogy/ Practices",
        maxMarks: 10,
        subsections: [
          {
            id: "e_content_development",
            title: "e-Content Development in the year and uploaded on online portals",
            maxMarks: 6,
          },
          { id: "innovation_in_teaching", title: "Innovation in Teaching", maxMarks: 4 },
        ],
      },
    ],
  },
  {
    id: "student_feedback",
    number: 2,
    title: "Feedback from Students",
    maxMarks: 10,
    subsections: [
      { id: "student_feedback_sem_i", title: "Sem I", maxMarks: 5 },
      { id: "student_feedback_sem_ii", title: "Sem II", maxMarks: 5 },
    ],
  },
  {
    id: "administrative_executive_responsibilities",
    number: 3,
    title: "Administrative / Executive Responsibilities",
    maxMarks: 20,
    subsections: [
      { id: "institute_level_responsibilities", title: "Institute Level", maxMarks: 10 },
      { id: "department_level_responsibilities", title: "Department Level", maxMarks: 10 },
    ],
    notes: [
      "The PDF gives per-role marks for coordinator/member responsibilities; detailed calculation is intentionally not implemented in Phase 1.",
    ],
  },
  {
    id: "evaluation_assessment",
    number: 4,
    title: "Evaluation and Assessment",
    maxMarks: 20,
    subsections: [
      {
        id: "result_analysis",
        title: "Result Analysis",
        maxMarks: 14,
        subsections: [
          { id: "result_analysis_sem_i", title: "Sem I", maxMarks: 7 },
          { id: "result_analysis_sem_ii", title: "Sem II", maxMarks: 7 },
        ],
      },
      { id: "examination_duties", title: "Examination Duties", maxMarks: 6 },
    ],
  },
  {
    id: "extension_outreach",
    number: 5,
    title: "Extension and Outreach Activities",
    maxMarks: 10,
    subsections: [
      {
        id: "field_and_outreach_activities",
        title: "Participation in Field work, Field based activity, Industrial visit, Site visit, NSS/NCC, etc.",
        maxMarks: 10,
      },
    ],
  },
  {
    id: "domain_specific_activities",
    number: 6,
    title: "Domain Specific Activities",
    maxMarks: 60,
    subsections: [
      { id: "obe_implementation", title: "Outcome Based Education (OBE) Implementation", maxMarks: 20 },
      {
        id: "faculty_participation_development_programs",
        title: "Faculty Participation in Refresher Course/Orientation Courses/Workshops/Webinars/Seminars/STTP/FDP",
        maxMarks: 15,
      },
      { id: "workshops_conducted", title: "Workshops/Seminars/STTP/FDP Conducted/Organized", maxMarks: 10 },
      {
        id: "teacher_invited_resource_person",
        title: "Teachers Invited as resource persons / judges for university, state, national and international events",
        maxMarks: 5,
      },
      { id: "nptel_certification", title: "NPTEL or any other certification of faculty", maxMarks: 10 },
    ],
  },
  {
    id: "student_mentoring",
    number: 7,
    title: "Student Mentoring",
    maxMarks: 20,
    subsections: [
      { id: "student_internship_guidance", title: "Student Internship under guidance", maxMarks: 10 },
      { id: "counseling_mentoring", title: "Counseling & Mentoring", maxMarks: 10 },
    ],
  },
  {
    id: "collaborations",
    number: 8,
    title: "Collaborations",
    maxMarks: 20,
    subsections: [
      { id: "collaborative_activities", title: "Collaborative activities during the year", maxMarks: 10 },
      {
        id: "sponsored_projects",
        title: "Sponsored Projects from Industry/Research Institute/PGCS/Seed fund by institute under guidance",
        maxMarks: 10,
      },
    ],
  },
  {
    id: "research_activity",
    number: 9,
    title: "Research Activity",
    maxMarks: 80,
    subsections: [
      { id: "national_research_grants", title: "Research grants, projects completed and ongoing from National funding agencies", maxMarks: 10 },
      { id: "ugc_care_publications", title: "Research Publication in peer reviewed journals notified on UGC care list", maxMarks: 10 },
      { id: "indexed_publications", title: "Research Publication in IEEE/SCOPUS/SCI/SCIE/Web of Science", maxMarks: 10 },
      { id: "conference_participation", title: "Faculty Participation in Conferences: National / International Conference", maxMarks: 5 },
      { id: "books_chapters", title: "Books / Chapters in Edited Volumes", maxMarks: 5 },
      { id: "reviewer_editorial_board", title: "Teachers invited as Reviewer/Editorial board member", maxMarks: 5 },
      { id: "patents_copyright", title: "Patents/Copyright during the year", maxMarks: 10 },
      { id: "development_activities", title: "Development Activities", maxMarks: 5 },
      { id: "consultancy_industry", title: "Consultancy from Industry", maxMarks: 5 },
      { id: "teacher_awards", title: "Awards won by Teacher during the year", maxMarks: 5 },
      { id: "other_achievements", title: "Any other considerable achievements", maxMarks: 10 },
    ],
  },
  {
    id: "personal_attributes",
    number: 10,
    title: "Personal Attributes",
    maxMarks: 10,
    subsections: [
      { id: "personal_attributes_ratings", title: "Personal Attributes", maxMarks: 10 },
    ],
  },
];

export default SAR_SECTIONS;
