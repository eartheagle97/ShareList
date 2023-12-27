import { Icon, Input, Layout, Text } from "@ui-kitten/components";
import React, { useState } from "react";
import axios from "../../services/Api";
import { Alert } from "react-native";

const UpdateProfile = ({ route, navigation }) => {
  const { userData } = route.params;
  console.log(userData);
  const [updateUserData, setUpdateUserData] = useState(userData);

  const handleTextChange = (key, value) => {
    setUpdateUserData((prevData) => ({ ...prevData, [key]: value }));
  };
  console.log(updateUserData);

  const handleUpdate = () => {
    axios
      .put("/auth/Updateprofile", { updateUserData })
      .then((response) => {
        Alert.alert("Success", response.data.message);
        navigation.pop();
      })
      .catch((error) => {
        Alert.alert("Error", error.response.data.error);
      });
  };

  navigation.setOptions({
    title: "Update Profile",
    headerRight: () => (
      <Text category="s1" style={{ color: "white" }} onPress={handleUpdate}>
        Update
      </Text>
    ),
    headerLeft: () => (
      <Icon
        style={{ width: 30, height: 35 }}
        name="arrow-ios-back-outline"
        fill="white"
        onPress={() => navigation.pop()}
      />
    ),
  });

  return (
    <Layout
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Input
        label="First Name"
        style={{ marginBottom: 16 }}
        value={updateUserData.firstName}
        onChangeText={(text) => handleTextChange("firstName", text)}
      />
      <Input
        label="Last Name"
        style={{ marginBottom: 16 }}
        value={updateUserData.lastName}
        onChangeText={(text) => handleTextChange("lastName", text)}
      />
      <Input
        label="Email"
        style={{ marginBottom: 16 }}
        value={userData.email}
        disabled
      />
      <Input
        label="Mobile Number"
        style={{ marginBottom: 16 }}
        value={updateUserData.phoneNumber}
        onChangeText={(text) => handleTextChange("phoneNumber", text)}
      />
    </Layout>
  );
};

export default UpdateProfile;
