import React, { useState, useRef, useEffect } from 'react';
import { Text, Container, Title, Button, Group, Box, Paper, Anchor, Alert } from '@mantine/core';

const DiscordColoredTextGenerator = () => {
  const textareaRef = useRef(null);
  const [copyMessage, setCopyMessage] = useState("Copy text as Discord formatted");
  const [copyStyle, setCopyStyle] = useState({});
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [copyCount, setCopyCount] = useState(0);
  const [selectionAlert, setSelectionAlert] = useState(false);
  const copyTimeoutRef = useRef(null);

  const tooltipTexts = {
    // FG
    "30": "Dark Gray (33%)",
    "31": "Red",
    "32": "Yellowish Green",
    "33": "Gold",
    "34": "Light Blue",
    "35": "Pink",
    "36": "Teal",
    "37": "White",
    // BG
    "40": "Blueish Black",
    "41": "Rust Brown",
    "42": "Gray (40%)",
    "43": "Gray (45%)",
    "44": "Light Gray (55%)",
    "45": "Blurple",
    "46": "Light Gray (60%)",
    "47": "Cream White",
  };

  const colorMap = {
    // FG colors
    "30": "#4f545c",
    "31": "#dc322f",
    "32": "#859900",
    "33": "#b58900",
    "34": "#268bd2",
    "35": "#d33682",
    "36": "#2aa198",
    "37": "#ffffff",
    // BG colors
    "40": "#002b36",
    "41": "#cb4b16",
    "42": "#586e75",
    "43": "#657b83",
    "44": "#839496",
    "45": "#6c71c4",
    "46": "#93a1a1",
    "47": "#fdf6e3",
  };

  // Handle sanitization of pasted content
  const handleInput = () => {
    if (!textareaRef.current) return;
    
    const base = textareaRef.current.innerHTML.replace(/<(\/?(br|span|span class="ansi-[0-9]*"))>/g,"[$1]");
    if (base.includes("<") || base.includes(">")) {
      textareaRef.current.innerHTML = base.replace(/<.*?>/g,"").replace(/[<>]/g,"").replace(/\[(\/?(br|span|span class="ansi-[0-9]*"))\]/g,"<$1>");
    }
  };

  // Handle style button clicks
  const handleStyleClick = (ansi) => {
    if (!textareaRef.current) return;
    
    if (ansi === "0") {
      // Reset all formatting
      textareaRef.current.innerText = textareaRef.current.innerText;
      return;
    }

    const selection = window.getSelection();
    const text = selection.toString();
    
    if (!text) {
      // Alert the user to select text first
      setSelectionAlert(true);
      setTimeout(() => setSelectionAlert(false), 3000);
      return;
    }

    try {
      const span = document.createElement("span");
      span.innerText = text;
      span.className = `ansi-${ansi}`;

      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(span);

      // Keep selection on the text
      range.selectNodeContents(span);
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (err) {
      console.error("Error applying style:", err);
    }
  };

  // Convert styled HTML to ANSI codes
  const nodesToANSI = (nodes, states) => {
    let text = ""
    for (const node of nodes) {
      if (node.nodeType === 3) {
        text += node.textContent;
        continue;
      }
      if (node.nodeName === "BR") {
        text += "\n";
        continue;   
      }
      const ansiCode = +(node.className.split("-")[1]);
      const newState = Object.assign({}, states.at(-1));

      if (ansiCode < 30) newState.st = ansiCode;
      if (ansiCode >= 30 && ansiCode < 40) newState.fg = ansiCode;
      if (ansiCode >= 40) newState.bg = ansiCode;

      states.push(newState)
      text += `\x1b[${newState.st};${(ansiCode >= 40) ? newState.bg : newState.fg}m`;
      text += nodesToANSI(node.childNodes, states);
      states.pop()
      text += `\x1b[0m`;
      if (states.at(-1).fg !== 2) text += `\x1b[${states.at(-1).st};${states.at(-1).fg}m`;
      if (states.at(-1).bg !== 2) text += `\x1b[${states.at(-1).st};${states.at(-1).bg}m`;
    }
    return text;
  };

  // Handle copy button click
  const handleCopy = () => {
    if (!textareaRef.current) return;
    
    const toCopy = "```ansi\n" + nodesToANSI(textareaRef.current.childNodes, [{ fg: 2, bg: 2, st: 2 }]) + "\n```";
    
    navigator.clipboard.writeText(toCopy).then(() => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);

      const funnyCopyMessages = ["Copied!", "Double Copy!", "Triple Copy!", "Dominating!!", "Rampage!!", "Mega Copy!!", "Unstoppable!!", "Wicked Sick!!", "Monster Copy!!!", "GODLIKE!!!", "BEYOND GODLIKE!!!!", Array(16).fill(0).reduce(p => p + String.fromCharCode(Math.floor(Math.random() * 65535)),"")];

      const newCopyCount = Math.min(11, copyCount + 1);
      setCopyCount(newCopyCount);
      setCopyStyle({ backgroundColor: (newCopyCount <= 8) ? "#3BA55D" : "#ED4245" });
      setCopyMessage(funnyCopyMessages[copyCount]);
      
      copyTimeoutRef.current = setTimeout(() => {
        setCopyCount(0);
        setCopyStyle({});
        setCopyMessage("Copy text as Discord formatted");
      }, 2000);
    }).catch((err) => {
      console.error("Copy failed:", err);
      alert("Copying failed. You can try selecting and copying the text manually.");
    });
  };

  // Handle tooltip display
  const handleTooltipShow = (ansi, event) => {
    if (!(ansi > 4)) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipContent(tooltipTexts[ansi]);
    setTooltipPosition({ 
      top: rect.top - 36, 
      left: rect.left + rect.width / 2
    });
    setTooltipVisible(true);
  };

  // Handle Enter key for line breaks
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        document.execCommand('insertLineBreak');
        event.preventDefault();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Clean up copyTimeout on unmount
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  // Add CSS classes directly to document for ANSI styling with !important
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      .ansi-1 { font-weight: 700 !important; text-decoration: none !important; }
      .ansi-4 { font-weight: 500 !important; text-decoration: underline !important; }
      
      .ansi-30 { color: #4f545c !important; }
      .ansi-31 { color: #dc322f !important; }
      .ansi-32 { color: #859900 !important; }
      .ansi-33 { color: #b58900 !important; }
      .ansi-34 { color: #268bd2 !important; }
      .ansi-35 { color: #d33682 !important; }
      .ansi-36 { color: #2aa198 !important; }
      .ansi-37 { color: #ffffff !important; }
      
      .ansi-40 { background-color: #002b36 !important; }
      .ansi-41 { background-color: #cb4b16 !important; }
      .ansi-42 { background-color: #586e75 !important; }
      .ansi-43 { background-color: #657b83 !important; }
      .ansi-44 { background-color: #839496 !important; }
      .ansi-45 { background-color: #6c71c4 !important; }
      .ansi-46 { background-color: #93a1a1 !important; }
      .ansi-47 { background-color: #fdf6e3 !important; }

      /* Custom color button styles to ensure they show correctly */
      .color-button-30 { background-color: #4f545c !important; }
      .color-button-31 { background-color: #dc322f !important; }
      .color-button-32 { background-color: #859900 !important; }
      .color-button-33 { background-color: #b58900 !important; }
      .color-button-34 { background-color: #268bd2 !important; }
      .color-button-35 { background-color: #d33682 !important; }
      .color-button-36 { background-color: #2aa198 !important; }
      .color-button-37 { background-color: #ffffff !important; }
      
      .color-button-40 { background-color: #002b36 !important; }
      .color-button-41 { background-color: #cb4b16 !important; }
      .color-button-42 { background-color: #586e75 !important; }
      .color-button-43 { background-color: #657b83 !important; }
      .color-button-44 { background-color: #839496 !important; }
      .color-button-45 { background-color: #6c71c4 !important; }
      .color-button-46 { background-color: #93a1a1 !important; }
      .color-button-47 { background-color: #fdf6e3 !important; }
    `;
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#36393F',
      textAlign: 'center', 
      color: '#FFF', 
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '20px'
    }}>
      <Title order={1}>
        Rebane's Discord <span style={{ color: '#5865F2', fontWeight: 'inherit' }}>Colored</span> Text Generator
      </Title>
      
      <Container size="sm" sx={{ maxWidth: '500px', margin: 'auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Title order={3} mt="md">About</Title>
        <Text>This is a simple app that creates colored Discord messages using the ANSI color codes available on the latest Discord desktop versions.</Text>
        <Text mt="xs">To use this, write your text, select parts of it and assign colors to them, then copy it using the button below, and send in a Discord message.</Text>
        
        <Title order={3} mt="md">Source Code</Title>
        <Text>
          This app runs entirely in your browser and the source code is freely available on{' '}
          <Anchor href="https://gist.github.com/rebane2001/07f2d8e80df053c70a1576d27eabe97c" sx={{ color: '#00AFF4' }}>GitHub</Anchor>. 
          Shout out to kkrypt0nn for{' '}
          <Anchor href="https://gist.github.com/kkrypt0nn/a02506f3712ff2d1c8ca7c9e0aed7c06" sx={{ color: '#00AFF4' }}>this guide</Anchor>.
        </Text>
      </Container>
      
      <Container size="sm" sx={{ maxWidth: '500px', margin: 'auto' }}>
        <Title order={2} mt="lg">Create your text</Title>
        
        {selectionAlert && (
          <Alert color="yellow" sx={{ marginTop: '10px' }}>
            Please select some text first before applying a style.
          </Alert>
        )}
        
        <Text color="gray" size="sm" mt="sm">First select text in the editor, then click a style button below to apply it.</Text>
        
        <Group position="center" spacing="xs" mt="sm">
          <Button 
            variant="filled" 
            color="gray" 
            onClick={() => handleStyleClick("0")}
          >
            Reset All
          </Button>
          <Button 
            variant="filled"
            color="gray" 
            sx={{ fontWeight: 700 }}
            onClick={() => handleStyleClick("1")}
          >
            Bold
          </Button>
          <Button 
            variant="filled"
            color="gray" 
            sx={{ textDecoration: 'underline' }}
            onClick={() => handleStyleClick("4")}
          >
            Line
          </Button>
        </Group>
        
        <Group position="center" mt="md">
          <Text weight={700}>FG</Text>
          {[30, 31, 32, 33, 34, 35, 36, 37].map(code => (
            <Button 
              key={code}
              variant="filled"
              className={`color-button-${code}`}
              sx={{
                minWidth: '32px',
                minHeight: '32px',
                padding: 0,
                '&:hover': {
                  filter: 'brightness(1.2)'
                }
              }}
              onClick={() => handleStyleClick(code.toString())}
              onMouseEnter={(e) => handleTooltipShow(code, e)}
              onMouseLeave={() => setTooltipVisible(false)}
            >
              &nbsp;
            </Button>
          ))}
        </Group>
        
        <Group position="center" mt="md">
          <Text weight={700}>BG</Text>
          {[40, 41, 42, 43, 44, 45, 46, 47].map(code => (
            <Button 
              key={code}
              variant="filled"
              className={`color-button-${code}`}
              sx={{
                minWidth: '32px',
                minHeight: '32px',
                padding: 0,
                '&:hover': {
                  filter: 'brightness(1.2)'
                }
              }}
              onClick={() => handleStyleClick(code.toString())}
              onMouseEnter={(e) => handleTooltipShow(code, e)}
              onMouseLeave={() => setTooltipVisible(false)}
            >
              &nbsp;
            </Button>
          ))}
        </Group>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', width: '100%' }}>
          <div
            ref={textareaRef}
            style={{
              width: '100%', 
              maxWidth: '600px',
              margin: '0 auto',
              height: '200px',
              backgroundColor: '#2F3136',
              color: '#B9BBBE',
              borderRadius: '5px',
              border: '1px solid #202225',
              padding: '10px',
              textAlign: 'left',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              fontSize: '0.875rem',
              lineHeight: '1.125rem',
              overflow: 'auto',
              resize: 'both',
              display: 'block',
              outline: 'none'
            }}
            contentEditable="true"
            onInput={handleInput}
            dangerouslySetInnerHTML={{
              __html: 'Welcome to&nbsp;<span class="ansi-33">Rebane</span>\'s <span class="ansi-45"><span class="ansi-37">Discord</span></span>&nbsp;<span class="ansi-31">C</span><span class="ansi-32">o</span><span class="ansi-33">l</span><span class="ansi-34">o</span><span class="ansi-35">r</span><span class="ansi-36">e</span><span class="ansi-37">d</span>&nbsp;Text Generator!'
            }}
          />
        </Box>
        
        <Button 
          variant="filled"
          color="gray"
          mt="md"
          sx={{...copyStyle, display: 'block', margin: '20px auto'}}
          onClick={handleCopy}
        >
          {copyMessage}
        </Button>
        
        <Text size="xs" mt="md">
          This is an unofficial tool, it is not made or endorsed by Discord.
        </Text>
        
        {tooltipVisible && (
          <div
            style={{
              position: 'absolute',
              backgroundColor: '#3BA55D',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '3px',
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              transform: 'translateX(-50%)',
              zIndex: 1000,
              pointerEvents: 'none'
            }}
          >
            {tooltipContent}
          </div>
        )}
      </Container>
    </Box>
  );
};

export default DiscordColoredTextGenerator;