import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Dashboard/Home";
import SubItemList from "../screens/Dashboard/SubItemList";
import ListSettings from "../screens/Dashboard/ListSettings";
import NewList from "../screens/Dashboard/NewList";
import UpdateListName from "../screens/Dashboard/UpdateListName";
import color from "../Colors.json";
import AddItemForm from "../screens/Dashboard/AddItemForm";

const Stack = createNativeStackNavigator();

const ListNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
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
        name="NewList"
        component={NewList}
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
        name="UpdateListName"
        component={UpdateListName}
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
        name="AddItems"
        component={AddItemForm}
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
        name="SubitemsScreen"
        component={SubItemList}
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
        name="ListSettings"
        component={ListSettings}
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

export default ListNavigation;
