import { Input, Layout, Button, Icon, Text } from "@ui-kitten/components";
import React, { useState } from "react";
import { Alert, TouchableWithoutFeedback } from "react-native";
import color from "../../Colors.json";
import { useAuth } from "../../services/AuthProvider";
import axios from "../../services/Api";

const UpdatePassword = ({ navigation }) => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState({
    currentPassword: true,
    newPassword: true,
    confirmPassword: true,
  });

  const toggleSecureEntry = (text) => {
    setSecureTextEntry((prev) => ({
      ...prev,
      [text]: !prev[text],
    }));
  };

  const renderIcon = (text) => (
    <TouchableWithoutFeedback onPress={() => toggleSecureEntry(text)}>
      <Icon
        name={secureTextEntry[text] ? "eye-off" : "eye"}
        style={{ width: 24, height: 24 }}
        fill={color.primary}
      />
    </TouchableWithoutFeedback>
  );

  navigation.setOptions({
    title: "Change your password",
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

  const handleErrors = (key) => {
    setErrors({ ...errors, [key]: undefined });
  };

  const handlePasswordMatching = () => {
    if (newPassword === confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        newPassword: undefined,
        confirmPassword: undefined,
      }));
    }
  };

  const handleUpdate = () => {
    const validationErrors = {};

    if (currentPassword.trim() === "" || currentPassword.length < 2) {
      validationErrors.currentPassword = "danger";
    }

    if (newPassword.trim() === "" || newPassword.length < 8) {
      validationErrors.newPassword = "danger";
    }

    if (currentPassword == newPassword) {
      validationErrors.currentPassword = "danger";
      validationErrors.newPassword = "danger";
    }

    if (confirmPassword.trim() === "" || confirmPassword.length < 8) {
      validationErrors.confirmPassword = "danger";
    }

    if (newPassword != confirmPassword) {
      validationErrors.newPassword = "danger";
      validationErrors.confirmPassword = "danger";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    axios
      .put("/auth/UpdatePassword", { user, currentPassword, newPassword })
      .then((response) => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        Alert.alert("Success", response.data.message);
        navigation.pop();
      })
      .catch((error) => {
        Alert.alert("Error", error.response.data.error);
      });
  };

  return (
    <Layout style={{ flex: 1, padding: 20 }}>
      <Input
        label="Current Password"
        style={{ marginBottom: 16 }}
        value={currentPassword}
        onChangeText={(text) => {
          setCurrentPassword(text);
          handleErrors("currentPassword");
        }}
        accessoryRight={renderIcon("currentPassword")}
        secureTextEntry={secureTextEntry.currentPassword}
        status={errors.currentPassword ? errors.currentPassword : "basic"}
      />
      <Input
        label="Enter New Password"
        style={{ marginBottom: 16 }}
        value={newPassword}
        onChangeText={(text) => {
          setNewPassword(text);
          handleErrors("newPassword");
          handlePasswordMatching();
        }}
        accessoryRight={renderIcon("newPassword")}
        secureTextEntry={secureTextEntry.newPassword}
        status={errors.newPassword ? errors.newPassword : "basic"}
      />
      <Input
        label="Re-Enter New Password"
        style={{ marginBottom: 16 }}
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          handleErrors("confirmPassword");
          handlePasswordMatching();
        }}
        accessoryRight={renderIcon("confirmPassword")}
        secureTextEntry={secureTextEntry.confirmPassword}
        status={errors.confirmPassword ? errors.confirmPassword : "basic"}
      />
    </Layout>
  );
};

export default UpdatePassword;
