"use client";

// Owner: Integration
// UPDATED: added a Reset Demo Data button with a confirmation dialog.
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
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { getDashboardSummary, resetDemoData, DashboardSummary } from "../../lib/incidentApi";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  function loadSummary() {
    getDashboardSummary()
      .then(setSummary)
      .catch(() => setError("Could not reach the backend. Is Spring Boot running on port 8080?"));
  }

  useEffect(() => {
    loadSummary();
  }, []);

  async function handleReset() {
    setResetting(true);
    setResetMessage(null);
    try {
      await resetDemoData();
      setResetMessage("Demo data reset - all incidents cleared, all resources and supply items restored.");
      loadSummary();
    } catch (err) {
      setResetMessage("Reset failed - is the backend running?");
    } finally {
      setResetting(false);
      setConfirmOpen(false);
    }
  }

  return (
    <Container maxWidth="lg">
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Control Room</Typography>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<RestartAltIcon />}
          onClick={() => setConfirmOpen(true)}
        >
          Reset Demo Data
        </Button>
      </Stack>

      {resetMessage && <Alert severity="info" sx={{ mb: 2 }} onClose={() => setResetMessage(null)}>{resetMessage}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!summary && !error && <Typography>Loading system status...</Typography>}

      {summary && (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">Pending Incidents</Typography>
                  <Typography variant="h3">{summary.pendingIncidents}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">Available Ambulances</Typography>
                  <Typography variant="h3" color={summary.availableAmbulances === 0 ? "error.main" : "inherit"}>
                    {summary.availableAmbulances}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
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

          {summary.availableAmbulances === 0 && (
            <Alert severity="error" sx={{ mb: 3 }}>
              No ambulances are currently available. New incidents will still be logged and matched to
              a hospital, but cannot be assigned a vehicle until one becomes free.
            </Alert>
          )}

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

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Reset all demo data?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This clears every reported incident and restores all ambulances, beds, and supply items to
            available. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleReset} color="secondary" variant="contained" disabled={resetting}>
            {resetting ? "Resetting..." : "Reset"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
