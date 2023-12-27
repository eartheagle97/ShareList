// src/App.js
import AuthProvider from "./provider/authProvider";
import Routes from "./routes";

const App = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};

export default App;
