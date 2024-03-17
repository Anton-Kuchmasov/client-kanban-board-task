import { type Todo } from '../types/Todo.ts';

export const getIndex = (todos: Todo[]): number => {
  if (!todos.length) {
    return 1;
  }

  return Math.max(...todos.map((todo) => todo.index)) + 1;
};
