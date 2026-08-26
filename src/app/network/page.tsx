"use client";

// Owner: Janiru
// Route: /network

import { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CriticalNodesCard from "../../components/CriticalNodesCard";
import MSTCard from "../../components/MSTCard";
import CentralityRankingCard from "../../components/CentralityRankingCard";
import {
  getCriticalNodes,
  getMST,
  getCentralityRanking,
  CriticalNodeResult,
  MSTResult,
  CentralityResult,
} from "../../lib/networkApi";

export default function NetworkAnalysisPage() {
  const [criticalNodes, setCriticalNodes] = useState<CriticalNodeResult | null>(null);
  const [mst, setMst] = useState<MSTResult | null>(null);
  const [centrality, setCentrality] = useState<CentralityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const [criticalResult, mstResult, centralityResult] = await Promise.all([
        getCriticalNodes(),
        getMST(),
        getCentralityRanking(),
      ]);
      setCriticalNodes(criticalResult);
      setMst(mstResult);
      setCentrality(centralityResult);
    } catch (err) {
      setError("Could not reach the network analysis service. Is the Spring Boot backend running on port 8080?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h1" gutterBottom>
        Hospital Referral Network Resilience
      </Typography>
      <Typography variant="subtitle1" mb={4}>
        Task 3 — finds critical nodes, the backbone network, and ranks nodes by importance.
      </Typography>

      <Button
        variant="contained"
        startIcon={<AnalyticsIcon />}
        onClick={runAnalysis}
        disabled={loading}
        sx={{ mb: 3 }}
      >
        {loading ? "Analyzing..." : "Run Network Analysis"}
      </Button>

      {error && (
        <Box mb={3}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <Stack spacing={3}>
        {criticalNodes && <CriticalNodesCard result={criticalNodes} />}
        {mst && <MSTCard result={mst} />}
        {centrality && <CentralityRankingCard result={centrality} />}
      </Stack>
    </Container>
  );
}
