export const GENERAL_INFORMATION_FIELDS = [
  { key: "fullName", label: "Full Name (in Block Letters)", type: "text" },
  { key: "department", label: "Department", type: "text" },
  { key: "currentDesignation", label: "Current Designation", type: "text" },
  { key: "highestQualification", label: "Highest Qualification", type: "text" },
  { key: "qualificationImprovement", label: "Qualification Improvement during the year (if any)", type: "textarea" },
  { key: "dateOfBirth", label: "Date of Birth", type: "date" },
  { key: "gender", label: "Gender", type: "text" },
  { key: "maritalStatus", label: "Marital status", type: "text" },
  { key: "nationality", label: "Nationality", type: "text" },
  { key: "correspondenceAddress", label: "Address for correspondence (with Pin code)", type: "textarea" },
  { key: "permanentAddress", label: "Permanent Address (with Pin code)", type: "textarea" },
  { key: "mobileNo", label: "Mobile No", type: "tel" },
  { key: "emailId", label: "Email id", type: "email" },
];

export const SCORE_COLUMNS = [
  { key: "selfScore", label: "Self-appraisal Score", type: "number", className: "score-col" },
  { key: "hodScore", label: "HoD Score", type: "number", className: "score-col" },
  { key: "committeeScore", label: "Committee Score", type: "number", className: "score-col" },
];

const scoringColumns = () => SCORE_COLUMNS.map((column) => ({ ...column }));

export const RESULT_ANALYSIS_GRADING_GUIDELINE = {
  title: "Guidelines",
  columns: [
    { key: "easy", label: "Percentage for Easy subject" },
    { key: "medium", label: "Percentage for Medium subject" },
    { key: "difficult", label: "Percentage for Difficult subject" },
    { key: "marks", label: "Marks" },
  ],
  rows: [
    { easy: "80% and above", medium: "70% and above", difficult: "60% and above", marks: "07" },
    { easy: "70% to 79.99%", medium: "65% to 69.99%", difficult: "55% to 59.99%", marks: "06" },
    { easy: "65% to 69.99%", medium: "60% to 64.99%", difficult: "50% to 54.99%", marks: "05" },
    { easy: "60% to 64.99%", medium: "55% to 59.99%", difficult: "45% to 49.99%", marks: "04" },
    { easy: "55% to 59.99%", medium: "50% to 54.99%", difficult: "40% to 44.99%", marks: "03" },
    { easy: "Below 54.99%", medium: "Below 49.99%", difficult: "Below 39.99%", marks: "00" },
  ],
};

export const FACULTY_SAR_TABLES = [
  {
    sectionId: "teaching_learning_process",
    number: 1,
    title: "Teaching-Learning Process",
    maxMarks: 50,
    groups: [
      {
        id: "teaching_workload",
        title: "A) Teaching Workload (Core Competency)",
        maxMarks: 40,
        criteria: [
          "85% & above - 20 Marks",
          "Below 85% but above 75% - 15 Marks",
          "Below 75% but above 60% - 12 Marks",
          "Below 60% but above 50% - 10 Marks",
          "Less than 50% - 00 Marks",
        ],
        tables: [
          {
            id: "teachingWorkloadSemI",
            title: "Sem I",
            maxMarks: 20,
            columns: [
              { key: "class", label: "Class", type: "text" },
              { key: "subjectName", label: "Subject Name", type: "text" },
              { key: "planned", label: "Lectures/Practical's/Tutorial Planned", type: "number" },
              { key: "conducted", label: "Lectures/Practical's/Tutorial Conducted", type: "number" },
              ...scoringColumns(),
            ],
          },
          {
            id: "teachingWorkloadSemII",
            title: "Sem II",
            maxMarks: 20,
            columns: [
              { key: "class", label: "Class", type: "text" },
              { key: "subjectName", label: "Subject Name", type: "text" },
              { key: "planned", label: "Lectures/Practical's/Tutorial Planned", type: "number" },
              { key: "conducted", label: "Lectures/Practical's/Tutorial Conducted", type: "number" },
              ...scoringColumns(),
            ],
          },
        ],
      },
      {
        id: "teaching_pedagogy",
        title: "B) Teaching Pedagogy/ Practices",
        maxMarks: 10,
        tables: [
          {
            id: "eContentDevelopment",
            title: "i) e-Content Development in the year and uploaded on online portals",
            subtitle: "Self Video Lecture / Practical Demonstration / Animation development (03 Marks each)",
            maxMarks: 6,
            columns: [
              { key: "subject", label: "e-Content Developed in subject", type: "text" },
              { key: "topicName", label: "Topic Name", type: "text" },
              { key: "link", label: "Link", type: "url" },
              ...scoringColumns(),
            ],
          },
          {
            id: "innovationInTeaching",
            title: "ii) Innovation in Teaching",
            maxMarks: 4,
            columns: [
              { key: "subject", label: "Subject", type: "text" },
              { key: "innovation", label: "Innovation", type: "text" },
              { key: "briefDescription", label: "Brief Description", type: "textarea" },
              ...scoringColumns(),
            ],
          },
        ],
      },
    ],
  },
  {
    sectionId: "student_feedback",
    number: 2,
    title: "Feedback from Students",
    maxMarks: 10,
    criteria: [
      "85% & above - 05 Marks",
      "Below 85% but above 75% - 04 Marks",
      "Below 75% but above 70% - 03 Marks",
      "Below 70% but above 65% - 02 Marks",
      "Below 65% but above 60% - 01 Mark",
      "Less than 60% - 00 Marks",
    ],
    groups: [
      {
        id: "feedback_group",
        title: "Feedback from Students",
        tables: [
          {
            id: "feedbackSemI",
            title: "Sem I",
            maxMarks: 5,
            columns: [
              { key: "subjectName", label: "Subject Name", type: "text" },
              { key: "feedback", label: "Feedback", type: "number" },
              { key: "feedbackAverage", label: "Average Feedback", type: "number" },
              ...scoringColumns(),
            ],
          },
          {
            id: "feedbackSemII",
            title: "Sem II",
            maxMarks: 5,
            columns: [
              { key: "subjectName", label: "Subject Name", type: "text" },
              { key: "feedback", label: "Feedback", type: "number" },
              { key: "feedbackAverage", label: "Average Feedback", type: "number" },
              ...scoringColumns(),
            ],
          },
        ],
      },
    ],
  },
  {
    sectionId: "administrative_executive_responsibilities",
    number: 3,
    title: "Administrative / Executive Responsibilities",
    maxMarks: 20,
    criteria: [
      "For Institute Level Coordinator/Head: 10 Marks",
      "For Institute Level Member: 03 Marks",
      "Department Level Coordinator: 05 Marks",
      "Department Level Member: 01 Mark",
    ],
    groups: [
      {
        id: "administrative_group",
        title: "Responsibilities",
        tables: [
          {
            id: "instituteLevelResponsibilities",
            title: "Institute Level",
            maxMarks: 10,
            columns: [
              { key: "responsibilityCommittee", label: "Name of Responsibility/Committee", type: "text" },
              { key: "coordinatorMember", label: "Coordinator/Member", type: "select", options: ["Coordinator/Head", "Member"] },
              ...scoringColumns(),
            ],
          },
          {
            id: "departmentLevelResponsibilities",
            title: "Department Level",
            maxMarks: 10,
            columns: [
              { key: "responsibilityCommittee", label: "Name of Responsibility/Committee", type: "text" },
              { key: "coordinatorMember", label: "Coordinator/Member", type: "select", options: ["Coordinator", "Member"] },
              ...scoringColumns(),
            ],
          },
        ],
      },
    ],
  },
  {
    sectionId: "evaluation_assessment",
    number: 4,
    title: "Evaluation and Assessment",
    maxMarks: 20,
    groups: [
      {
        id: "result_analysis",
        title: "A) Result Analysis",
        maxMarks: 14,
        guidelineTable: RESULT_ANALYSIS_GRADING_GUIDELINE,
        tables: [
          {
            id: "resultAnalysisSemI",
            title: "Sem I",
            maxMarks: 7,
            columns: [
              { key: "subjectName", label: "Subject Name", type: "text" },
              { key: "studentPassingPercentage", label: "Student Passing Percentage", type: "number" },
              { key: "previousYearResult", label: "Previous Year Result", type: "number" },
              { key: "difficultyLevel", label: "Difficulty Level", type: "select", options: ["Easy", "Medium", "High"] },
              { key: "selfScore", label: "Self-appraisal Score", type: "number", className: "score-col" },
              { key: "average", label: "Average", type: "number", className: "score-col" },
              { key: "hodScore", label: "HoD Score", type: "number", className: "score-col" },
              { key: "committeeScore", label: "Committee Score", type: "number", className: "score-col" },
            ],
          },
          {
            id: "resultAnalysisSemII",
            title: "Sem II",
            maxMarks: 7,
            columns: [
              { key: "subjectName", label: "Subject Name", type: "text" },
              { key: "studentPassingPercentage", label: "Student Passing Percentage", type: "number" },
              { key: "previousYearResult", label: "Previous Year Result", type: "number" },
              { key: "difficultyLevel", label: "Difficulty Level", type: "select", options: ["Easy", "Medium", "High"] },
              { key: "selfScore", label: "Self-appraisal Score", type: "number", className: "score-col" },
              { key: "average", label: "Average", type: "number", className: "score-col" },
              { key: "hodScore", label: "HoD Score", type: "number", className: "score-col" },
              { key: "committeeScore", label: "Committee Score", type: "number", className: "score-col" },
            ],
          },
        ],
      },
      {
        id: "examination_duties",
        title: "B) Examination Duties",
        maxMarks: 6,
        tables: [
          {
            id: "examinationDuties",
            title: "Examination Duties",
            subtitle: "02 Marks each",
            maxMarks: 6,
            fixedRows: true,
            rows: [
              { nameOfDuty: "Paper Setting" },
              { nameOfDuty: "Paper Assessment" },
              { nameOfDuty: "Supervision" },
              { nameOfDuty: "Internal Examiner Duty" },
              { nameOfDuty: "Flying Squad" },
              { nameOfDuty: "CAP Director" },
            ],
            columns: [
              { key: "nameOfDuty", label: "Name of Duty", type: "static" },
              { key: "details", label: "Details", type: "textarea" },
              ...scoringColumns(),
            ],
          },
        ],
      },
    ],
  },
  {
    sectionId: "extension_outreach",
    number: 5,
    title: "Extension and Outreach Activities",
    maxMarks: 10,
    criteria: ["Participation in Field work, Field based activity, Industrial visit, Site visit, NSS/NCC, etc. (05 Marks each activity)"],
    groups: [
      {
        id: "extension_group",
        title: "Extension and Outreach Activities",
        tables: [
          {
            id: "extensionOutreachActivities",
            title: "Extension and Outreach Activities",
            maxMarks: 10,
            columns: [
              { key: "particular", label: "Particular", type: "text" },
              { key: "totalHoursSpent", label: "Total hours spent", type: "number" },
              { key: "dateFrom", label: "Date From", type: "date" },
              { key: "dateTo", label: "Date To", type: "date" },
              ...scoringColumns(),
            ],
          },
        ],
      },
    ],
  },
  {
    sectionId: "domain_specific_activities",
    number: 6,
    title: "Domain Specific Activities",
    maxMarks: 60,
    groups: [
      {
        id: "domain_group",
        title: "Domain Specific Activities",
        tables: [
          {
            id: "obeImplementation",
            title: "A) Outcome Based Education (OBE) Implementation",
            subtitle: "04 Marks each",
            maxMarks: 20,
            fixedRows: true,
            rows: [
              { particulars: "CO-PO-PSO Justification sheets for all courses available" },
              { particulars: "Articulation Matrix of CO-PO-PSO Mapping is available" },
              { particulars: "Course outcome attainment calculated for all courses" },
              { particulars: "PSO & Program outcome attainment through CO calculated" },
              { particulars: "Activity Plan to overcome the gaps" },
            ],
            columns: [
              { key: "particulars", label: "Particulars", type: "static" },
              { key: "recordAvailable", label: "Record available (Yes/No)", type: "select", options: ["Yes", "No"] },
              ...scoringColumns(),
            ],
          },
          {
            id: "facultyParticipation",
            title: "B) Faculty Participation in Refresher Course/Orientation Courses/Workshops/Webinars/Seminars/STTP/FDP",
            subtitle: "Approved by Central/State Government Bodies (05 Marks each)",
            maxMarks: 15,
            columns: [
              { key: "nameOfEvent", label: "Name of Event", type: "text" },
              { key: "organizedBy", label: "Organized by", type: "text" },
              { key: "dateDuration", label: "Date & Duration", type: "text" },
              ...scoringColumns(),
            ],
          },
          {
            id: "workshopsConducted",
            title: "C) Workshops/Seminars/STTP/FDP Conducted/Organized",
            maxMarks: 10,
            columns: [
              { key: "nameOfEvent", label: "Name of Event (WS, FDP, Seminar, STTP)", type: "text" },
              { key: "date", label: "Date", type: "date" },
              { key: "durationOfEvent", label: "Duration of Event", type: "text" },
              ...scoringColumns(),
            ],
          },
          {
            id: "teacherInvited",
            title: "D) Teachers Invited as resource persons / judges",
            subtitle: "University - 01 Mark, state - 02 Marks, national - 03 Marks and international - 05 Marks",
            maxMarks: 5,
            columns: [
              { key: "nameOfEvent", label: "Name of Event (WS, FDP, Seminar, STTP)", type: "text" },
              { key: "organizedBy", label: "Organized by", type: "text" },
              { key: "dateDuration", label: "Date/Duration of Event", type: "text" },
              ...scoringColumns(),
            ],
          },
          {
            id: "nptelCertification",
            title: "E) NPTEL or any other certification of faculty",
            subtitle: "05 Marks each",
            maxMarks: 10,
            columns: [
              { key: "nameOfSubject", label: "Name of Subject", type: "text" },
              { key: "durationOfCourse", label: "Duration of Course", type: "text" },
              { key: "dateOfCompletion", label: "Date of Completion", type: "date" },
              { key: "percentageOfScore", label: "% of Score", type: "number" },
              ...scoringColumns(),
            ],
          },
        ],
      },
    ],
  },
  {
    sectionId: "student_mentoring",
    number: 7,
    title: "Student Mentoring",
    maxMarks: 20,
    groups: [
      {
        id: "student_mentoring_group",
        title: "Student Mentoring",
        tables: [
          {
            id: "studentInternshipGuidance",
            title: "A) Student Internship under guidance",
            subtitle: "05 Marks each",
            maxMarks: 10,
            columns: [
              { key: "studentGroupName", label: "Name of Student/Group", type: "text" },
              { key: "industryResearchInstitute", label: "Name of Industry/Research Institute", type: "text" },
              { key: "stipendDuration", label: "Stipend & Duration", type: "text" },
              { key: "progressReportAvailable", label: "Progress report available (Yes/No)", type: "select", options: ["Yes", "No"] },
              ...scoringColumns(),
            ],
          },
          {
            id: "counselingMentoring",
            title: "B) Counseling & Mentoring",
            subtitle: "2.5 Marks each meeting",
            maxMarks: 10,
            columns: [
              { key: "classDiv", label: "Class & Div", type: "text" },
              { key: "studentsAllotted", label: "No. of Students allotted", type: "number" },
              { key: "frequencyOfMeetings", label: "Frequency of meetings conducted/year", type: "text" },
              { key: "totalMeetings", label: "Total No. of meetings conducted", type: "number" },
              ...scoringColumns(),
            ],
          },
        ],
      },
    ],
  },
  {
    sectionId: "collaborations",
    number: 8,
    title: "Collaborations",
    maxMarks: 20,
    groups: [
      {
        id: "collaborations_group",
        title: "Collaborations",
        tables: [
          {
            id: "collaborativeActivities",
            title: "A) Collaborative activities during the year",
            subtitle: "Participation in Industrial/Institutional/NGO/Government/Startups and Incubation activities (05 Marks each)",
            maxMarks: 10,
            columns: [
              { key: "activityParticulars", label: "Particulars of Activity", type: "textarea" },
              { key: "industryResearchInstitute", label: "Name of Industry/Research Institute", type: "text" },
              { key: "natureOfCollaboration", label: "Nature of Collaboration", type: "text" },
              ...scoringColumns(),
            ],
          },
          {
            id: "sponsoredProjects",
            title: "B) Sponsored Projects from Industry/Research Institute/PGCS/Seed fund by institute under guidance",
            subtitle: "05 Marks each",
            maxMarks: 10,
            columns: [
              { key: "projectTitle", label: "Title of Project", type: "text" },
              { key: "amount", label: "Amount", type: "number" },
              { key: "sponsoringInstitute", label: "Name of Sponsoring Industry/Research Institute", type: "text" },
              ...scoringColumns(),
            ],
          },
        ],
      },
    ],
  },
  {
    sectionId: "research_activity",
    number: 9,
    title: "Research Activity",
    maxMarks: 80,
    groups: [
      {
        id: "research_activity_group",
        title: "Research Activity",
        tables: [
          {
            id: "nationalResearchGrants",
            title: "A) Research grants, projects completed and ongoing from National funding agencies",
            subtitle: "AICTE/UGC/DST/SERB/DRDO/RGSTC/CSIR",
            maxMarks: 10,
            columns: [
              { key: "projectTitle", label: "Title of Project", type: "text" },
              { key: "fundingAgency", label: "Funding Agency (Duration & date of sanction)", type: "textarea" },
              { key: "totalGrantSanctioned", label: "Total Grant Sanctioned (in Lakhs)", type: "number" },
              ...scoringColumns(),
            ],
          },
          {
            id: "ugcCarePublications",
            title: "B) Research Publication in peer reviewed journals notified on UGC care list",
            subtitle: "1st Author - 03 Marks, 2nd Author - 02 Marks, 3rd Author - 01 Mark",
            maxMarks: 10,
            columns: [
              { key: "paperTitle", label: "Title of Paper", type: "text" },
              { key: "journalName", label: "Name of Journal", type: "text" },
              { key: "publisher", label: "Publisher", type: "text" },
              { key: "isbnIssnNumber", label: "ISBN/ISSN Number", type: "text" },
              ...scoringColumns(),
            ],
          },
          {
            id: "indexedPublications",
            title: "C) Research Publication in IEEE/SCOPUS/SCI/SCIE/Web of Science",
            subtitle: "Based on Average Citation index & h Index. 1st Author - 10 Marks, 2nd Author - 08 Marks, 3rd Author - 06 Marks, Other - 03 Marks",
            maxMarks: 10,
            columns: [
              { key: "paperTitle", label: "Title of Paper", type: "text" },
              { key: "journalName", label: "Name of Journal", type: "text" },
              { key: "citationIndex", label: "Citation Index", type: "text" },
              { key: "hIndex", label: "h Index", type: "text" },
              ...scoringColumns(),
            ],
          },
          {
            id: "conferenceParticipation",
            title: "D) Faculty Participation in Conferences: National / International Conference",
            subtitle: "2.5 Marks each",
            maxMarks: 5,
            columns: [
              { key: "paperTitle", label: "Title of Paper", type: "text" },
              { key: "conferenceName", label: "Name of the Conference", type: "text" },
              { key: "proceedingsTitle", label: "Title of proceedings of conference", type: "text" },
              ...scoringColumns(),
            ],
          },
          {
            id: "booksChapters",
            title: "E) Books / Chapters in Edited Volumes",
            subtitle: "Book: 05 Marks, Chapter: 2.5 Marks each",
            maxMarks: 5,
            columns: [
              { key: "bookTitle", label: "Title of the Book", type: "text" },
              { key: "chapterName", label: "Chapter Name", type: "text" },
              { key: "publisher", label: "Publisher", type: "text" },
              ...scoringColumns(),
            ],
          },
          {
            id: "reviewerEditorialBoard",
            title: "F) Teachers invited as Reviewer/Editorial board member",
            subtitle: "National/International journal/conference/book (05 Marks each)",
            maxMarks: 5,
            columns: [
              { key: "journalConferenceBook", label: "Name of Journal/conference/book", type: "text" },
              { key: "level", label: "National/International", type: "select", options: ["National", "International"] },
              { key: "role", label: "Reviewer/Editorial board member", type: "select", options: ["Reviewer", "Editorial board member"] },
              ...scoringColumns(),
            ],
          },
          {
            id: "patentsCopyright",
            title: "G) Patents/Copyright during the year",
            subtitle: "Copyright: 2.5 Marks, Design Patent: 05 Marks, Utility Patent: 10 Marks each",
            maxMarks: 10,
            columns: [
              { key: "title", label: "Title of the Patent/Copyright", type: "text" },
              { key: "designUtility", label: "Design/Utility (Application No.)", type: "text" },
              { key: "status", label: "Status", type: "select", options: ["Filed", "Published", "Granted"] },
              ...scoringColumns(),
            ],
          },
          {
            id: "developmentActivities",
            title: "H) Development Activities",
            subtitle: "A. Product Development B. Laboratories C. Working models/charts/monograms etc. (05 Marks each)",
            maxMarks: 5,
            columns: [
              { key: "activity", label: "Activity", type: "textarea" },
              { key: "fundingAmount", label: "Funding amount (if any)", type: "number" },
              ...scoringColumns(),
            ],
          },
          {
            id: "consultancyIndustry",
            title: "I) Consultancy from Industry",
            subtitle: "05 Marks each",
            maxMarks: 5,
            columns: [
              { key: "areaNature", label: "Area/Nature of Consultancy", type: "textarea" },
              { key: "fundsGenerated", label: "Funds Generated (Rs.)", type: "number" },
              ...scoringColumns(),
            ],
          },
          {
            id: "teacherAwards",
            title: "J) Awards won by Teacher during the year",
            subtitle: "05 Marks each",
            maxMarks: 5,
            columns: [
              { key: "particular", label: "Particular", type: "textarea" },
              { key: "awardingAgency", label: "Awarding Agency", type: "text" },
              ...scoringColumns(),
            ],
          },
          {
            id: "otherAchievements",
            title: "K) Any other considerable achievements",
            subtitle: "05 Marks each",
            maxMarks: 10,
            columns: [
              { key: "achievement", label: "Achievement", type: "textarea" },
              { key: "levelOfAchievement", label: "Level of Achievement (University/State/National, etc.)", type: "text" },
              ...scoringColumns(),
            ],
          },
        ],
      },
    ],
  },
  {
    sectionId: "personal_attributes",
    number: 10,
    title: "Personal Attributes",
    maxMarks: 10,
    groups: [
      {
        id: "personal_attributes_group",
        title: "Personal Attributes",
        tables: [
          {
            id: "personalAttributes",
            title: "Personal Attributes",
            subtitle: "01 Mark each",
            maxMarks: 10,
            fixedRows: true,
            rows: [
              { attribute: "Attitude towards work" },
              { attribute: "Sense of responsibility" },
              { attribute: "Overall behavior and personality" },
              { attribute: "Emotional Stability" },
              { attribute: "Communication Skills" },
              { attribute: "Professional Skills" },
              { attribute: "Moral courage and willingness" },
              { attribute: "Leadership qualities" },
              { attribute: "Capacity to work within timeframe" },
              { attribute: "Decision making ability" },
            ],
            columns: [
              { key: "attribute", label: "Attribute", type: "static" },
              ...scoringColumns(),
            ],
          },
        ],
      },
    ],
  },
];

export const SUMMARY_PARAMETERS = FACULTY_SAR_TABLES.map(({ number, title, maxMarks }) => ({
  number,
  title,
  maxMarks,
}));

export default FACULTY_SAR_TABLES;
