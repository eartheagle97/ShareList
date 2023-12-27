import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import Navigation from "./src/navigation/Navigation";
import AuthProvider from "./src/services/AuthProvider";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

export default function App() {
  return (
    <AuthProvider>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <Navigation />
      </ApplicationProvider>
    </AuthProvider>
  );
}
