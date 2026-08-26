import type { Metadata } from "next";
import ThemeRegistry from "./ThemeRegistry";
import AppShell from "../components/AppShell";

// Defines the global page layout and wraps all routes in the app shell and theme.
export const metadata: Metadata = {
  title: "MediRoute Dispatch Console",
  description: "Intelligent Decision Support System for Hospital & Emergency Healthcare Logistics",
};

// Every page enters through this layout so the theme and navigation stay consistent across the app.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <AppShell>{children}</AppShell>
        </ThemeRegistry>
      </body>
    </html>
  );
}
