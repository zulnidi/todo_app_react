import { useId, useState } from "react";
import PropTypes from "prop-types";
import { PRIORITIES, validateText } from "../domain/todo";
import Button from "./Button";

export default function TodoForm({ onAdd }) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("media");
  const [error, setError] = useState(null);
  const textId = useId();
  const errorId = useId();

  function handleSubmit(event) {
    event.preventDefault();
    const validationError = validateText(text);
    if (validationError) return setError(validationError);
    onAdd({ text, priority });
    setText("");
    setError(null);
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor={textId}>Nueva tarea</label>
        <input
          id={textId}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Ej.: Estudiar para la entrevista"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
      </div>
      <div className="field field--small">
        <label htmlFor={`${textId}-priority`}>Prioridad</label>
        <select
          id={`${textId}-priority`}
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit">Agregar</Button>
      {error && (
        <p id={errorId} role="alert" className="form-error">
          {error}
        </p>
      )}
    </form>
  );
}

TodoForm.propTypes = { onAdd: PropTypes.func.isRequired };
