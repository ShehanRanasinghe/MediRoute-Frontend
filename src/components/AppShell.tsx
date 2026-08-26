"use client";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import InsightsIcon from "@mui/icons-material/Insights";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Shell creates the shared navigation drawer and top app bar for the whole application.
const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: "Control Room", href: "/dashboard", icon: <DashboardIcon /> },
  { label: "Report Incident", href: "/incident/new", icon: <AddAlertIcon /> },
  { label: "Algorithm Explorer", href: "/algorithms", icon: <InsightsIcon /> },
];

// The current page route is tracked so the selected nav item can be highlighted correctly.
export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }} color="primary">
        <Toolbar>
          <LocalHospitalIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MediRoute Dispatch Console
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <List>
          {NAV_ITEMS.map((item) => (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={pathname?.startsWith(item.href)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}
