import { createTodo } from "../domain/todo";

export const ACTIONS = {
  ADD: "add",
  TOGGLE: "toggle",
  EDIT: "edit",
  REMOVE: "remove",
  UNDO_REMOVE: "undo-remove",
  CLEAR_DONE: "clear-done",
};

export const initialState = (todos = []) => ({ todos, lastRemoved: null });

export function todoReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD:
      return { ...state, todos: [...state.todos, action.todo] };

    case ACTIONS.TOGGLE:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.id ? { ...todo, done: !todo.done } : todo,
        ),
      };

    case ACTIONS.EDIT:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.id ? { ...todo, text: action.text.trim() } : todo,
        ),
      };

    case ACTIONS.REMOVE: {
      const index = state.todos.findIndex((todo) => todo.id === action.id);
      if (index === -1) return state;
      return {
        todos: state.todos.filter((todo) => todo.id !== action.id),
        lastRemoved: { todo: state.todos[index], index },
      };
    }

    case ACTIONS.UNDO_REMOVE: {
      if (!state.lastRemoved) return state;
      const { todo, index } = state.lastRemoved;
      const todos = [...state.todos];
      todos.splice(Math.min(index, todos.length), 0, todo);
      return { todos, lastRemoved: null };
    }

    case ACTIONS.CLEAR_DONE:
      return { todos: state.todos.filter((todo) => !todo.done), lastRemoved: null };

    default:
      throw new Error(`Acción desconocida: ${action.type}`);
  }
}

// Creadores de acciones: la UI no necesita conocer la forma interna de cada acción.
export const actions = {
  add: (input, options) => ({ type: ACTIONS.ADD, todo: createTodo(input, options) }),
  toggle: (id) => ({ type: ACTIONS.TOGGLE, id }),
  edit: (id, text) => ({ type: ACTIONS.EDIT, id, text }),
  remove: (id) => ({ type: ACTIONS.REMOVE, id }),
  undoRemove: () => ({ type: ACTIONS.UNDO_REMOVE }),
  clearDone: () => ({ type: ACTIONS.CLEAR_DONE }),
};
