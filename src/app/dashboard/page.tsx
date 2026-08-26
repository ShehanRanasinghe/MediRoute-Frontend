"use client";

// Owner: Integration
// Route: /dashboard - the Control Room

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Alert from "@mui/material/Alert";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import LinearProgress from "@mui/material/LinearProgress";
import { getDashboardSummary, DashboardSummary } from "../../lib/incidentApi";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardSummary()
      .then(setSummary)
      .catch(() => setError("Could not reach the backend. Is Spring Boot running on port 8080?"));
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Control Room
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!summary && !error && <Typography>Loading system status...</Typography>}

      {summary && (
        <>
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">Pending Incidents</Typography>
                  <Typography variant="h3">{summary.pendingIncidents}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">Available Ambulances</Typography>
                  <Typography variant="h3">{summary.availableAmbulances}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">Network Risk Points</Typography>
                  <Typography variant="h3" color={summary.criticalNodeCount > 0 ? "warning.main" : "inherit"}>
                    {summary.criticalNodeCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {summary.criticalNodeCount > 0 && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              {summary.criticalNodeCount} road junction(s) are currently single points of failure -
              if one is blocked, part of the hospital network could become unreachable.
            </Alert>
          )}

          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>Hospital Bed Availability</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Hospital</TableCell>
                    <TableCell align="right">Available / Total Beds</TableCell>
                    <TableCell>Utilization</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {summary.hospitals.map((h) => (
                    <TableRow key={h.hospitalId}>
                      <TableCell>{h.name}</TableCell>
                      <TableCell align="right">{h.availableBeds} / {h.totalBeds}</TableCell>
                      <TableCell sx={{ width: 200 }}>
                        <LinearProgress
                          variant="determinate"
                          value={h.totalBeds === 0 ? 0 : ((h.totalBeds - h.availableBeds) / h.totalBeds) * 100}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
}
