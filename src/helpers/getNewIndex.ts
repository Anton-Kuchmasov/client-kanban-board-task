import { type Todo } from '../types/Todo.ts';

export const getIndex = (todos: Todo[]): number => {
  if (todos.length === 0) {
    return 1;
  }

  return Math.max(...todos.map((todo) => todo.index)) + 1;
};
