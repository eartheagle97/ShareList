import { IconButton, Snackbar } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AlertMessage = ({ alertMessage, setAlertMessage }) => {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertMessage((prevState) => ({
      ...prevState,
      open: false,
    }));
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const vertical = "bottom";
  const horizontal = "center";

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={alertMessage.open}
      autoHideDuration={3000}
      onClose={handleClose}
      action={action}
    >
      <Alert
        onClose={handleClose}
        severity={alertMessage.type}
        sx={{ width: "100%" }}
      >
        {alertMessage.message}
      </Alert>
    </Snackbar>
  );
};

export default AlertMessage;
