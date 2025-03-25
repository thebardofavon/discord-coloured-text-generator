import React, { useState } from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import { ColorSchemeScript } from '@mantine/core';
import ColoredTextGenerator from './components/ColoredTextGenerator';

// Create a theme (optional, but recommended for consistency)
const theme = createTheme({
  // You can customize your theme here
  primaryColor: 'blue',
  // Other theme options
});

export default function App() {
  const [colorScheme, setColorScheme] = useState('dark');
  
  const toggleColorScheme = (value) => {
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <>
      <ColorSchemeScript />
      <MantineProvider 
        theme={theme}
        defaultColorScheme={colorScheme}
        forceColorScheme={colorScheme}
      >
        <ColoredTextGenerator />
      </MantineProvider>
    </>
  );
}