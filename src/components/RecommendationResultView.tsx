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
import { RecommendationResult } from "../lib/decisionApi";

interface RecommendationResultViewProps {
  heap: RecommendationResult | null;
  fullSort: RecommendationResult | null;
}

// Compares the execution time of the heap-based and full-sort ranking methods.
function formatTime(nanos: number): string {
  return `${(nanos / 1_000_000).toFixed(3)} ms`;
}

export default function RecommendationResultView({ heap, fullSort }: RecommendationResultViewProps) {
  if (!heap) return null;

  return (
    <Card variant="outlined" sx={{ mt: 3 }}>
      <CardContent>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1, flexWrap: "wrap", gap: 1 }}>
          <Typography variant="h2">Recommended Hospitals</Typography>
          <Stack direction="row" spacing={1}>
            <Chip label={`Heap: ${formatTime(heap.executionTimeNanos)}`} size="small" color="secondary" variant="outlined" />
            {fullSort && (
              <Chip label={`Full Sort: ${formatTime(fullSort.executionTimeNanos)}`} size="small" color="secondary" variant="outlined" />
            )}
          </Stack>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Both algorithms produce the same ranking below - the chips above compare their speed only.
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Hospital</TableCell>
              <TableCell align="right">Score</TableCell>
              <TableCell align="right">Distance</TableCell>
              <TableCell align="center">Specialty Match</TableCell>
              <TableCell align="right">Beds Free</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {heap.rankedHospitals.map((hospital, index) => (
              <TableRow key={hospital.hospitalId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{hospital.hospitalName}</TableCell>
                <TableCell align="right">{hospital.score.toFixed(3)}</TableCell>
                <TableCell align="right">{hospital.distanceKm.toFixed(2)} km</TableCell>
                <TableCell align="center">
                  {hospital.specialtyMatch ? (
                    <Chip label="Yes" size="small" color="primary" />
                  ) : (
                    <Chip label="No" size="small" variant="outlined" />
                  )}
                </TableCell>
                <TableCell align="right">{hospital.availableBeds}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
