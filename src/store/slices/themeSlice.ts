import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {lightTheme, darkTheme, Theme} from '../../theme';
import {ThemeMode} from '../../types';

interface ThemeState {
  mode: ThemeMode;
  theme: Theme;
}

const initialState: ThemeState = {
  mode: 'light',
  theme: lightTheme,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      state.theme = state.mode === 'light' ? lightTheme : darkTheme;
    },
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      state.theme = action.payload === 'light' ? lightTheme : darkTheme;
    },
  },
});

export const {toggleTheme, setThemeMode} = themeSlice.actions;
export default themeSlice.reducer;
