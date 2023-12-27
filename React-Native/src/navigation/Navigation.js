import { NavigationContainer } from "@react-navigation/native";
import BottomTab from "./BottomTab";
import AuthStack from "./AuthStack";
import { useAuth } from "../services/AuthProvider";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SubItemList from "../screens/Dashboard/SubItemList";
import ListSettings from "../screens/Dashboard/ListSettings";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { token } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <>
            <Stack.Screen name="MainTabs" component={BottomTab} />
            <Stack.Screen
              name="SubitemsScreen"
              component={SubItemList}
              options={{
                headerShown: true,
              }}
            />
            <Stack.Screen
              name="ListSettings"
              component={ListSettings}
              options={{ headerShown: true }}
            />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
