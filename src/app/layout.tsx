
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MediRoute",
  description: "Intelligent Decision Support System for Hospital & Emergency Healthcare Logistics",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
