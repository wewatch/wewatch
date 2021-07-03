import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Progress {
  played: number;
  loaded: number;
  playedSeconds: number;
  duration: number;
}

const initialState: Progress = {
  played: 0,
  loaded: 0,
  playedSeconds: 0,
  duration: 0,
};

const slice = createSlice({
  name: "progress",
  initialState,

  reducers: {
    setProgress(state, action: PayloadAction<Partial<Progress>>) {
      return {
        ...state,
        ...action.payload,
      };
    },
    setDuration(state, action: PayloadAction<number>) {
      state.duration = action.payload;
    },
    resetProgress() {
      return initialState;
    },
  },
});

export const { setProgress, setDuration, resetProgress } = slice.actions;
export default slice.reducer;
