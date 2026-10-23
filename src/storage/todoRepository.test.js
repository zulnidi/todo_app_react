import { describe, expect, it } from "vitest";
import { createLocalStorageRepository, createMemoryRepository } from "./todoRepository";

const fakeStorage = (initial = {}) => {
  const data = { ...initial };
  return {
    getItem: (k) => data[k] ?? null,
    setItem: (k, v) => {
      data[k] = v;
    },
  };
};
const todo = { id: "1", text: "x", priority: "media", done: false };

describe("createLocalStorageRepository", () => {
  it("guarda y recupera tareas", () => {
    const repo = createLocalStorageRepository("k", fakeStorage());
    repo.save([todo]);
    expect(repo.load()).toEqual([todo]);
  });
  it("devuelve [] con JSON corrupto", () => {
    expect(createLocalStorageRepository("k", fakeStorage({ k: "{no json" })).load()).toEqual([]);
  });
  it("descarta elementos con forma inválida", () => {
    const storage = fakeStorage({ k: JSON.stringify([todo, { foo: 1 }]) });
    expect(createLocalStorageRepository("k", storage).load()).toEqual([todo]);
  });
  it("no rompe si el almacenamiento falla al guardar", () => {
    const failing = {
      getItem: () => null,
      setItem: () => {
        throw new Error("cuota");
      },
    };
    expect(() => createLocalStorageRepository("k", failing).save([todo])).not.toThrow();
  });
});

describe("createMemoryRepository", () => {
  it("funciona como un repositorio en memoria", () => {
    const repo = createMemoryRepository([todo]);
    expect(repo.load()).toEqual([todo]);
    repo.save([]);
    expect(repo.load()).toEqual([]);
  });
});
