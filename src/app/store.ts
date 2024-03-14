import {
  type Action,
  type ThunkAction,
  configureStore
} from '@reduxjs/toolkit';

import todosReducer from '../features/todos/todosSlice.ts';
import userReducer from '../features/user/userSlice.ts';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    user: userReducer
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
ReturnType,
RootState,
unknown,
Action<string>
>;
