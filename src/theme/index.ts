import {lightColors, darkColors, ColorScheme} from '../constants/colors';
import {spacing, borderRadius, iconSizes} from '../constants/spacing';
import {typography} from '../constants/typography';

export interface Theme {
  colors: ColorScheme;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  iconSizes: typeof iconSizes;
  typography: typeof typography;
  isDark: boolean;
}

export const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  borderRadius,
  iconSizes,
  typography,
  isDark: false,
};

export const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  borderRadius,
  iconSizes,
  typography,
  isDark: true,
};
