import { defineConfig } from "wxt";
import react from "@vitejs/plugin-react";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ["activeTab", "sidePanel", "storage", "tabs"],
    action: {
      default_title: "WorthIt Sidepanel",
    },
    version: "1.0.0",
    name: "WorthIt",
    description: "Is it worth it?",
  },
  vite: () => ({
    plugins: [react()],
  }),
});
