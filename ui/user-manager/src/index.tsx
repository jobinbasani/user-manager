import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './index.scss';
import { Provider } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material';
import reportWebVitals from './reportWebVitals';
import store from './store/index';
import App from './App';

const theme = createTheme({
  palette: {
    primary: {
      light: '#ff5f52',
      main: '#c62828',
      dark: '#6e080f',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#64c1ff',
      main: '#0091ea',
      dark: '#64c1ff',
      contrastText: '#f9fbe7',
    },
  },
  typography: {
    fontFamily: [
      'EB Garamond',
      'serif',
    ].join(','),
  },
});

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
