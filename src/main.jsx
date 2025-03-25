import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider, createTheme } from '@mantine/core'
import '@mantine/core/styles.css'
import './index.css'
import App from './App.jsx'

const theme = createTheme({
  colorScheme: 'dark',
  primaryColor: 'indigo',
  colors: {
    dark: [
      '#ffffff', // 0
      '#A6A7AB', // 1
      '#909296', // 2
      '#5c5f66', // 3
      '#373A40', // 4
      '#2F3136', // 5 
      '#25262b', // 6
      '#1A1B1E', // 7
      '#141517', // 8
      '#101113', // 9
    ],
  },
  // Ensure all components use the dark theme by default
  components: {
    Button: {
      defaultProps: {
        color: 'gray',
      },
    },
    Paper: {
      defaultProps: {
        bg: 'dark.6',
      },
    },
  },
  other: {
    discordPrimary: '#5865F2',
    discordBg: '#36393F',
    discordSecondaryBg: '#2F3136',
    discordTertiaryBg: '#202225',
  },
});

// Global styles to enforce dark theme
const globalStyles = `
  body {
    background-color: ${theme.other.discordBg};
    color: #FFFFFF;
    margin: 0;
    padding: 0;
  }
  
  .mantine-Paper-root {
    background-color: ${theme.other.discordSecondaryBg};
  }
  
  .mantine-Input-input, .mantine-InputWrapper-input {
    background-color: ${theme.other.discordTertiaryBg};
    color: #FFFFFF;
  }

  /* Force dark scrollbars in webkit browsers */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${theme.other.discordTertiaryBg};
  }
  
  ::-webkit-scrollbar-thumb {
    background: #4f545c;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #6f737a;
  }
`;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <style>{globalStyles}</style>
      <App />
    </MantineProvider>
  </StrictMode>,
)