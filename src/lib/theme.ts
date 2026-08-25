import { createTheme } from "@mui/material/styles";

// Owner: Manura
// Same theme as Task 1/2/3 - reuse the existing lib/theme.ts if your
// project already has one, don't create a second copy.
export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0F6E5D", light: "#3E9484", dark: "#0A4E42", contrastText: "#FFFFFF" },
    secondary: { main: "#C1440E" },
    background: { default: "#F4F7F6", paper: "#FFFFFF" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: "1.9rem" },
    h2: { fontWeight: 600, fontSize: "1.4rem" },
    subtitle1: { color: "#5A6B68" },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: "none", fontWeight: 600 } } },
    MuiCard: { styleOverrides: { root: { boxShadow: "0 1px 3px rgba(15, 110, 93, 0.12)" } } },
  },
});
