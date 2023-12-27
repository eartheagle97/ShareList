import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Setting from "../screens/Settings/Setting";
import color from "../Colors.json";
import UpdatePassword from "../screens/Settings/UpdatePassword";
import UpdateProfile from "../screens/Settings/UpdateProfile";

const Stack = createNativeStackNavigator();

const AppSettings = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={{
          headerStyle: {
            backgroundColor: color.primary,
          },
          headerTitleStyle: {
            color: color.white,
          },
        }}
      />
      <Stack.Screen
        name="UpdatePassword"
        component={UpdatePassword}
        options={{
          headerStyle: {
            backgroundColor: color.primary,
          },
          headerTitleStyle: {
            color: color.white,
          },
        }}
      />
      <Stack.Screen
        name="UpdateProfile"
        component={UpdateProfile}
        options={{
          headerStyle: {
            backgroundColor: color.primary,
          },
          headerTitleStyle: {
            color: color.white,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default AppSettings;
