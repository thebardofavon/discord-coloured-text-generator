import React, { useState } from 'react';
import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
import ColoredTextGenerator from './components/ColoredTextGenerator';

export default function App() {
  const [colorScheme, setColorScheme] = useState('dark');
  
  const toggleColorScheme = (value) => {
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <ColoredTextGenerator />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}