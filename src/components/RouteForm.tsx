"use client";

import { useState } from "react";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import RouteIcon from "@mui/icons-material/AltRoute";

interface RouteFormProps {
  onSubmit: (sourceId: number, destinationId: number) => void;
  loading: boolean;
}

const SAMPLE_NODES = [
  { id: 1, name: "City Hospital" },
  { id: 2, name: "Junction A" },
  { id: 3, name: "Junction B" },
  { id: 4, name: "Ambulance Depot 1" },
  { id: 5, name: "General Hospital" },
];

export default function RouteForm({ onSubmit, loading }: RouteFormProps) {
  const [sourceId, setSourceId] = useState(4);
  const [destinationId, setDestinationId] = useState(1);

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{ alignItems: { sm: "flex-end", xs: "stretch" } }}
    >
      <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
        <InputLabel id="source-label">From</InputLabel>
        <Select
          labelId="source-label"
          label="From"
          value={sourceId}
          onChange={(e) => setSourceId(Number(e.target.value))}
        >
          {SAMPLE_NODES.map((n) => (
            <MenuItem key={n.id} value={n.id}>
              {n.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 200, flex: 1 }}>
        <InputLabel id="destination-label">To</InputLabel>
        <Select
          labelId="destination-label"
          label="To"
          value={destinationId}
          onChange={(e) => setDestinationId(Number(e.target.value))}
        >
          {SAMPLE_NODES.map((n) => (
            <MenuItem key={n.id} value={n.id}>
              {n.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        startIcon={<RouteIcon />}
        onClick={() => onSubmit(sourceId, destinationId)}
        disabled={loading || sourceId === destinationId}
        sx={{ height: 40 }}
      >
        {loading ? "Calculating..." : "Find Route"}
      </Button>
    </Stack>
  );
}