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
  const userTodos: Todo[] = useAppSelector(
    (state: RootState) => state.todos.items
  );
  const sortedTodos = [...userTodos].sort((a, b) => a.index - b.index);
  const todosToRender = sortedTodos.filter((todo) => todo.status === name);

  return (
    <div className="section p-2">
      {todosToRender.length !== 0
        ? (
            todosToRender.map((todo) => (
          <div key={todo.id} className={'mb-5'}>
            <TodoCard todo={todo} key={todo.id} />
          </div>
            ))
          )
        : (
        <div className="content has-text-centered">
          No todos here yet. Drop some todo <strong>right here</strong>!
        </div>
          )}
    </div>
  );
};
