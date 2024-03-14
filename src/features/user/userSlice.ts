import { type PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface UserState {
  id: number | undefined;
}

const initialState: UserState = {
  id: undefined
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
    }
  }
});

export default userSlice.reducer;
export const { actions } = userSlice;
