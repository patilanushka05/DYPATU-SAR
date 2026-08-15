import StandardMyAppraisal from "./StandardMyAppraisal";

export default function MyAppraisalSection({
  sectionTab,
  onSectionTabChange,
  showSectionSelector = true,
  defaultDesignation = "",
  defaultAcademicYear,
  titleNameFallback = "Faculty",
  subtitleSeparator = ".",
}) {
  return (
    <StandardMyAppraisal
      sectionTab={sectionTab}
      onSectionTabChange={onSectionTabChange}
      showSectionSelector={showSectionSelector}
      defaultDesignation={defaultDesignation}
      defaultAcademicYear={defaultAcademicYear}
      titleNameFallback={titleNameFallback}
      subtitleSeparator={subtitleSeparator}
    />
  );
}
