import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import type { AppProps } from 'next/app';

declare module '@mui/material/styles' {
  interface Theme {
    status?: {
      active?: {
        main: string;
        dark: string;
      };
    };
  }

  interface ThemeOptions {
    status?: {
      active?: {
        main: string;
        dark: string;
      };
    };
  }
}

let theme = createTheme({});

theme = createTheme({
  status: {
    active: theme.palette.augmentColor({
      color: {
        main: orange[500],
      },
      name: 'active',
    }),
  },
});

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default App;
