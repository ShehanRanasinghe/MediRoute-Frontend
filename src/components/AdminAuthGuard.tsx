"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { getSession, onAuthStateChange } from "../lib/adminAuth";

// Wraps every /admin/* route. The login page itself is exempt (it must
// render even with no session) - every other admin page redirects to
// /admin/login if there's no active Supabase Auth session.
export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    getSession().then((session) => {
      setAuthenticated(!!session);
      setChecked(true);
      if (!session && pathname !== "/admin/login") {
        router.replace("/admin/login");
      }
    });

    const subscription = onAuthStateChange((session) => {
      setAuthenticated(!!session);
      if (!session && pathname !== "/admin/login") {
        router.replace("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!checked) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!authenticated) {
    return null; // redirect is already in flight
  }

  return <>{children}</>;
}
