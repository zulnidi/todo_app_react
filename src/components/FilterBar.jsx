import PropTypes from "prop-types";
import { FILTERS } from "../domain/todo";

const LABELS = { [FILTERS.ALL]: "Todas", [FILTERS.ACTIVE]: "Pendientes", [FILTERS.DONE]: "Hechas" };

export default function FilterBar({ filter, onFilterChange, query, onQueryChange }) {
  return (
    <div className="filter-bar">
      <div role="group" aria-label="Filtrar tareas" className="segmented">
        {Object.values(FILTERS).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => onFilterChange(value)}
          >
            {LABELS[value]}
          </button>
        ))}
      </div>
      <input
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Buscar…"
        aria-label="Buscar tareas"
      />
    </div>
  );
}

FilterBar.propTypes = {
  filter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  onQueryChange: PropTypes.func.isRequired,
};
