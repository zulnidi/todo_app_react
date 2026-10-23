import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { FILTERS, filterTodos, getStats } from "../domain/todo";
import { useTodos } from "../hooks/useTodos";
import Button from "./Button";
import FilterBar from "./FilterBar";
import Stats from "./Stats";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";

export default function TodoApp({ repository }) {
  const { todos, lastRemoved, add, toggle, edit, remove, undoRemove, clearDone } =
    useTodos(repository);
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [query, setQuery] = useState("");

  const visible = useMemo(() => filterTodos(todos, { filter, query }), [todos, filter, query]);
  const stats = useMemo(() => getStats(todos), [todos]);

  return (
    <div className="page">
      <header className="hero">
        <h1 className="title">Mis tareas</h1>
        <p className="subtitle">Organiza tu día con prioridades, búsqueda y progreso.</p>
      </header>

      <main className="content">
        <TodoForm onAdd={add} />
        <Stats {...stats} />
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          query={query}
          onQueryChange={setQuery}
        />

        {visible.length === 0 ? (
          <p className="empty">
            {todos.length === 0
              ? "Aún no tienes tareas. ¡Agrega la primera!"
              : "Ninguna tarea coincide con el filtro."}
          </p>
        ) : (
          <ul className="todo-list">
            {visible.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggle}
                onEdit={edit}
                onRemove={remove}
              />
            ))}
          </ul>
        )}

        <div className="actions" role="status" aria-live="polite">
          {lastRemoved && (
            <span className="undo">
              Tarea eliminada.{" "}
              <Button variant="ghost" onClick={undoRemove}>
                Deshacer
              </Button>
            </span>
          )}
          {stats.done > 0 && (
            <Button variant="ghost" onClick={clearDone}>
              Limpiar hechas
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

TodoApp.propTypes = {
  repository: PropTypes.shape({ load: PropTypes.func, save: PropTypes.func }).isRequired,
};
