import React from "react";
import { Breadcrumbs } from "@mui/material";

const BreadcrumbsUrl = ({ breadcrumbs }) => {
  return (
    <Breadcrumbs
      separator="/"
      aria-label="breadcrumb"
      sx={{ mb: 2 }}
      fontSize="small"
    >
      {breadcrumbs}
    </Breadcrumbs>
  );
};

export default BreadcrumbsUrl;
