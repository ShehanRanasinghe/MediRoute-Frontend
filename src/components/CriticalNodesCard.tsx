// Owner: Janiru

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import { CriticalNodeResult } from "../lib/networkApi";

function formatTime(nanos: number): string {
  return `${(nanos / 1_000_000).toFixed(3)} ms`;
}

export default function CriticalNodesCard({ result }: { result: CriticalNodeResult }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h2">Critical Nodes (Articulation Points)</Typography>
          <Chip label={formatTime(result.executionTimeNanos)} size="small" color="secondary" variant="outlined" />
        </Stack>

        {result.criticalNodeIds.length === 0 ? (
          <Alert severity="success">No critical nodes found - the network has no single point of failure.</Alert>
        ) : (
          <>
            <Alert severity="warning" sx={{ mb: 1 }}>
              Removing any of these nodes would disconnect part of the network.
            </Alert>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {result.criticalNodeIds.map((id) => (
                <Chip key={id} label={`Node ${id}`} color="warning" />
              ))}
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
}
