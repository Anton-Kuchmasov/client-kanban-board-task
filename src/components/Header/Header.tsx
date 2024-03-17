import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';

import { actions as UserActions } from '../../features/user/userSlice.ts';
import {
  actions as TodosActions,
  fetchAllUserIDs
} from '../../features/todos/todosSlice.ts';

import { Error } from '../../types/Error.ts';
import { type RootState } from '../../app/store.ts';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const hasNoTodos = useAppSelector(
    (state: RootState) => !state.todos.items.length
  );
  const userID = useAppSelector((state: RootState) => state.user.id);
  const isLoading = useAppSelector((state: RootState) => state.todos.isLoading);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, []);

  const handleNew = (event: React.MouseEvent): void => {
    event.preventDefault();
    dispatch(fetchAllUserIDs())
      .then((action) => {
        const userIDs = action.payload as number[];
        const newUserID = Math.max(...userIDs) + 1;
        dispatch(UserActions.set(newUserID));
      })

      .catch(() => {
        dispatch(TodosActions.setError(Error.LOAD_TODOS));
      });

    if (titleField.current) {
      titleField.current.value = '';
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (titleField.current != null) {
      const id = Number(titleField.current.value);

      if (Number.isNaN(id) || id < 1 || !Number.isFinite(id)) {
        dispatch(TodosActions.setError(Error.UNCORRECT_ID));
        dispatch(TodosActions.setTodos([]));
        titleField.current.value = '';
        titleField.current.focus();

        return;
      }
      dispatch(UserActions.set(id));
      titleField.current.blur();
      dispatch(TodosActions.setError(false));
      titleField.current.value = '';
    }
  };

  return (
    <>
      <div className="block container has-text-centered">
        <h1 className="title is-size-3 mt-1">Welcome to Kanban Board!</h1>
        <h2 className="subtitle is-size-4 mt-1">
          Enter your user ID or create a new board
        </h2>
        <div className="container mt-2">
          <div className="level mt-6 is-flex is-justify-content-center">
            <form className="level-left" onSubmit={handleSubmit}>
              <input
                type="text"
                className="input is-medium"
                placeholder="Enter ID"
                ref={titleField}
                disabled={isLoading}
              />

              <div className="level-right ml-5 is-flex is-justify-content-space-between">
                <button
                  type="submit"
                  className="button is-size-5 is-primary mr-3"
                  disabled={isLoading}
                >
                  Search todos
                </button>

                <button
                  type="submit"
                  className="button is-size-5 is-info"
                  onClick={handleNew}
                  disabled={(hasNoTodos && !!userID) ?? isLoading}
                >
                  Create new board
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
