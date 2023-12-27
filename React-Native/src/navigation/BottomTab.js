import Home from "../screens/Dashboard/Home";
import Setting from "../screens/Settings/Setting";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import color from "../Colors.json";
import ListNavigation from "./ListNavigation";
import AppSettings from "./AppSettings";
const Tab = createMaterialBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor={color.primary}
      inactiveColor={color.light}
      barStyle={{
        backgroundColor: "white",
        borderTopWidth: 0.2,
        borderBlockColor: color.light,
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={ListNavigation}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingScreen"
        component={AppSettings}
        options={{
          tabBarLabel: "Setting",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cogs" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;
