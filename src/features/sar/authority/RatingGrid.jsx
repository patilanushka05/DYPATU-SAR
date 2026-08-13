export default function RatingGrid({ idPrefix, columns, rows, values, onChange, legend, showPleaseTick }) {
  return (
    <div className="sar-rating-grid">
      {showPleaseTick && <p className="sar-rating-grid__instruction">Please Tick the appropriate box:</p>}

      {legend?.length > 0 && (
        <div className="sar-rating-legend">
          {legend.map((item) => (
            <div key={item.level} className="sar-rating-legend__item">
              <span className="sar-rating-legend__level">{item.level}. {item.label}</span>
              <span className="sar-rating-legend__range">{item.range}</span>
            </div>
          ))}
        </div>
      )}

      <div className="sar-table-wrap">
        <table className="sar-table sar-rating-table">
          <thead>
            <tr>
              <th>Parameters</th>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row}>
                <td>{row}</td>
                {columns.map((column) => (
                  <td key={column} className="sar-rating-cell">
                    <input
                      type="radio"
                      name={`${idPrefix}-row-${rowIndex}`}
                      value={column}
                      checked={values[rowIndex] === column}
                      onChange={() => onChange(rowIndex, column)}
                      aria-label={`${row}: ${column}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
