import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import {
  actions as TodosActions,
  deleteTodoById,
  updateTodoOnServer
} from '../../features/todos/todosSlice.ts';

import { EditForm } from '../EditForm/EditForm.tsx';
import { type Todo } from '../../types/Todo.ts';
import { Error } from '../../types/Error.ts';

interface Props {
  todo: Todo;
}

export const TodoCard: React.FC<Props> = ({ todo }) => {
  const dispatch = useAppDispatch();
  const { title, description, id } = todo;

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = (event: React.MouseEvent): void => {
    event.preventDefault();
    setIsEditing(true);
  };

  const handleSaveTodo = async (
    titleUpdated: string,
    descriptionUpdated: string,
    todoID: string
  ): Promise<void> => {
    if (!titleUpdated.length) {
      return;
    }
    dispatch(
      TodosActions.localUpdate({
        id: todoID,
        title: titleUpdated,
        description: descriptionUpdated
      })
    );
    setIsEditing(false);

    try {
      void dispatch(
        updateTodoOnServer({
          id: todoID,
          title: titleUpdated,
          description: descriptionUpdated
        })
      );
      setIsEditing(false);
    } catch (error) {
      dispatch(TodosActions.setError(Error.UPDATE_TODO));
    }
  };

  const handleDelete = (todoID: string): void => {
    dispatch(TodosActions.localDelete(todoID));
    try {
      void dispatch(deleteTodoById(todoID));
    } catch (error) {
      dispatch(TodosActions.setError(Error.DELETE_TODO));
    }
  };

  const handleCancel = (): void => {
    setIsEditing(false);
  };

  return (
    <Draggable
      draggableId={todo.id}
      index={todo.index}
      key={todo.id}
      isDragDisabled={isEditing}
    >
      {(provided) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {isEditing ? (
              <EditForm
                todoToEdit={todo}
                onSaveTodo={handleSaveTodo}
                onCancelEdit={handleCancel}
              />
            ) : (
              <div className="card is-outlined is-info card-shadow has-border">
                <div className="card-header-title is-size-4 is-flex is-justify-content-flex-start ">
                  {title}
                  <br />
                </div>
                <div className="card-content is-size-6 pt-0">{description}</div>

                <div className="control level is-flex is-justify-content-end p-3">
                  <button
                    type="button"
                    className="button button-edit mr-2"
                    onClick={handleEdit}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>

                  <button
                    type="submit"
                    className="button button-delete"
                    onClick={() => {
                      handleDelete(todo.id);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      }}
    </Draggable>
  );
};
