import type { Config } from "tailwindcss";

export default {
  content: ["./client/index.html", "./client/src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-app": "#F7F8FA",
        "bg-sidebar": "#EFF1F3",
        primary: "#65D6A8",
        "primary-muted": "#BFF3DD",
        card: "#FFFFFF",
        "text-primary": "#0F1720",
        "text-secondary": "#667085",
        border: "#E5E7EB",
      },
      boxShadow: {
        card: "0 6px 18px rgba(16, 24, 40, 0.08)",
      },
      borderRadius: {
        xl: "16px",
      },
    },
  },
  plugins: [],
} satisfies Config;
