"use client";

import { useState, useEffect } from "react";
import { getNetworkNodes, RouteNode } from "@/lib/api";
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

const FALLBACK_NODES: RouteNode[] = [
  { id: 1, name: "City Hospital", type: "HOSPITAL" },
  { id: 2, name: "Junction A", type: "JUNCTION" },
  { id: 3, name: "Junction B", type: "JUNCTION" },
  { id: 4, name: "Ambulance Depot 1", type: "DEPOT" },
  { id: 5, name: "General Hospital", type: "HOSPITAL" },
];

export default function RouteForm({ onSubmit, loading }: RouteFormProps) {
  const [nodes, setNodes] = useState<RouteNode[]>(FALLBACK_NODES);
  const [sourceId, setSourceId] = useState<number>(4);
  const [destinationId, setDestinationId] = useState<number>(1);

  useEffect(() => {
    getNetworkNodes()
      .then((data) => {
        if (data && data.length > 0) {
          setNodes(data);
          
          // Check if our currently selected sourceId and destinationId exist in the new list.
          const hasSource = data.some((n) => n.id === sourceId);
          const hasDestination = data.some((n) => n.id === destinationId);

          if (!hasSource || !hasDestination) {
            // Find a depot and a hospital for a meaningful default route
            const depot = data.find((n) => n.type === "DEPOT") || data[0];
            const hospital = data.find((n) => n.type === "HOSPITAL" && n.id !== depot.id) || data[1] || data[0];
            
            setSourceId(depot.id);
            setDestinationId(hospital.id);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load real network nodes, using fallback sample data", err);
      });
  }, []);

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
          {nodes.map((n) => (
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
          {nodes.map((n) => (
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