import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Title, 
  TextInput, 
  Button, 
  Group, 
  Text, 
  Paper, 
  ColorPicker, 
  useMantineColorScheme,
  CopyButton,
  Divider,
  Space,
  Box
} from '@mantine/core';
import ThemeToggle from './ThemeToggle';
import Instructions from './Instructions';

function ColoredTextGenerator() {
  const [text, setText] = useState('Hello Discord!');
  const [color, setColor] = useState('#ff0000');
  const [coloredText, setColoredText] = useState('');
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  // Convert hex color to ANSI escape code
  const getAnsiColorCode = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance (simple method)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const bright = luminance > 0.5;
    
    // Find the dominant color
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    
    let code;
    
    if (delta < 50 && max < 80) {
      code = '30'; // black
    } else if (delta < 50) {
      code = bright ? '97' : '37'; // white/gray
    } else if (max === r) {
      code = r > 2 * g && r > 2 * b ? '31' : '33'; // red or yellow
    } else if (max === g) {
      code = g > 2 * r && g > 2 * b ? '32' : '33'; // green or yellow
    } else if (max === b) {
      code = b > 2 * r && b > 2 * g ? '34' : '35'; // blue or magenta
    }
    
    // Adjust brightness
    if (bright && code !== '30' && code !== '37' && code !== '97') {
      code = (parseInt(code) + 60).toString();
    }
    
    return code || '37'; // default to white if something goes wrong
  };

  // Generate the Discord-compatible colored text
  useEffect(() => {
    const ansiCode = getAnsiColorCode(color);
    const generatedText = `\`\`\`ansi\n[0;${ansiCode}m${text}[0m\`\`\``;
    setColoredText(generatedText);
  }, [text, color]);

  return (
    <Container size="sm" py="xl">
      <Group position="apart" mb="md">
        <Title order={1}>Discord Colored Text Generator</Title>
        <ThemeToggle />
      </Group>
      
      <Text mb="md">
        Create colorful text for your Discord messages!
      </Text>

      <TextInput
        label="Your Text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        mb="md"
        size="md"
      />

      <Text size="sm" mb="xs">Choose a Color</Text>
      <ColorPicker 
        format="hex" 
        value={color} 
        onChange={setColor} 
        mb="md"
        size="lg"
        swatches={[
          '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', 
          '#0000FF', '#4B0082', '#9400D3', '#FFFFFF', 
          '#000000', '#808080'
        ]}
      />

      <Paper 
        p="md" 
        withBorder 
        mb="md" 
        bg={dark ? '#2f3136' : '#f2f3f5'}
        radius="md"
        shadow={dark ? "md" : "sm"}
      >
        <Title order={4} mb="sm">Preview</Title>
        <Paper 
          p="md" 
          bg={dark ? '#36393f' : '#ffffff'}
          radius="sm"
          sx={{
            fontFamily: '"Whitney", "Helvetica Neue", Helvetica, Arial, sans-serif'
          }}
        >
          <Text style={{ color }}>
            {text}
          </Text>
        </Paper>
      </Paper>

      <Paper p="md" withBorder mb="md" radius="md">
        <Title order={4} mb="sm">Generated Code</Title>
        <Box 
          component="pre" 
          sx={{ 
            overflowX: 'auto',
            backgroundColor: dark ? '#2C2E33' : '#F1F3F5',
            padding: '10px',
            borderRadius: '4px'
          }}
        >
          <code>{coloredText}</code>
        </Box>
      </Paper>

      <Group position="center" mb="xl">
        <CopyButton value={coloredText}>
          {({ copied, copy }) => (
            <Button 
              color={copied ? 'teal' : 'blue'} 
              onClick={copy}
              size="md"
            >
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </Button>
          )}
        </CopyButton>
      </Group>

      <Divider my="lg" />
      
      <Instructions />
      
      <Space h="xl" />
    </Container>
  );
}

export default ColoredTextGenerator;