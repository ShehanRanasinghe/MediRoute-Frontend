// Owner: Integration
import type { Metadata } from "next";
import ThemeRegistry from "./ThemeRegistry";
import AppShell from "../components/AppShell";

export const metadata: Metadata = {
  title: "MediRoute Dispatch Console",
  description: "Intelligent Decision Support System for Hospital & Emergency Healthcare Logistics",
};

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
