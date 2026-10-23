import { useCallback, useEffect, useMemo, useReducer } from "react";
import { actions, initialState, todoReducer } from "../state/todoReducer";

/** Une el reducer con el repositorio de persistencia. */
export function useTodos(repository) {
  const [state, dispatch] = useReducer(todoReducer, repository, (repo) =>
    initialState(repo.load()),
  );

  useEffect(() => {
    repository.save(state.todos);
  }, [repository, state.todos]);

  const add = useCallback((input) => dispatch(actions.add(input)), []);
  const toggle = useCallback((id) => dispatch(actions.toggle(id)), []);
  const edit = useCallback((id, text) => dispatch(actions.edit(id, text)), []);
  const remove = useCallback((id) => dispatch(actions.remove(id)), []);
  const undoRemove = useCallback(() => dispatch(actions.undoRemove()), []);
  const clearDone = useCallback(() => dispatch(actions.clearDone()), []);

  return useMemo(
    () => ({
      todos: state.todos,
      lastRemoved: state.lastRemoved,
      add,
      toggle,
      edit,
      remove,
      undoRemove,
      clearDone,
    }),
    [state, add, toggle, edit, remove, undoRemove, clearDone],
  );
}
