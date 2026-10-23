import { describe, expect, it } from "vitest";
import { actions, initialState, todoReducer } from "./todoReducer";

const add = (state, text, id = text) =>
  todoReducer(state, actions.add({ text }, { generateId: () => id, now: () => 1 }));

describe("todoReducer", () => {
  it("agrega, alterna y edita tareas", () => {
    let state = add(initialState(), "uno");
    state = todoReducer(state, actions.toggle("uno"));
    expect(state.todos[0].done).toBe(true);
    state = todoReducer(state, actions.edit("uno", "  dos "));
    expect(state.todos[0].text).toBe("dos");
  });

  it("elimina y permite deshacer en la misma posición", () => {
    let state = initialState();
    ["a", "b", "c"].forEach((t) => (state = add(state, t)));
    state = todoReducer(state, actions.remove("b"));
    expect(state.todos.map((t) => t.id)).toEqual(["a", "c"]);
    state = todoReducer(state, actions.undoRemove());
    expect(state.todos.map((t) => t.id)).toEqual(["a", "b", "c"]);
    expect(state.lastRemoved).toBeNull();
  });

  it("ignora eliminar un id inexistente y deshacer sin nada que deshacer", () => {
    const state = add(initialState(), "a");
    expect(todoReducer(state, actions.remove("zzz"))).toBe(state);
    expect(todoReducer(state, actions.undoRemove())).toBe(state);
  });

  it("limpia las hechas", () => {
    let state = add(add(initialState(), "a"), "b");
    state = todoReducer(state, actions.toggle("a"));
    state = todoReducer(state, actions.clearDone());
    expect(state.todos.map((t) => t.id)).toEqual(["b"]);
  });

  it("lanza error con acciones desconocidas", () => {
    expect(() => todoReducer(initialState(), { type: "nope" })).toThrow(/desconocida/);
  });
});
