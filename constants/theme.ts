import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0d0d0d',
    background: '#f0fff5',
    tint: '#0f241b',
    icon: '#337051',
    tabIconDefault: '#337051',
    tabIconSelected: '#0f241b',
    headerBackground: '#f5f5f5',
    footerBackground: '#f5f5f5',
    btnBackground: '#171717',
    btnText: '#f5f5f5',
    heading: '#0f241b',
    secondaryText: '#0d0d0dcc',
    card: '#ffffff',
    border: '#0f241b1a',
  },
  dark: {
    text: '#f5f5f5',
    background: '#0f241b',
    tint: '#70ffc1',
    icon: '#70ffc1',
    tabIconDefault: '#cccccc',
    tabIconSelected: '#70ffc1',
    headerBackground: '#08140f',
    footerBackground: '#08140f',
    btnBackground: '#2d694d',
    btnText: '#f5f5f5',
    heading: '#70ffc1',
    secondaryText: '#f5f5f5cc',
    card: '#1a332a80',
    border: '#70ffc11a',
  },
};

export const Fonts = {
  heading: Platform.select({
    ios: 'Alegreya Sans',
    android: 'AlegreyaSans-Regular',
    default: 'system-ui',
  }),
  body: Platform.select({
    ios: 'Inter',
    android: 'Inter-Regular',
    default: 'system-ui',
  }),
};
