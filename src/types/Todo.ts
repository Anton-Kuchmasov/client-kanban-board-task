import { type TodoStatus } from './TodoStatus.ts';

export interface Todo {
  id: string;
  index: number;
  title: string;
  description: string;
  status: TodoStatus;
  userID: number;
}
