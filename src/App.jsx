import TodoApp from "./components/TodoApp";
import { createLocalStorageRepository } from "./storage/todoRepository";

// Punto de composición: aquí se elige la implementación concreta de persistencia.
const repository = createLocalStorageRepository("zullie.todos.v1");

export default function App() {
  return <TodoApp repository={repository} />;
}
