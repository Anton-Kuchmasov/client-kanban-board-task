import React, { useEffect } from 'react';
import {
  DragDropContext,
  type DropResult,
  Droppable
} from 'react-beautiful-dnd';

import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { type RootState } from '../../app/store.ts';

import {
  actions as TodosActions,
  updateAllTodosIndexes,
  addNewTodo,
  fetchTodosFromUserID,
  updateTodoStatusOnDrop
} from '../../features/todos/todosSlice.ts';

import { Board } from '../Board/Board.tsx';
import { TodoStatus } from '../../types/TodoStatus.ts';
import { type Todo } from '../../types/Todo.ts';
import { EditForm } from '../EditForm/EditForm.tsx';
import { Loader } from '../Loader/Loader.tsx';
import { Error } from '../../types/Error.ts';

export const Kanban: React.FC = () => {
  const dispatch = useAppDispatch();
  const userID = useAppSelector((state: RootState) => state.user.id);
  const isLoaded: boolean = useAppSelector(
    (state: RootState) => state.todos.isLoading
  );

  const isCreating = useAppSelector(
    (state: RootState) => state.todos.isCreating
  );

  const normalizedUserID: number = Number(userID) ? Number(userID) : 0;

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (normalizedUserID) {
        try {
          await dispatch(fetchTodosFromUserID(normalizedUserID));
        } catch (error) {
          dispatch(TodosActions.setError(Error.LOAD_TODOS));
        }
      }
    };
    void fetchData();
  }, [userID]);

  const todos: Todo[] = useAppSelector((state: RootState) => state.todos.items);

  const handlePressCreate = (): void => {
    dispatch(TodosActions.setIsCreating(true));
  };

  const handleAddTodo = async (
    title: string,
    description: string
  ): Promise<void> => {
    if (!title.trim().length) {
      dispatch(TodosActions.setIsCreating(false));
      return;
    }

    try {
      await dispatch(
        addNewTodo({
          title,
          description,
          userID: normalizedUserID,
          todos
        })
      );
      dispatch(TodosActions.setIsCreating(false));

      await dispatch(fetchTodosFromUserID(normalizedUserID));
    } catch (error) {
      dispatch(TodosActions.setError(Error.ADD_TODO));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    handlePressCreate();
  };

  const handleCancel = (): void => {
    dispatch(TodosActions.setIsCreating(false));
  };

  const handleDragEnd = async (result: DropResult): Promise<void> => {
    if (!result.destination) {
      return;
    }

    const { destination } = result;
    const movedTodoId: string = result.draggableId;
    const destinationColumn = destination.droppableId;

    const movedTodo = todos.find((todo) => todo.id === movedTodoId);

    if (!movedTodo) {
      return;
    }

    if (movedTodo.status === destinationColumn) {
      const sourceTodos = todos.filter((todo) => todo.id !== movedTodoId);
      const destinationIndex: number = destination.index;
      sourceTodos.splice(destinationIndex - 1, 0, movedTodo);

      dispatch(TodosActions.setTodos(sourceTodos));
      dispatch(TodosActions.updateLocalTodoIndexes());

      try {
        await dispatch(updateAllTodosIndexes());
      } catch (error) {
        dispatch(TodosActions.setError(Error.UPDATE_TODO));
      }
      return;
    }

    if (movedTodo.status) {
      dispatch(
        TodosActions.updateLocalTodoStatus({
          id: movedTodoId,
          status: destinationColumn as TodoStatus
        })
      );

      dispatch(TodosActions.updateLocalTodoIndexes());

      try {
        await dispatch(
          updateTodoStatusOnDrop({
            id: movedTodoId,
            status: destinationColumn as TodoStatus
          })
        );
        await dispatch(updateAllTodosIndexes());
      } catch (error) {
        dispatch(TodosActions.setError(Error.UPDATE_TODO));
      }
    }
  };

  return isLoaded ? (
    <div className="is-flex is-justify-content-center">
      <Loader />
    </div>
  ) : (
    <>
      <div className="subtitle has-text-centered is-size-4">
        Your user ID is : {userID}
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="container is-fluid is-flex-direction-row is-justify-content-center">
          {!isCreating && (
            <form
              className="is-flex is-justify-content-center"
              onSubmit={handleSubmit}
            >
              <button
                type="button"
                className="button is-primary is-medium is-rounded"
                onClick={handlePressCreate}
                disabled={isCreating}
              >
                Click to create Todo
              </button>
            </form>
          )}
          {isCreating && (
            <div className="is-flex is-align-items-center is-justify-content-center">
              <EditForm
                onSaveTodo={handleAddTodo}
                onCancelEdit={handleCancel}
              />
            </div>
          )}

          <div className="columns is-flex is-justify-content-center">
            <div className="column box is-rounded has-background-danger-light mt-5 mb-0">
              <h2 className="title is-3">To Do:</h2>
              <Droppable droppableId={TodoStatus.TODO}>
                {(provided) => (
                  <div
                    className="todos-container__todo"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <Board name={TodoStatus.TODO} />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <div className="column is-0"></div>

            <div className="column box is-rounded has-background-warning-light mt-5 mb-0">
              <h2 className="title is-3">In Progress:</h2>
              <Droppable droppableId={TodoStatus.IN_PROGRESS}>
                {(provided) => (
                  <div
                    className="todos-container__todo"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <Board name={TodoStatus.IN_PROGRESS} />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            <div className="column is-0"></div>

            <div className="column box is-rounded has-background-primary-light mt-5">
              <h2 className="title is-3">Done:</h2>
              <Droppable droppableId={TodoStatus.DONE}>
                {(provided) => (
                  <div
                    className="todos-container__todo"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <Board name={TodoStatus.DONE} />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
      </DragDropContext>
    </>
  );
};
