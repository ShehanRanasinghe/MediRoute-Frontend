"use client";

import { useState } from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import OptimizationForm from "../../components/OptimizationForm";
import OptimizationResultView from "../../components/OptimizationResultView";
import { compareOptimizationAlgorithms, OptimizationResult } from "../../lib/optimizationApi";

export default function OptimizationPage() {
  const [dpResult, setDpResult] = useState<OptimizationResult | null>(null);
  const [greedyResult, setGreedyResult] = useState<OptimizationResult | null>(null);
  const [backtrackingResult, setBacktrackingResult] = useState<OptimizationResult | null | undefined>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(vehicleCapacity: number) {
    setLoading(true);
    setError(null);
    try {
      const results = await compareOptimizationAlgorithms(vehicleCapacity);
      setDpResult(results.dp);
      setGreedyResult(results.greedy);
      setBacktrackingResult(results.backtracking ?? null);
    } catch (err) {
      setError("Could not reach the optimization service. Is the Spring Boot backend running on port 8080?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h1" gutterBottom>
        Medical Supply & Ambulance Dispatch Scheduling
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Task 5 — compares Dynamic Programming, Greedy, and Backtracking for loading a vehicle.
      </Typography>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <OptimizationForm onSubmit={handleSubmit} loading={loading} />
      </Paper>

      {error && (
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <OptimizationResultView dp={dpResult} greedy={greedyResult} backtracking={backtrackingResult} />
    </Container>
  );
}
