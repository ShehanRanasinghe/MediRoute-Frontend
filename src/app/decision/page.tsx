"use client";

// Owner: Manura
// Route: /decision

import { useState } from "react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import RecommendationForm from "../../components/RecommendationForm";
import RecommendationResultView from "../../components/RecommendationResultView";
import { compareRecommendationAlgorithms, RecommendationResult } from "../../lib/decisionApi";

export default function DecisionPage() {
  const [heapResult, setHeapResult] = useState<RecommendationResult | null>(null);
  const [fullSortResult, setFullSortResult] = useState<RecommendationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(conditionType: string, latitude: number, longitude: number) {
    setLoading(true);
    setError(null);
    try {
      const results = await compareRecommendationAlgorithms({
        conditionType,
        patientLatitude: latitude,
        patientLongitude: longitude,
        topK: 3,
      });
      setHeapResult(results.heap);
      setFullSortResult(results.fullSort);
    } catch (err) {
      setError("Could not reach the decision service. Is the Spring Boot backend running on port 8080?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h1" gutterBottom>
        Best Hospital Recommendation
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4 }}>
        Task 4 — ranks hospitals by specialty match, distance, and bed availability.
      </Typography>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <RecommendationForm onSubmit={handleSubmit} loading={loading} />
      </Paper>

      {error && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <RecommendationResultView heap={heapResult} fullSort={fullSortResult} />
    </Container>
  );
}
