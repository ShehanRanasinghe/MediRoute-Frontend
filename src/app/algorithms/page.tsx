import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Link from "next/link";

// Array lists each algorithm demo page so the user can switch between them quickly.
// Each entry points to a single algorithm demo that can be tested independently during viva or review.
const PAGES = [
  { title: "Route Comparison", desc: "Dijkstra vs A* pathfinding", href: "/routing" },
  { title: "Resource Allocation", desc: "Greedy vs Knapsack DP", href: "/allocation" },
  { title: "Network Resilience", desc: "Critical nodes, backbone network, centrality ranking", href: "/network" },
  { title: "Hospital Ranking", desc: "Bounded min-heap vs full sort", href: "/decision" },
  { title: "Dispatch Optimization", desc: "Dynamic Programming vs Backtracking vs Greedy", href: "/optimization" },
];

// The index card layout makes each algorithm easy to compare during demonstrations and viva sessions.
// The card grid gives a quick overview of the comparison pages so the evaluator can switch between problems easily.
export default function AlgorithmsIndexPage() {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Algorithm Explorer</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Run each algorithm individually and compare approaches directly - useful for testing,
        benchmarking, and demonstrating individual components.
      </Typography>
      <Grid container spacing={2}>
        {PAGES.map((p) => (
          <Grid size={{ xs: 12, sm: 6 }} key={p.href}>
            <Card variant="outlined">
              <Link href={p.href} style={{ display: "block", color: "inherit", textDecoration: "none" }}>
                <CardActionArea component="div">
                  <CardContent>
                    <Typography variant="h6">{p.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{p.desc}</Typography>
                  </CardContent>
                </CardActionArea>
              </Link>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
