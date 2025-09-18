import { defineConfig } from "wxt";
import react from "@vitejs/plugin-react";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ["activeTab", "sidePanel", "storage"],
    action: {},
    name: "YeetIt",
    description: "YeetIt",
  },
  vite: () => ({
    plugins: [react()],
  }),
});
