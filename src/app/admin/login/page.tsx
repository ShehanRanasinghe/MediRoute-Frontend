"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { signIn } from "../../../lib/adminAuth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      router.push("/admin/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="xs">
      <Paper variant="outlined" sx={{ p: 4, mt: 10 }}>
        <Typography variant="h5" gutterBottom>Admin Login</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Authenticated via Supabase Auth
          {/* Restricted to system administrators. Authenticated via Supabase Auth, not the application server. */}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button variant="contained" onClick={handleSubmit} disabled={loading} fullWidth>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
