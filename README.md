# Discord Colored Text Generator

This project is a solution to the **Assignment** provided by **VideoDubber**. The goal of the assignment was to replicate the functionality of the page [Discord Colored Text Generator](https://rebane2001.com/discord-colored-text-generator/) while focusing on functionality and maintaining basic aesthetics. The project was built using **React** and **Mantine UI**.

## Features

- Allows users to create Discord-formatted colored text using ANSI color codes.
- Provides options to style text with foreground and background colors, bold, and underline.
- Includes a copy button to copy the formatted text in Discord-compatible ANSI format.
- Ensures that only text within the editor can be selected and styled, addressing a flaw in the original website where text outside the editor could also be styled.

## Improvements Over the Original

The original website allowed text outside the text area to be selected and styled, which was identified as a flaw. This issue has been addressed in this implementation by ensuring that only text within the editor can be styled.

## Tools and Libraries Used

- **React**: For building the user interface.
- **Mantine UI**: For UI components such as buttons, headings, containers, and alerts.
- **Vite**: For fast development and build setup.
- **ESLint**: For maintaining code quality and consistency.