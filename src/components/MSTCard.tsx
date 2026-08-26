import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { MSTResult } from "../lib/networkApi";

// Shows the minimum spanning tree that keeps the network connected with the lowest total cost.
function formatTime(nanos: number): string {
  return `${(nanos / 1_000_000).toFixed(3)} ms`;
}

export default function MSTCard({
  result,
  nodeMap = {},
}: {
  result: MSTResult;
  nodeMap?: Record<number, string>;
}) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="h2">Backbone Network (MST)</Typography>
          <Chip label={formatTime(result.executionTimeNanos)} size="small" color="secondary" variant="outlined" />
        </Stack>

        <Typography variant="body2" color="text.secondary">
          Total Backbone Length
        </Typography>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {result.totalWeightKm.toFixed(2)} km ({result.edges.length} road{result.edges.length === 1 ? "" : "s"})
        </Typography>

        <Divider sx={{ my: 1 }} />

        <List dense>
          {result.edges.map((edge, index) => (
            <ListItem key={index} disableGutters>
              <ListItemText
                primary={`${nodeMap[edge.fromNodeId] ?? `Node #${edge.fromNodeId}`} → ${nodeMap[edge.toNodeId] ?? `Node #${edge.toNodeId}`}`}
                secondary={`${edge.weightKm.toFixed(2)} km`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
