// Owner: Janiru

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { CentralityResult } from "../lib/networkApi";

function formatTime(nanos: number): string {
  return `${(nanos / 1_000_000).toFixed(3)} ms`;
}

export default function CentralityRankingCard({ result }: { result: CentralityResult }) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h2">Node Importance Ranking</Typography>
          <Chip label={formatTime(result.executionTimeNanos)} size="small" color="secondary" variant="outlined" />
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Node</TableCell>
              <TableCell align="right">Connections</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.rankedNodes.map((node, index) => (
              <TableRow key={node.nodeId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{node.name}</TableCell>
                <TableCell align="right">{node.degreeScore}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
