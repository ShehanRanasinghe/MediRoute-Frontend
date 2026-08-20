"use client";



import { useState } from "react";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";

interface AllocationFormProps {
  onSubmit: (resourceType: string) => void;
  loading: boolean;
}

const RESOURCE_TYPES = [
  { value: "AMBULANCE", label: "Ambulance" },
  { value: "ICU_BED", label: "ICU Bed" },
  { value: "WARD_BED", label: "Ward Bed" },
  { value: "VENTILATOR", label: "Ventilator" },
];

export default function AllocationForm({ onSubmit, loading }: AllocationFormProps) {
  const [resourceType, setResourceType] = useState("AMBULANCE");

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "flex-end" }}>
      <FormControl size="small" sx={{ minWidth: 220 }}>
        <InputLabel id="resource-type-label">Resource Type</InputLabel>
        <Select
          labelId="resource-type-label"
          label="Resource Type"
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value)}
        >
          {RESOURCE_TYPES.map((r) => (
            <MenuItem key={r.value} value={r.value}>
              {r.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        startIcon={<PlaylistAddCheckIcon />}
        onClick={() => onSubmit(resourceType)}
        disabled={loading}
      >
        {loading ? "Allocating..." : "Run Allocation"}
      </Button>
    </Stack>
  );
}
