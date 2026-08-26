"use client";

// Owner: Manura

import { useState } from "react";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

interface RecommendationFormProps {
  onSubmit: (conditionType: string, latitude: number, longitude: number) => void;
  loading: boolean;
}

const CONDITION_TYPES = ["CARDIAC", "TRAUMA", "GENERAL"];

// Defaults roughly centered on the sample city used across all modules
export default function RecommendationForm({ onSubmit, loading }: RecommendationFormProps) {
  const [conditionType, setConditionType] = useState("CARDIAC");
  const [latitude, setLatitude] = useState(6.9285);
  const [longitude, setLongitude] = useState(79.8625);

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "flex-end" }} flexWrap="wrap" useFlexGap>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="condition-label">Condition</InputLabel>
        <Select
          labelId="condition-label"
          label="Condition"
          value={conditionType}
          onChange={(e) => setConditionType(e.target.value)}
        >
          {CONDITION_TYPES.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        size="small"
        label="Patient Latitude"
        type="number"
        value={latitude}
        onChange={(e) => setLatitude(Number(e.target.value))}
        sx={{ width: 160 }}
      />

      <TextField
        size="small"
        label="Patient Longitude"
        type="number"
        value={longitude}
        onChange={(e) => setLongitude(Number(e.target.value))}
        sx={{ width: 160 }}
      />

      <Button
        variant="contained"
        startIcon={<LocalHospitalIcon />}
        onClick={() => onSubmit(conditionType, latitude, longitude)}
        disabled={loading}
      >
        {loading ? "Finding..." : "Get Recommendation"}
      </Button>
    </Stack>
  );
}
