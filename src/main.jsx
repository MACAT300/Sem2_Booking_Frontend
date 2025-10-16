import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const theme = createTheme({
  palette: {
    primary: { main: '#e53935' }, // 红色按钮
    secondary: { main: '#757575' }, // 灰色按钮
    error: { main: '#d32f2f' },
    background: { default: '#ffffff', paper: '#ffffff' }, // 白色背景
    text: { primary: '#000000', secondary: '#000000' }, // 黑色文字
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: '#ffffff',
          '&:hover': { backgroundColor: '#d32f2f' },
        },
        containedSecondary: {
          color: '#ffffff',
          '&:hover': { backgroundColor: '#616161' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          border: '2px solid #d4af37', // 金色框
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          border: '2px solid #d4af37',
          borderRadius: 12,
        },
      },
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
