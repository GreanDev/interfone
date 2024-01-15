import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, createTheme } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root'));
const theme = createTheme({
  palette: {
    mode: 'dark',
    text: {
      main: "#dbedfc",
    },
    background: {
      main: "#01080d",
    },
    primary: {
      main: "#72c2f4",
      contrastText: "#01080d",
    },
    secondary: {
      main: "#270c92",
      contrastText: "#dbedfc",
    },
    accent: {
      main: "#9b42f0",
      contrastText: "#01080d",
    },
  }
});

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
