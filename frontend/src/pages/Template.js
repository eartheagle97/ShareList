import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import CopyRight from "../components/CopyRight";
import Menu from "../components/Menu";
import NavBar from "../components/NavBar";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Template({ element, title }) {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <NavBar open={open} toggleDrawer={toggleDrawer} title={title} />
        <Menu toggleDrawer={toggleDrawer} open={open} />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          {element}
          <CopyRight
            sx={{
              py: 2,
              position: "fixed",
              bottom: "0",
              backgroundColor: "white",
              width: "100%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
