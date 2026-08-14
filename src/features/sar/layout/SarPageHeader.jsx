export default function SarPageHeader({ eyebrow, title }) {
  return (
    <div className="sar-shell__page-header">
      <p className="sar-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
    </div>
  );
}
