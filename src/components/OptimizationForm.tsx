"use client";

import { useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

interface OptimizationFormProps {
  onSubmit: (vehicleCapacity: number) => void;
  loading: boolean;
}

export default function OptimizationForm({ onSubmit, loading }: OptimizationFormProps) {
  const [vehicleCapacity, setVehicleCapacity] = useState(15);

  return (
    <Stack 
        component="div" 
        spacing={2} 
        sx={{ 
        flexDirection: { xs: "column", sm: "row" }, 
        alignItems: { sm: "center" } 
    }}>
      <TextField
        size="small"
        label="Vehicle Capacity (units)"
        type="number"
        value={vehicleCapacity}
        onChange={(e) => setVehicleCapacity(Number(e.target.value))}
        sx={{ width: 220 }}
      />

      <Button
        variant="contained"
        startIcon={<LocalShippingIcon />}
        onClick={() => onSubmit(vehicleCapacity)}
        disabled={loading}
      >
        {loading ? "Optimizing..." : "Run Optimization"}
      </Button>
    </Stack>
  );
}
