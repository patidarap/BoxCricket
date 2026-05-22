import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../store/store';
import {toggleTheme as toggleThemeAction, setThemeMode} from '../store/slices/themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const {theme, mode} = useSelector((state: RootState) => state.theme);
  
  const toggleTheme = () => {
    dispatch(toggleThemeAction());
  };
  
  const setTheme = (newMode: 'light' | 'dark') => {
    dispatch(setThemeMode(newMode));
  };
  
  return {theme, mode, toggleTheme, setTheme};
};
