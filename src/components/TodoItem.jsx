import { useState } from "react";
import PropTypes from "prop-types";
import { validateText } from "../domain/todo";
import Button from "./Button";

export default function TodoItem({ todo, onToggle, onEdit, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);

  function save(event) {
    event.preventDefault();
    if (validateText(draft)) return;
    onEdit(todo.id, draft);
    setEditing(false);
  }

  function cancel() {
    setDraft(todo.text);
    setEditing(false);
  }

  return (
    <li className={`todo-item${todo.done ? " is-done" : ""}`}>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
        aria-label={`Marcar "${todo.text}" como ${todo.done ? "pendiente" : "hecha"}`}
      />
      {editing ? (
        <form className="todo-item__edit" onSubmit={save}>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-label="Editar tarea"
            autoFocus
          />
          <Button type="submit">Guardar</Button>
          <Button variant="ghost" onClick={cancel}>
            Cancelar
          </Button>
        </form>
      ) : (
        <>
          <span className="todo-item__text">{todo.text}</span>
          <span className={`badge badge--${todo.priority}`}>{todo.priority}</span>
          <Button
            variant="ghost"
            onClick={() => setEditing(true)}
            aria-label={`Editar "${todo.text}"`}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            onClick={() => onRemove(todo.id)}
            aria-label={`Eliminar "${todo.text}"`}
          >
            Eliminar
          </Button>
        </>
      )}
    </li>
  );
}

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    done: PropTypes.bool.isRequired,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};
