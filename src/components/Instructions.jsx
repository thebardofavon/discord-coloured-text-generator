import React from 'react';
import { Paper, Title, Text, List, Code } from '@mantine/core';

function Instructions() {
  return (
    <Paper p="md" mt="xl" withBorder radius="md">
      <Title order={3} mb="sm">How to use in Discord</Title>
      <List spacing="xs">
        <List.Item>Generate your colored text above</List.Item>
        <List.Item>Copy the generated code</List.Item>
        <List.Item>Paste the code in Discord</List.Item>
      </List>
      <Text mt="md">
        Discord supports colored text using this syntax: <Code>```ansi\n[0;31mRed text[0m```</Code>
      </Text>
    </Paper>
  );
}

export default Instructions;