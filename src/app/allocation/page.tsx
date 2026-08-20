"use client";



import { useState } from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import AllocationForm from "../../components/AllocationForm";
import AllocationResultView from "../../components/AllocationResultView";
import { compareAllocationAlgorithms, AllocationResult } from "../../lib/allocationApi";

export default function AllocationPage() {
  const [greedyResult, setGreedyResult] = useState<AllocationResult | null>(null);
  const [knapsackResult, setKnapsackResult] = useState<AllocationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(resourceType: string) {
    setLoading(true);
    setError(null);
    try {
      const results = await compareAllocationAlgorithms(resourceType);
      setGreedyResult(results.greedy);
      setKnapsackResult(results.knapsack);
    } catch (err) {
      setError("Could not reach the allocation service. Is the Spring Boot backend running on port 8080?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h1" gutterBottom>
        Hospital Resource & Ambulance Allocation
      </Typography>
      <Typography variant="subtitle1" mb={4}>
        Task 2 — compares Greedy allocation and 0/1 Knapsack DP on the same pending requests.
      </Typography>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <AllocationForm onSubmit={handleSubmit} loading={loading} />
      </Paper>

      {error && (
        <Box mt={3}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <AllocationResultView greedy={greedyResult} knapsack={knapsackResult} />
    </Container>
  );
}
