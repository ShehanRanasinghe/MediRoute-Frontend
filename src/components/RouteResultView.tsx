import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import { RouteResult } from "../lib/api";

interface RouteResultViewProps {
  dijkstra: RouteResult | null;
  astar: RouteResult | null;
  /** Map of nodeId → nodeName, used to render human-readable path labels. */
  nodeMap?: Record<number, string>;
}

function formatTime(nanos: number): string {
  return `${(nanos / 1_000_000).toFixed(3)} ms`;
}

function ResultCard({
  result,
  nodeMap,
}: {
  result: RouteResult;
  nodeMap?: Record<number, string>;
}) {
  // path[] is List<Long> from backend — plain numbers, not objects.
  // Resolve each ID to a name using nodeMap when available.
  const pathDisplay = Array.isArray(result.path)
    ? result.path
        .map((node: unknown) => {
          const id = typeof node === "object" && node !== null
            ? (node as { id?: number }).id ?? 0
            : Number(node);
          return nodeMap?.[id] ?? `Node #${id}`;
        })
        .join(" → ")
    : "";

  return (
    <Card variant="outlined" sx={{ flex: 1, minWidth: 260 }}>
      <CardContent>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {result.algorithmUsed || "Algorithm Output"}
          </Typography>
          <Chip
            label={formatTime(result.executionTimeNanos)}
            size="small"
            color="secondary"
            variant="outlined"
          />
        </Stack>

        {!result.pathFound ? (
          <Alert severity="error">No path found between these locations.</Alert>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary">
              Distance
            </Typography>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {result.totalDistanceKm.toFixed(2)} km
            </Typography>

            <Divider sx={{ my: 1 }} />

            <Typography variant="body2" color="text.secondary">
              Path ({result.path.length} node{result.path.length !== 1 ? "s" : ""})
            </Typography>
            <Typography variant="body1">{pathDisplay}</Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function RouteResultView({ dijkstra, astar, nodeMap }: RouteResultViewProps) {
  if (!dijkstra && !astar) return null;

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
      {dijkstra && <ResultCard result={dijkstra} nodeMap={nodeMap} />}
      {astar && <ResultCard result={astar} nodeMap={nodeMap} />}
    </Stack>
  );
}