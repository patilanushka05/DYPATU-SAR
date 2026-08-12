export const SAR_WORKFLOW_ROLES = {
  faculty: {
    id: "faculty",
    label: "Faculty",
  },
  hodDeanFunctionalHead: {
    id: "hod_dean_functional_head",
    label: "HOD / Dean / Functional Head",
  },
  registrar: {
    id: "registrar",
    label: "Registrar",
  },
  dean: {
    id: "dean",
    label: "Dean",
  },
  viceChancellor: {
    id: "vice_chancellor",
    label: "Vice Chancellor",
  },
};

export const SAR_WORKFLOW_STAGES = [
  SAR_WORKFLOW_ROLES.faculty,
  SAR_WORKFLOW_ROLES.hodDeanFunctionalHead,
  SAR_WORKFLOW_ROLES.registrar,
  SAR_WORKFLOW_ROLES.dean,
  SAR_WORKFLOW_ROLES.viceChancellor,
];

// The PDF groups "HOD / Dean / Functional Head" as one 25-mark appraisal bucket.
// The exact routing rule for choosing one of those authorities is a business decision.

export default SAR_WORKFLOW_STAGES;
