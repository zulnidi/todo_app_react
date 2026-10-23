import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { createMemoryRepository } from "../storage/todoRepository";
import TodoApp from "./TodoApp";

const seed = (text, extra = {}) => ({
  id: text,
  text,
  priority: "media",
  done: false,
  createdAt: 1,
  ...extra,
});

function setup(initial = []) {
  const repository = createMemoryRepository(initial);
  const user = userEvent.setup();
  render(<TodoApp repository={repository} />);
  return { repository, user };
}

async function addTodo(user, text, priority) {
  await user.type(screen.getByLabelText("Nueva tarea"), text);
  if (priority) await user.selectOptions(screen.getByLabelText("Prioridad"), priority);
  await user.click(screen.getByRole("button", { name: "Agregar" }));
}

describe("TodoApp", () => {
  it("muestra el estado vacío", () => {
    setup();
    expect(screen.getByText(/Aún no tienes tareas/)).toBeInTheDocument();
  });

  it("agrega una tarea y la persiste", async () => {
    const { user, repository } = setup();
    await addTodo(user, "Preparar entrevista", "alta");
    expect(screen.getByText("Preparar entrevista")).toBeInTheDocument();
    expect(within(screen.getByRole("list")).getByText("alta")).toBeInTheDocument();
    expect(repository.load()).toHaveLength(1);
  });

  it("muestra un error accesible si el texto está vacío", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "Agregar" }));
    expect(screen.getByRole("alert")).toHaveTextContent(/Escribe una tarea/);
  });

  it("carga las tareas guardadas", () => {
    setup([seed("Guardada")]);
    expect(screen.getByText("Guardada")).toBeInTheDocument();
  });

  it("marca como hecha y actualiza el progreso", async () => {
    const { user } = setup([seed("A"), seed("B")]);
    await user.click(screen.getByRole("checkbox", { name: /Marcar "A"/ }));
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "50");
  });

  it("filtra por estado y por búsqueda", async () => {
    const { user } = setup([seed("Pan"), seed("React", { done: true })]);
    await user.click(screen.getByRole("button", { name: "Hechas" }));
    expect(screen.queryByText("Pan")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Todas" }));
    await user.type(screen.getByLabelText("Buscar tareas"), "pa");
    expect(screen.getByText("Pan")).toBeInTheDocument();
    expect(screen.queryByText("React")).not.toBeInTheDocument();
  });

  it("edita una tarea", async () => {
    const { user } = setup([seed("Vieja")]);
    await user.click(screen.getByRole("button", { name: /Editar "Vieja"/ }));
    const input = screen.getByLabelText("Editar tarea");
    await user.clear(input);
    await user.type(input, "Nueva");
    await user.click(screen.getByRole("button", { name: "Guardar" }));
    expect(screen.getByText("Nueva")).toBeInTheDocument();
  });

  it("elimina y permite deshacer", async () => {
    const { user } = setup([seed("Borrar")]);
    await user.click(screen.getByRole("button", { name: /Eliminar "Borrar"/ }));
    expect(screen.queryByText("Borrar")).not.toBeInTheDocument();
    await user.click(within(screen.getByRole("status")).getByRole("button", { name: "Deshacer" }));
    expect(screen.getByText("Borrar")).toBeInTheDocument();
  });

  it("limpia las hechas", async () => {
    const { user } = setup([seed("Hecha", { done: true }), seed("Pendiente")]);
    await user.click(screen.getByRole("button", { name: "Limpiar hechas" }));
    expect(screen.queryByText("Hecha")).not.toBeInTheDocument();
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
  });
});
