import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { OptimizationResult } from "../lib/optimizationApi";

// Displays the output of each optimization method in a simple comparison view.
function formatTime(nanos: number): string {
  return `${(nanos / 1_000_000).toFixed(3)} ms`;
}

function ResultCard({ result }: { result: OptimizationResult }) {
  const utilization = result.totalCapacity === 0 ? 0 : (result.capacityUsed / result.totalCapacity) * 100;

  return (
    <Card variant="outlined" sx={{ flex: 1, minWidth: 240 }}>
      <CardContent>
        <Stack 
            direction="row" 
            sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h2" sx={{ fontSize: "1.1rem" }}>{result.algorithmUsed}</Typography>
          <Chip label={formatTime(result.executionTimeNanos)} size="small" color="secondary" variant="outlined" />
        </Stack>

        <Typography variant="body2" color="text.secondary">
          Total Value Achieved
        </Typography>
        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
          {result.totalValueAchieved}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Capacity Used: {result.capacityUsed} / {result.totalCapacity}
        </Typography>
        <Box sx={{ mb: 3 }}>
          <LinearProgress variant="determinate" value={utilization} sx={{ height: 8, borderRadius: 4 }} />
        </Box>

        <Divider sx={{ my: 1 }} />

        <Typography variant="body2" color="text.secondary">
          Loaded: {result.selectedItemIds.length} item(s)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Left Behind: {result.unselectedItemIds.length} item(s)
        </Typography>
      </CardContent>
    </Card>
  );
}

interface OptimizationResultViewProps {
  dp: OptimizationResult | null;
  greedy: OptimizationResult | null;
  backtracking: OptimizationResult | null | undefined;
}

export default function OptimizationResultView({ dp, greedy, backtracking }: OptimizationResultViewProps) {
  if (!dp && !greedy) return null;

  return (
    <Box sx={{ mt: 3 }}>
      {!backtracking && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Backtracking was skipped for this run - it's only included when there are 25 or fewer
          pending items, to avoid its worst-case exponential runtime.
        </Alert>
      )}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        {dp && <ResultCard result={dp} />}
        {greedy && <ResultCard result={greedy} />}
        {backtracking && <ResultCard result={backtracking} />}
      </Stack>
    </Box>
  );
}
