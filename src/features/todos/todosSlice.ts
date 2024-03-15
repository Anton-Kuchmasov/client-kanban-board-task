import {
  type PayloadAction,
  createSlice,
  createAsyncThunk,
  createAction
} from '@reduxjs/toolkit';
import axios from 'axios';

import { getIndex } from '../../helpers/getNewIndex.ts';
import { Error } from '../../types/Error.ts';

import { TodoStatus } from '../../types/TodoStatus.ts';
import { type RootState } from '../../app/store.ts';
import { type Todo } from '../../types/Todo.ts';

axios.defaults.baseURL = 'https://api-kanban-board-task.onrender.com';

export interface TodosState {
  isLoading: boolean;
  isCreating: boolean;
  items: Todo[];
  hasError: Error | false;
}

const initialState: TodosState = {
  isLoading: false,
  isCreating: false,
  items: [],
  hasError: false
};

interface NewTodoData {
  title: string;
  description: string;
  userID: number;
  todos: Todo[];
}

interface UpdateTodoContentData {
  id: string;
  title: string;
  description: string;
}

interface UpdateTodoStatusOnDropData {
  id: string;
  status: TodoStatus;
}

export const fetchAllUserIDs = createAsyncThunk(
  'todos/fetchAllTodos',
  async () => {
    const response = await axios.get<Todo[]>('/todos');
    const userIDs = response.data.map((todo) => todo.userID);
    return userIDs;
  }
);

export const setInitialTodos = createAction<Todo[]>('todos/setInitialTodos');

export const fetchTodosFromUserID = createAsyncThunk<Todo[], number>(
  'todos/fetchTodosFromUserID',
  async (userID, { dispatch }) => {
    const response = await axios.get<Todo[]>(`/todos/${userID}`);
    const todosFromUser = response.data;
    await new Promise((resolve) => setTimeout(resolve, 500));

    dispatch(setInitialTodos(todosFromUser));
    return todosFromUser;
  }
);

export const updateAllTodosIndexes = createAsyncThunk(
  'todos/updateAllTodosIndexes',
  async (_, thunkAPI) => {
    const todos = (thunkAPI.getState() as RootState).todos.items;
    const response = await axios.patch('/todos/update', { todos });

    return response.data;
  }
);

export const addNewTodo = createAsyncThunk<Todo[], NewTodoData>(
  'todos/addNewTodo',
  async ({ title, description, userID, todos }) => {
    const response = await axios.post('/todos', {
      title,
      description,
      userID,
      status: TodoStatus.TODO,
      index: getIndex(todos)
    });
    return response.data;
  }
);

export const deleteTodoById = createAsyncThunk<string, string>(
  'todos/deleteTodoById',
  async (id) => {
    await axios.delete(`/todos/${id}`);
    return id;
  }
);

export const updateTodoOnServer = createAsyncThunk<Todo, UpdateTodoContentData>(
  'todos/updateTodoContent',
  async ({ title, description, id }) => {
    const response = await axios.patch<Todo>(`/todos/${id}`, {
      title,
      description
    });

    return response.data;
  }
);

export const updateTodoStatusOnDrop = createAsyncThunk<
Todo,
UpdateTodoStatusOnDropData
>('todos/updateTodoStatusOnDrop', async ({ id, status }) => {
  const response = await axios.patch<Todo>(`/todos/${id}/${status}`, {
    status
  });
  return response.data;
});

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.items = action.payload;
    },
    updateLocalTodoStatus (
      state,
      action: PayloadAction<UpdateTodoStatusOnDropData>
    ) {
      const { id, status } = action.payload;
      return {
        ...state,
        items: state.items.map((todo) =>
          todo.id === id ? { ...todo, status } : todo
        )
      };
    },
    updateLocalTodoIndexes (state) {
      state.items.forEach((todo, index) => {
        const existingTodo = state.items.find((t) => t.id === todo.id);
        if (existingTodo != null) {
          existingTodo.index = index + 1;
        }
      });
    },
    setIsCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },
    setError: (state, action: PayloadAction<Error | false>) => {
      state.hasError = action.payload;
    },
    localDelete: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((todo) => todo.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodosFromUserID.pending, (state) => {
      state.isLoading = true;
      state.hasError = false;
    });
    builder.addCase(fetchTodosFromUserID.fulfilled, (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
      state.hasError = false;
    });
    builder.addCase(fetchTodosFromUserID.rejected, (state) => {
      state.items = [];
      state.isLoading = false;
      state.hasError = Error.LOAD_TODOS;
    });

    builder.addCase(updateAllTodosIndexes.pending, (state) => {
      state.hasError = false;
    });
    builder.addCase(updateAllTodosIndexes.fulfilled, (state, action) => {
      state.items = action.payload.updatedTodos;
      state.isLoading = false;
      state.hasError = false;
    });
    builder.addCase(updateAllTodosIndexes.rejected, (state) => {
      state.isLoading = false;
      state.hasError = Error.UPDATE_STATUS;
    });
    builder.addCase(addNewTodo.pending, (state) => {
      state.hasError = false;
    });
    builder.addCase(addNewTodo.fulfilled, (state) => {
      state.isLoading = false;
      state.hasError = false;
    });
    builder.addCase(addNewTodo.rejected, (state) => {
      state.isLoading = false;
      state.hasError = Error.ADD_TODO;
    });
    builder.addCase(deleteTodoById.pending, (state) => {
      state.hasError = false;
    });
    builder.addCase(deleteTodoById.fulfilled, (state, action) => {
      state.items = state.items.filter((todo) => todo.id !== action.payload);
      state.hasError = false;
    });
    builder.addCase(deleteTodoById.rejected, (state) => {
      state.isLoading = false;
      state.hasError = Error.DELETE_TODO;
    });
    builder.addCase(updateTodoOnServer.pending, (state) => {
      state.hasError = false;
    });
    builder.addCase(updateTodoOnServer.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (todo) => todo.id === action.payload.id
      );
      state.items[index] = action.payload;
      state.hasError = false;
    });
    builder.addCase(updateTodoOnServer.rejected, (state) => {
      state.hasError = Error.UPDATE_TODO;
    });
    builder.addCase(updateTodoStatusOnDrop.pending, (state) => {
      state.hasError = false;
    });
    builder.addCase(updateTodoStatusOnDrop.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (todo) => todo.id === action.payload.id
      );
      state.items[index] = action.payload;
      state.isLoading = false;
      state.hasError = false;
    });
    builder.addCase(updateTodoStatusOnDrop.rejected, (state) => {
      state.isLoading = false;
      state.hasError = Error.UPDATE_STATUS;
    });
  }
});

export default todosSlice.reducer;
export const { actions } = todosSlice;
