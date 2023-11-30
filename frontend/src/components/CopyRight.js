import React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const CopyRight = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"© "}
      {new Date().getFullYear()}{" "}
      <Link color="inherit" href="#">
        ShareLister
      </Link>
      {"."} | All rights reserved.
    </Typography>
  );
};

export default CopyRight;
