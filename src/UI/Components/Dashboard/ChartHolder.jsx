import * as React from "react";
import { Grid } from "@mui/material";
import ChartContainer from "./Chart";

export default function ChartHolder({tasks}) {

  return (

    <Grid
        container
        sx={{
          display: 'flex',
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '60%',
          position: 'absolute',
          top: '10px',
          left: '0'
        }}
      >
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <ChartContainer tasks={tasks} dayOfCompletion={"Today's Tasks"} />
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <ChartContainer tasks={tasks} dayOfCompletion={"Tomorrow's Tasks"} />
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <ChartContainer tasks={tasks} dayOfCompletion={"Future Tasks"} />
        </Grid>
      </Grid>
  );
}