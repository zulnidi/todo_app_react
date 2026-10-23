import PropTypes from "prop-types";

export default function Stats({ total, done, pending, percent }) {
  return (
    <section aria-label="Progreso" className="stats">
      <p>
        <strong>{done}</strong> de <strong>{total}</strong> hechas · {pending} pendientes
      </p>
      <div
        className="progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Porcentaje completado"
      >
        <div className="progress__bar" style={{ width: `${percent}%` }} />
      </div>
    </section>
  );
}

Stats.propTypes = {
  total: PropTypes.number.isRequired,
  done: PropTypes.number.isRequired,
  pending: PropTypes.number.isRequired,
  percent: PropTypes.number.isRequired,
};
