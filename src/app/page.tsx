// Owner: Integration
// Root route redirects straight into the dashboard - no login step.
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/dashboard");
}
