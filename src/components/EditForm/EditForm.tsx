import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCancel, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { type Todo } from '../../types/Todo.ts';

interface Props {
  todoToEdit?: Todo;
  onCancelEdit: () => void;
  onSaveTodo: (
    titleUpdated: string,
    descriptionUpdated: string,
    todoID: string
  ) => void;
}

export const EditForm: React.FC<Props> = ({
  todoToEdit,
  onSaveTodo,
  onCancelEdit
}) => {
  const { title, description } = todoToEdit ?? {};

  const [editedTitle, setEditedTitle] = useState<string>(title ?? '');
  const [editedDescription, setEditedDescription] = useState<string>(
    description ?? ''
  );

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current !== null) {
      titleField.current.focus();
    }
  }, []);

  const handleSave = (event: React.MouseEvent): void => {
    event.preventDefault();
    onSaveTodo(editedTitle, editedDescription, todoToEdit?.id ?? '');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSaveTodo(editedTitle, editedDescription, todoToEdit?.id ?? '');
  };

  const handleCancel = (event: React.MouseEvent): void => {
    event.preventDefault();
    onCancelEdit();
  };

  return (
    <form
      className="box has-border has-background-link-light is-flex is-flex-direction-column"
      onSubmit={handleSubmit}
    >
      <div className="control is-flex">
        <p className="mb-3 subtitle">
          {todoToEdit == null ? 'Creating your new Todo' : 'Editing Todo'}
        </p>
      </div>
      <input
        type="text"
        className="box input is-medium is-primary is-rounded"
        placeholder="Title can not be empty"
        value={editedTitle}
        onChange={(event) => {
          setEditedTitle(event.target.value);
        }}
        ref={titleField}
      />

      <textarea
        className="textarea is-info has-fixed-size"
        placeholder="Enter new description for this Todo (optional)"
        value={editedDescription}
        onChange={(event) => {
          setEditedDescription(event.target.value);
        }}
      />
      <div className="control level is-flex is-justify-content-end p-3">
        <button
          type="button"
          className="button button__save mr-2"
          onClick={handleSave}
          disabled={editedTitle?.trim().length === 0}
        >
          <FontAwesomeIcon icon={faFloppyDisk} />
        </button>
        <button
          type="button"
          className="button button__cancel"
          onClick={handleCancel}
        >
          <FontAwesomeIcon icon={faCancel} />
        </button>
      </div>
    </form>
  );
};
