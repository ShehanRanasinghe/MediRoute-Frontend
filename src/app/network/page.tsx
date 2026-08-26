"use client";

import { useState, useEffect } from "react";
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
import { getNetworkNodes, RouteNode } from "../../lib/api";
import {
  getCriticalNodes,
  getMST,
  getCentralityRanking,
  CriticalNodeResult,
  MSTResult,
  CentralityResult,
} from "../../lib/networkApi";

// Network analysis results are loaded together because they describe different views of the same hospital network.
export default function NetworkAnalysisPage() {
  // Each state holds one analysis result from the backend and the loading/error status.
  const [criticalNodes, setCriticalNodes] = useState<CriticalNodeResult | null>(null);
  const [mst, setMst] = useState<MSTResult | null>(null);
  const [centrality, setCentrality] = useState<CentralityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nodeMap, setNodeMap] = useState<Record<number, string>>({});

  // Node labels are fetched once and cached locally so the result cards stay readable and consistent.
  useEffect(() => {
    getNetworkNodes()
      .then((nodes: RouteNode[]) => {
        const map: Record<number, string> = {};
        nodes.forEach((n) => {
          map[n.id] = n.name;
        });
        setNodeMap(map);
      })
      .catch(() => {
        // Non-fatal - card will fallback to "Node #ID" labels
      });
  }, []);

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
      <Typography variant="subtitle1" sx={{ mb: 4 }}>
        Task 3 - finds critical nodes, the backbone network, and ranks nodes by importance.
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
        <Box sx={{ mb: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      <Stack spacing={3}>
        {criticalNodes && <CriticalNodesCard result={criticalNodes} nodeMap={nodeMap} />}
        {mst && <MSTCard result={mst} nodeMap={nodeMap} />}
        {centrality && <CentralityRankingCard result={centrality} />}
      </Stack>
    </Container>
  );
}

