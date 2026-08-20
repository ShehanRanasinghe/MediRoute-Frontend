

import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { AllocationResult } from "../lib/allocationApi";

interface AllocationResultViewProps {
  greedy: AllocationResult | null;
  knapsack: AllocationResult | null;
}

function formatTime(nanos: number): string {
  return `${(nanos / 1_000_000).toFixed(3)} ms`;
}

function ResultCard({ result }: { result: AllocationResult }) {
  const utilization = result.totalCapacity === 0 ? 0 : (result.capacityUsed / result.totalCapacity) * 100;

  return (
    <Card variant="outlined" sx={{ flex: 1, minWidth: 260 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h2">{result.algorithmUsed}</Typography>
          <Chip label={formatTime(result.executionTimeNanos)} size="small" color="secondary" variant="outlined" />
        </Stack>

        <Typography variant="body2" color="text.secondary">
          Total Value Achieved
        </Typography>
        <Typography variant="h6" mb={1}>
          {result.totalValueAchieved}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Capacity Used: {result.capacityUsed} / {result.totalCapacity}
        </Typography>
        <Box mb={1}>
          <LinearProgress variant="determinate" value={utilization} sx={{ height: 8, borderRadius: 4 }} />
        </Box>

        <Divider sx={{ my: 1 }} />

        <Typography variant="body2" color="text.secondary">
          Allocated: {result.selectedIncidentIds.length} request(s)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Unallocated: {result.unallocatedIncidentIds.length} request(s)
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function AllocationResultView({ greedy, knapsack }: AllocationResultViewProps) {
  if (!greedy && !knapsack) return null;

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={3}>
      {greedy && <ResultCard result={greedy} />}
      {knapsack && <ResultCard result={knapsack} />}
    </Stack>
  );
}
