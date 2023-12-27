import * as React from "react";
import { Grid, Paper } from "@mui/material";

export default function Dashboard() {
  return (
    <>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>Dashboard</div>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
