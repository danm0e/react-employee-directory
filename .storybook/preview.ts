/// <reference types="vite/client" />
import type { Preview } from "@storybook/react";
import "../src/index.css";

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const isDark = context.globals.backgrounds?.value === "#333333";
      document.documentElement.classList.toggle("dark", isDark);
      return Story();
    },
  ],
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#333333" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
