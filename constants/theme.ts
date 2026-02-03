import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: 'hsl(0, 0%, 5%)',
    background: 'hsl(146, 100%, 97%)',
    tint: 'hsl(146, 41%, 10%)',
    icon: 'hsl(146, 37%, 32%)',
    tabIconDefault: 'hsl(146, 37%, 32%)',
    tabIconSelected: 'hsl(146, 41%, 10%)',
    headerBackground: 'hsl(0, 0%, 96%)',
    footerBackground: 'hsl(0, 0%, 96%)',
    btnBackground: 'hsl(0, 0%, 9%)',
    btnText: 'hsl(0, 0%, 96%)',
    heading: 'hsl(146, 41%, 10%)',
    secondaryText: 'hsla(0, 0%, 5%, 0.8)',
    card: 'hsl(0, 0%, 100%)',
    border: 'hsla(146, 41%, 10%, 0.1)',
  },
  dark: {
    text: 'hsl(0, 0%, 96%)',
    background: 'hsl(146, 41%, 10%)',
    tint: 'hsl(146, 100%, 72%)',
    icon: 'hsl(146, 100%, 72%)',
    tabIconDefault: 'hsl(0, 0%, 80%)',
    tabIconSelected: 'hsl(146, 100%, 72%)',
    headerBackground: 'hsl(144, 41%, 5%)',
    footerBackground: 'hsl(144, 41%, 5%)',
    btnBackground: 'hsl(146, 41%, 30%)',
    btnText: 'hsl(0, 0%, 96%)',
    heading: 'hsl(146, 100%, 72%)',
    secondaryText: 'hsla(0, 0%, 96%, 0.8)',
    card: 'hsla(146, 41%, 20%, 0.5)',
    border: 'hsla(146, 100%, 72%, 0.1)',
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
