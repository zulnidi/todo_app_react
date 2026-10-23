import { describe, expect, it } from "vitest";
import { FILTERS, createTodo, filterTodos, getStats, isValidTodo, validateText } from "./todo";

const make = (text, extra = {}) => ({
  ...createTodo({ text }, { generateId: () => text }),
  ...extra,
});

describe("validateText", () => {
  it("rechaza texto vacío o solo espacios", () => {
    expect(validateText("")).toMatch(/Escribe una tarea/);
    expect(validateText("   ")).toMatch(/Escribe una tarea/);
    expect(validateText(undefined)).toMatch(/Escribe una tarea/);
  });
  it("rechaza textos demasiado largos", () => {
    expect(validateText("a".repeat(121))).toMatch(/120/);
  });
  it("acepta texto válido", () => {
    expect(validateText("Estudiar")).toBeNull();
  });
});

describe("createTodo", () => {
  it("crea una tarea con valores por defecto y texto recortado", () => {
    const todo = createTodo({ text: "  Leer  " }, { generateId: () => "1", now: () => 10 });
    expect(todo).toEqual({ id: "1", text: "Leer", priority: "media", done: false, createdAt: 10 });
  });
  it("lanza error con texto inválido o prioridad desconocida", () => {
    expect(() => createTodo({ text: "" })).toThrow();
    expect(() => createTodo({ text: "x", priority: "urgente" })).toThrow(/Prioridad/);
  });
});

describe("filterTodos", () => {
  const todos = [make("Comprar pan"), make("Estudiar React", { done: true })];
  it("filtra por estado", () => {
    expect(filterTodos(todos, { filter: FILTERS.ACTIVE }).map((t) => t.id)).toEqual([
      "Comprar pan",
    ]);
    expect(filterTodos(todos, { filter: FILTERS.DONE }).map((t) => t.id)).toEqual([
      "Estudiar React",
    ]);
  });
  it("busca sin distinguir mayúsculas", () => {
    expect(filterTodos(todos, { query: "REACT" })).toHaveLength(1);
  });
  it("sin criterios devuelve todo", () => {
    expect(filterTodos(todos)).toHaveLength(2);
  });
});

describe("getStats", () => {
  it("calcula totales y porcentaje", () => {
    expect(getStats([make("a", { done: true }), make("b")])).toEqual({
      total: 2,
      done: 1,
      pending: 1,
      percent: 50,
    });
  });
  it("con lista vacía el porcentaje es 0", () => {
    expect(getStats([]).percent).toBe(0);
  });
});

describe("isValidTodo", () => {
  it("valida la forma del objeto", () => {
    expect(isValidTodo(make("x"))).toBe(true);
    expect(isValidTodo(null)).toBe(false);
    expect(isValidTodo({ id: 1 })).toBe(false);
  });
});
