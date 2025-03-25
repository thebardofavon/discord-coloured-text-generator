import React from 'react';
import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');
  const dark = computedColorScheme === 'dark';

  return (
    <ActionIcon
      variant="outline"
      color={dark ? 'yellow' : 'blue'}
      onClick={() => setColorScheme(dark ? 'light' : 'dark')}
      title="Toggle color scheme"
      size="lg"
    >
      {dark ? <IconSun /> : <IconMoonStars />}
    </ActionIcon>
  );
}

export default ThemeToggle;