// Reglas de negocio puras: no dependen de React ni del navegador.
// Al ser funciones puras son fáciles de probar y de reutilizar.

export const PRIORITIES = ["alta", "media", "baja"];
export const FILTERS = { ALL: "all", ACTIVE: "active", DONE: "done" };
export const MAX_TEXT_LENGTH = 120;

let fallbackCounter = 0;
const defaultIdGenerator = () =>
  globalThis.crypto?.randomUUID?.() ?? `todo-${Date.now()}-${fallbackCounter++}`;

/** Devuelve un mensaje de error en español o `null` si el texto es válido. */
export function validateText(text) {
  const value = (text ?? "").trim();
  if (!value) return "Escribe una tarea antes de agregarla.";
  if (value.length > MAX_TEXT_LENGTH) {
    return `La tarea no puede superar ${MAX_TEXT_LENGTH} caracteres.`;
  }
  return null;
}

export function createTodo(
  { text, priority = "media" },
  { generateId = defaultIdGenerator, now = Date.now } = {},
) {
  const error = validateText(text);
  if (error) throw new Error(error);
  if (!PRIORITIES.includes(priority)) throw new Error("Prioridad no válida.");
  return {
    id: generateId(),
    text: text.trim(),
    priority,
    done: false,
    createdAt: now(),
  };
}

export function filterTodos(todos, { filter = FILTERS.ALL, query = "" } = {}) {
  const normalizedQuery = query.trim().toLowerCase();
  return todos.filter((todo) => {
    if (filter === FILTERS.ACTIVE && todo.done) return false;
    if (filter === FILTERS.DONE && !todo.done) return false;
    return !normalizedQuery || todo.text.toLowerCase().includes(normalizedQuery);
  });
}

export function getStats(todos) {
  const done = todos.filter((todo) => todo.done).length;
  const total = todos.length;
  return {
    total,
    done,
    pending: total - done,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}

/** Comprueba que lo leído del almacenamiento tiene la forma esperada. */
export function isValidTodo(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof value.id === "string" &&
    typeof value.text === "string" &&
    typeof value.done === "boolean" &&
    PRIORITIES.includes(value.priority)
  );
}
