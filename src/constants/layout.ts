import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  containerPadding: 16,
  headerHeight: 56,
  tabBarHeight: 60,
};
