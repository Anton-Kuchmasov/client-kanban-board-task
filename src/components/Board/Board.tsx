import React from 'react';

import { TodoCard } from '../TodoCard/TodoCard.tsx';
import { type TodoStatus } from '../../types/TodoStatus.ts';
import { type Todo } from '../../types/Todo.ts';

import { useAppSelector } from '../../app/hooks.ts';
import { type RootState } from '../../app/store.ts';

interface Props {
  name: TodoStatus;
}

export const Board: React.FC<Props> = ({ name }) => {
  const todosFromState: Todo[] = useAppSelector(
    (state: RootState) => state.todos.items
  );
  const filteredTodos = todosFromState.filter((todo) => todo.status === name);

  return (
    <div className="section p-2">
      {filteredTodos.length !== 0 ? (
        filteredTodos.map((todo) => (
          <div key={todo.id} className={'mb-5'}>
            <TodoCard todo={todo} key={todo.id} />
          </div>
        ))
      ) : (
        <div className="content has-text-centered">
          No todos here yet. Drop some todo <strong>right here</strong>!
        </div>
      )}
    </div>
  );
};
