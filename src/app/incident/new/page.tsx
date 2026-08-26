"use client";

// Emergency data is collected here before the dispatch pipeline matches a patient to a hospital, route, and supplies.
import { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import RouteIcon from "@mui/icons-material/AltRoute";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SendIcon from "@mui/icons-material/Send";
import { reportIncident, IncidentResponse } from "../../../lib/incidentApi";

const CONDITIONS = ["CARDIAC", "TRAUMA", "GENERAL"];
const LOCATION_PRESETS = [
  { label: "Near City Center", lat: 6.9285, lng: 79.8625 },
  { label: "Northern Suburb", lat: 6.9420, lng: 79.8770 },
  { label: "Western District", lat: 6.9200, lng: 79.8550 },
];

export default function NewIncidentPage() {
  // These fields hold the patient details used to create a realistic emergency case for the dispatch pipeline.
  // The severity slider and location preset help simulate a realistic emergency without leaving the form.
  const [patientReference, setPatientReference] = useState("");
  const [conditionType, setConditionType] = useState("CARDIAC");
  const [severity, setSeverity] = useState(7);
  const [locationIndex, setLocationIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IncidentResponse | null>(null);

  // The request is built from the selected preset location and the emergency severity so the backend can process one full response.
  // The result is stored only after the backend responds, which keeps the UI clean while the request is still running.
  async function handleSubmit() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const location = LOCATION_PRESETS[locationIndex];
      const response = await reportIncident({
        patientReference: patientReference || undefined,
        conditionType,
        severityScore: severity,
        latitude: location.lat,
        longitude: location.lng,
      });
      setResult(response);
    } catch (err) {
      setError("Could not process this incident. Is the Spring Boot backend running on port 8080?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Report Emergency Incident
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter the incident details below. The system finds the best hospital, plans the ambulance
        route, assigns a resource, and prepares a supply loadout automatically.
      </Typography>

      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
          <TextField
            label="Patient Reference (optional)"
            value={patientReference}
            onChange={(e) => setPatientReference(e.target.value)}
          />

          <FormControl>
            <InputLabel id="condition-label">Condition</InputLabel>
            <Select
              labelId="condition-label"
              label="Condition"
              value={conditionType}
              onChange={(e) => setConditionType(e.target.value)}
            >
              {CONDITIONS.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Typography gutterBottom>Severity: {severity} / 10</Typography>
            <Slider
              value={severity}
              onChange={(_, v) => setSeverity(v as number)}
              min={1}
              max={10}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </Box>

          <FormControl>
            <InputLabel id="location-label">Incident Location</InputLabel>
            <Select
              labelId="location-label"
              label="Incident Location"
              value={locationIndex}
              onChange={(e) => setLocationIndex(Number(e.target.value))}
            >
              {LOCATION_PRESETS.map((loc, idx) => (
                <MenuItem key={loc.label} value={idx}>{loc.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            size="large"
            startIcon={<SendIcon />}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Processing..." : "Dispatch Response"}
          </Button>
        </Stack>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {result && (
        <Stack spacing={2}>
          <Alert severity="success">
            Incident #{result.incidentId} processed in {(result.overallProcessingTimeNanos / 1_000_000).toFixed(1)} ms.
          </Alert>

          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                <LocalHospitalIcon color="primary" />
                <Typography variant="h6">Hospital Match</Typography>
              </Stack>
              {result.recommendedHospital ? (
                <>
                  <Typography variant="body1"><strong>{result.recommendedHospital.hospitalName}</strong></Typography>
                  <Typography variant="body2" color="text.secondary">
                    {result.recommendedHospital.distanceKm.toFixed(2)} km away
                    {result.recommendedHospital.specialtyMatch ? " - specialty match" : " - nearest suitable option"},{" "}
                    {result.recommendedHospital.availableBeds} beds available
                  </Typography>
                </>
              ) : (
                <Typography color="error">No suitable hospital found.</Typography>
              )}
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                <RouteIcon color="primary" />
                <Typography variant="h6">Dispatch Route</Typography>
              </Stack>
              {result.route && result.route.pathFound ? (
                <>
                  <Typography variant="body1">
                    {result.route.totalDistanceKm.toFixed(2)} km, via {result.route.path.length} point(s)
                  </Typography>
                  {result.routeUsesCriticalNode && (
                    <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mt: 1 }}>
                      This route passes through a single point of failure in the road network.
                    </Alert>
                  )}
                </>
              ) : (
                <Typography color="error">No route could be calculated.</Typography>
              )}
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                {result.ambulanceAllocated ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <WarningAmberIcon color="warning" />
                )}
                <Typography variant="h6">Resource Assignment</Typography>
              </Stack>
              <Typography variant="body1">
                {result.ambulanceAllocated
                  ? "An ambulance has been assigned to this incident."
                  : "No ambulance could be assigned right now - all ambulances are currently committed to other incidents."}
              </Typography>
            </CardContent>
          </Card>

          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
                <LocalShippingIcon color="primary" />
                <Typography variant="h6">Dispatch Supply Plan</Typography>
              </Stack>
              {result.dispatchPlan.note ? (
                <Alert severity="info">{result.dispatchPlan.note}</Alert>
              ) : (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {result.dispatchPlan.capacityUsed} / {result.dispatchPlan.totalCapacity} vehicle capacity used
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                    {result.dispatchPlan.selectedItemNames.map((name) => (
                      <Chip key={name} label={name} size="small" />
                    ))}
                  </Stack>
                </>
              )}
            </CardContent>
          </Card>
        </Stack>
      )}
    </Container>
  );
}
