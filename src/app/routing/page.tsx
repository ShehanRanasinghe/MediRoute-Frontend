"use client";

import { useState } from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import RouteForm from "@/components/RouteForm";
import RouteResultView from "@/components/RouteResultView";
import { compareAlgorithms, RouteResult } from "@/lib/api";

export default function RoutingPage() {
  const [dijkstraResult, setDijkstraResult] = useState<RouteResult | null>(null);
  const [astarResult, setAstarResult] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(sourceId: number, destinationId: number) {
    setLoading(true);
    setError(null);
    try {
      // Fixed: Using compareAlgorithms directly from @/lib/api
      const results = await compareAlgorithms({ sourceId, destinationId });
      setDijkstraResult(results.dijkstra);
      setAstarResult(results.astar);
    } catch (err) {
      setError("Could not reach the routing service. Is the Spring Boot backend running on port 8080?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold" }} gutterBottom color="primary">
        Ambulance & Patient Transport Routing
      </Typography>
      
      <Typography variant="subtitle1" sx={{ mb: 4 }} color="text.secondary">
        Task 1 - compares Dijkstra's algorithm and A* search on the same route.
      </Typography>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <RouteForm onSubmit={handleSubmit} loading={loading} />
      </Paper>

      {error && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {(dijkstraResult || astarResult) && (
        <RouteResultView dijkstra={dijkstraResult} astar={astarResult} />
      )}
    </Container>
  );
}