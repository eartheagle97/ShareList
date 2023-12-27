import { Layout, Spinner } from "@ui-kitten/components";
import React from "react";

const LoadingScreen = () => {
  return (
    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Spinner />
    </Layout>
  );
};

export default LoadingScreen;
