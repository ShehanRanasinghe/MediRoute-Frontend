"use client";

// Emergency data is collected here before the dispatch pipeline matches a patient to a hospital, route, and supplies.
import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
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
import { getIncidentLocations, IncidentLocation } from "../../../lib/incidentLocationApi";

const CONDITIONS = ["CARDIAC", "TRAUMA", "GENERAL"];

// Blocks special characters in the patient reference - allows letters,
// numbers, spaces, and hyphens only (e.g. "REF-102" or "John D").
const PATIENT_REFERENCE_PATTERN = /^[A-Za-z0-9\s-]*$/;

// Accepts digits, spaces, +, and - only, 7-15 characters - loose enough
// for local and international formats, strict enough to catch typos.
const PHONE_PATTERN = /^[0-9+\-\s]{7,15}$/;

export default function NewIncidentPage() {
  const [patientReference, setPatientReference] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [conditionType, setConditionType] = useState("CARDIAC");
  const [severity, setSeverity] = useState(7);
  const [locations, setLocations] = useState<IncidentLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<IncidentLocation | null>(null);
  const [locationsError, setLocationsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IncidentResponse | null>(null);

  // Locations now come from the database (admin-managed) instead of a
  // hardcoded 3-item list, via a direct Supabase read - see
  // lib/incidentLocationApi.ts.
  useEffect(() => {
    getIncidentLocations()
      .then((locs) => {
        setLocations(locs);
        if (locs.length > 0) setSelectedLocation(locs[0]);
      })
      .catch(() => setLocationsError("Could not load incident locations from the database."));
  }, []);

  const referenceInvalid = patientReference !== "" && !PATIENT_REFERENCE_PATTERN.test(patientReference);
  const phoneInvalid = phoneNumber !== "" && !PHONE_PATTERN.test(phoneNumber);
  const canSubmit = !referenceInvalid && !phoneInvalid && selectedLocation !== null;

  async function handleSubmit() {
    if (!canSubmit || !selectedLocation) return;

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await reportIncident({
        patientReference: patientReference || undefined,
        phoneNumber: phoneNumber || undefined,
        conditionType,
        severityScore: severity,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
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
            error={referenceInvalid}
            helperText={referenceInvalid ? "Letters, numbers, spaces, and hyphens only - no special characters." : " "}
          />

          <TextField
            label="Contact Phone Number (optional)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            error={phoneInvalid}
            helperText={
              phoneInvalid
                ? "Enter a valid phone number (digits, spaces, + and - only, 7-15 characters)."
                : "Used by admins to verify this report is genuine - not shown publicly."
            }
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

          <Autocomplete
            options={locations}
            getOptionLabel={(loc) => loc.name}
            value={selectedLocation}
            onChange={(_, value) => setSelectedLocation(value)}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            renderInput={(params) => (
              <TextField {...params} label="Incident Location" placeholder="Type to search..." />
            )}
          />
          {locationsError && <Alert severity="error">{locationsError}</Alert>}

          <Button
            variant="contained"
            size="large"
            startIcon={<SendIcon />}
            onClick={handleSubmit}
            disabled={loading || !canSubmit}
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
