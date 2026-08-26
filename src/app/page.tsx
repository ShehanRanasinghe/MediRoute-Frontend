import { redirect } from "next/navigation";

// Root page immediately sends the user to the dashboard as the app landing screen.
export default function RootPage() {
  redirect("/dashboard");
}
