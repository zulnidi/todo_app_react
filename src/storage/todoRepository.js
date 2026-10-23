import { isValidTodo } from "../domain/todo";

/**
 * Un "repositorio" de tareas es cualquier objeto con:
 *   load(): Todo[]   y   save(todos): void
 * La app depende de esa forma, no de localStorage (principio de inversión de
 * dependencias), así en las pruebas se inyecta uno en memoria.
 */
export function createLocalStorageRepository(key, storage = globalThis.localStorage) {
  return {
    load() {
      try {
        const parsed = JSON.parse(storage.getItem(key) ?? "[]");
        return Array.isArray(parsed) ? parsed.filter(isValidTodo) : [];
      } catch {
        return []; // datos corruptos o almacenamiento no disponible
      }
    },
    save(todos) {
      try {
        storage.setItem(key, JSON.stringify(todos));
      } catch {
        // cuota llena o modo privado: la app sigue funcionando sin persistir
      }
    },
  };
}

export function createMemoryRepository(initial = []) {
  let data = [...initial];
  return {
    load: () => [...data],
    save: (todos) => {
      data = [...todos];
    },
  };
}
