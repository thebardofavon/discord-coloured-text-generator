import React, { useState } from 'react';
import { MantineProvider } from '@mantine/core';
import ColoredTextGenerator from './components/ColoredTextGenerator';

export default function App() {
  const [colorScheme, setColorScheme] = useState('dark');
  
  const toggleColorScheme = (value) => {
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <MantineProvider 
      theme={{ colorScheme }} 
      withGlobalStyles 
      withNormalizeCSS
    >
      <ColoredTextGenerator />
    </MantineProvider>
  );
}