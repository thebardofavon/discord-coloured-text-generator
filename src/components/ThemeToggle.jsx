import React from 'react';
import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <ActionIcon
      variant="outline"
      color={dark ? 'yellow' : 'blue'}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
      size="lg"
    >
      {dark ? <IconSun /> : <IconMoonStars />}
    </ActionIcon>
  );
}

export default ThemeToggle;