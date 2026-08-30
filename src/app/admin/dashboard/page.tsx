"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { signOut } from "../../../lib/adminAuth";
import { getIncidentList, resetDemoData, IncidentSummary } from "../../../lib/incidentApi";
import {
  getResources, addResource, ResourceRow,
  getSupplyItems, addSupplyItem, SupplyItemRow,
} from "../../../lib/adminDataApi";
import {
  getIncidentLocations, addIncidentLocation, deleteIncidentLocation, IncidentLocation,
} from "../../../lib/incidentLocationApi";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [incidents, setIncidents] = useState<IncidentSummary[]>([]);
  const [resources, setResources] = useState<ResourceRow[]>([]);
  const [supplyItems, setSupplyItems] = useState<SupplyItemRow[]>([]);
  const [locations, setLocations] = useState<IncidentLocation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  // New resource form
  const [resType, setResType] = useState<ResourceRow["resource_type"]>("AMBULANCE");
  const [resOwnerType, setResOwnerType] = useState<ResourceRow["owner_type"]>("DEPOT");
  const [resOwnerId, setResOwnerId] = useState(1);

  // New supply item form
  const [itemName, setItemName] = useState("");
  const [itemType, setItemType] = useState<SupplyItemRow["item_type"]>("SUPPLY_CRATE");
  const [itemValue, setItemValue] = useState(5);
  const [itemCost, setItemCost] = useState(3);
  const [itemDepotId, setItemDepotId] = useState(1);

  // New location form
  const [locName, setLocName] = useState("");
  const [locLat, setLocLat] = useState(6.93);
  const [locLng, setLocLng] = useState(79.86);

  function loadAll() {
    setError(null);
    Promise.all([getIncidentList(), getResources(), getSupplyItems(), getIncidentLocations()])
      .then(([i, r, s, l]) => {
        setIncidents(i);
        setResources(r);
        setSupplyItems(s);
        setLocations(l);
      })
      .catch(() => setError("Could not load admin data. Check the backend and Supabase configuration."));
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleLogout() {
    await signOut();
    router.push("/admin/login");
  }

  async function handleReset() {
    setResetting(true);
    try {
      await resetDemoData();
      setMessage("Demo data reset - all incidents cleared, all resources and supply items restored.");
      loadAll();
    } catch {
      setMessage("Reset failed - is the backend running?");
    } finally {
      setResetting(false);
      setConfirmOpen(false);
    }
  }

  async function handleAddResource() {
    try {
      await addResource({ resource_type: resType, owner_type: resOwnerType, owner_id: resOwnerId, status: "AVAILABLE" });
      setMessage(`Added 1 ${resType} resource.`);
      loadAll();
    } catch {
      setMessage("Could not add resource - check you are logged in and Supabase RLS is configured.");
    }
  }

  async function handleAddSupplyItem() {
    if (!itemName.trim()) {
      setMessage("Item name is required.");
      return;
    }
    try {
      await addSupplyItem({
        item_name: itemName.trim(),
        item_type: itemType,
        urgency_value: itemValue,
        size_cost: itemCost,
        depot_id: itemDepotId,
        status: "PENDING",
      });
      setMessage(`Added supply item "${itemName}".`);
      setItemName("");
      loadAll();
    } catch {
      setMessage("Could not add supply item.");
    }
  }

  async function handleAddLocation() {
    if (!locName.trim()) {
      setMessage("Location name is required.");
      return;
    }
    try {
      await addIncidentLocation({ name: locName.trim(), latitude: locLat, longitude: locLng });
      setMessage(`Added location "${locName}".`);
      setLocName("");
      loadAll();
    } catch {
      setMessage("Could not add location.");
    }
  }

  async function handleDeleteLocation(id: number) {
    try {
      await deleteIncidentLocation(id);
      loadAll();
    } catch {
      setMessage("Could not delete location.");
    }
  }

  return (
    <Container maxWidth="lg" sx={{ pb: 6 }}>
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Admin Panel</Typography>
        <Button variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout}>
          Logout
        </Button>
      </Stack>

      {message && <Alert severity="info" sx={{ mb: 2 }} onClose={() => setMessage(null)}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Reset */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography variant="h6">Reset Demo Data</Typography>
              <Typography variant="body2" color="text.secondary">
                Clears every reported incident and restores all ambulances, beds, and supply items.
              </Typography>
            </Box>
            <Button variant="outlined" color="secondary" startIcon={<RestartAltIcon />} onClick={() => setConfirmOpen(true)}>
              Reset
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Incident verification list */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Reported Incidents (Verification)</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Phone numbers are shown here only, so a reported incident can be verified as genuine
            before more resources are committed to it.
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Reference</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Condition</TableCell>
                <TableCell align="right">Severity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Reported At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incidents.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>{i.id}</TableCell>
                  <TableCell>{i.patientReference || "-"}</TableCell>
                  <TableCell>{i.phoneNumber || "-"}</TableCell>
                  <TableCell>{i.conditionType}</TableCell>
                  <TableCell align="right">{i.severityScore}</TableCell>
                  <TableCell><Chip size="small" label={i.status} /></TableCell>
                  <TableCell>{new Date(i.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {incidents.length === 0 && (
                <TableRow><TableCell colSpan={7} align="center">No incidents reported yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Resource */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Add Ambulance / Resource</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Resource Type</InputLabel>
              <Select label="Resource Type" value={resType} onChange={(e) => setResType(e.target.value as ResourceRow["resource_type"])}>
                <MenuItem value="AMBULANCE">Ambulance</MenuItem>
                <MenuItem value="ICU_BED">ICU Bed</MenuItem>
                <MenuItem value="WARD_BED">Ward Bed</MenuItem>
                <MenuItem value="VENTILATOR">Ventilator</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Owner Type</InputLabel>
              <Select label="Owner Type" value={resOwnerType} onChange={(e) => setResOwnerType(e.target.value as ResourceRow["owner_type"])}>
                <MenuItem value="DEPOT">Depot</MenuItem>
                <MenuItem value="HOSPITAL">Hospital</MenuItem>
              </Select>
            </FormControl>
            <TextField size="small" label="Owner ID" type="number" value={resOwnerId} onChange={(e) => setResOwnerId(Number(e.target.value))} sx={{ width: 120 }} />
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddResource}>Add</Button>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Table size="small">
            <TableHead>
              <TableRow><TableCell>ID</TableCell><TableCell>Type</TableCell><TableCell>Owner</TableCell><TableCell>Status</TableCell></TableRow>
            </TableHead>
            <TableBody>
              {resources.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.resource_type}</TableCell>
                  <TableCell>{r.owner_type} #{r.owner_id}</TableCell>
                  <TableCell><Chip size="small" label={r.status} color={r.status === "AVAILABLE" ? "success" : "default"} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Supply Item */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Add Supply Item</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2, flexWrap: "wrap" }}>
            <TextField size="small" label="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} sx={{ minWidth: 180 }} />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Item Type</InputLabel>
              <Select label="Item Type" value={itemType} onChange={(e) => setItemType(e.target.value as SupplyItemRow["item_type"])}>
                <MenuItem value="SUPPLY_CRATE">Supply Crate</MenuItem>
                <MenuItem value="PATIENT_TRANSFER">Patient Transfer</MenuItem>
              </Select>
            </FormControl>
            <TextField size="small" label="Urgency (1-10)" type="number" value={itemValue} onChange={(e) => setItemValue(Number(e.target.value))} sx={{ width: 130 }} />
            <TextField size="small" label="Size Cost" type="number" value={itemCost} onChange={(e) => setItemCost(Number(e.target.value))} sx={{ width: 110 }} />
            <TextField size="small" label="Depot ID" type="number" value={itemDepotId} onChange={(e) => setItemDepotId(Number(e.target.value))} sx={{ width: 100 }} />
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddSupplyItem}>Add</Button>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Table size="small">
            <TableHead>
              <TableRow><TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Type</TableCell><TableCell align="right">Urgency</TableCell><TableCell align="right">Size</TableCell><TableCell>Status</TableCell></TableRow>
            </TableHead>
            <TableBody>
              {supplyItems.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.id}</TableCell>
                  <TableCell>{s.item_name}</TableCell>
                  <TableCell>{s.item_type}</TableCell>
                  <TableCell align="right">{s.urgency_value}</TableCell>
                  <TableCell align="right">{s.size_cost}</TableCell>
                  <TableCell><Chip size="small" label={s.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Manage Incident Locations */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>Manage Incident Locations</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            These populate the searchable location dropdown on the public Report Incident page.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
            <TextField size="small" label="Location Name" value={locName} onChange={(e) => setLocName(e.target.value)} sx={{ minWidth: 200 }} />
            <TextField size="small" label="Latitude" type="number" value={locLat} onChange={(e) => setLocLat(Number(e.target.value))} sx={{ width: 130 }} />
            <TextField size="small" label="Longitude" type="number" value={locLng} onChange={(e) => setLocLng(Number(e.target.value))} sx={{ width: 130 }} />
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddLocation}>Add</Button>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Table size="small">
            <TableHead>
              <TableRow><TableCell>Name</TableCell><TableCell align="right">Lat</TableCell><TableCell align="right">Lng</TableCell><TableCell align="right">Remove</TableCell></TableRow>
            </TableHead>
            <TableBody>
              {locations.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>{l.name}</TableCell>
                  <TableCell align="right">{l.latitude}</TableCell>
                  <TableCell align="right">{l.longitude}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleDeleteLocation(l.id)}><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Reset all demo data?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This clears every reported incident and restores all ambulances, beds, and supply items
            to available. This cannot be undone.
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
