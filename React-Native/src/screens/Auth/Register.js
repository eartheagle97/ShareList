import React, { useState, useRef } from "react";
import axios from "../../services/Api";
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  Alert,
  Image,
} from "react-native";
import { Button, Input, Layout, Text, Icon } from "@ui-kitten/components";
import color from "../../Colors.json";
import Logo from "../../../assets/Logo.png";

const Register = ({ navigation }) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const inputRefs = useRef([]);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (key, value) => {
    setNewUser({ ...newUser, [key]: value });

    // Clear validation errors when the user types in the corresponding field
    setErrors({ ...errors, [key]: undefined });
  };

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? "eye-off" : "eye"} />
    </TouchableWithoutFeedback>
  );

  const handleRegister = () => {
    const validationErrors = {};

    if (newUser.firstName === "") {
      validationErrors.firstName = "danger";
    }
    if (newUser.lastName === "") {
      validationErrors.lastName = "danger";
    }

    if (newUser.phoneNumber === "" || newUser.phoneNumber.length < 10) {
      validationErrors.phoneNumber = "danger";
    }

    if (!isValidEmail(newUser.email)) {
      validationErrors.email = "danger";
    }

    if (newUser.password.length < 8) {
      validationErrors.password = "danger";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    axios
      .post("/auth/register", newUser)
      .then((response) => {
        const data = response.data;
        if (data.message) {
          Alert.alert("Success", data.message);
        } else {
          Alert.alert("Error", data.error);
        }
      })
      .catch((error) => {
        if (error.response) {
          Alert.alert("Error", error.response.data.error);
        }
      });
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputFocus = (index) => {
    if (inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    } else {
      // If there is no next input, close the keyboard
      Keyboard.dismiss();
    }
  };

  const inputFields = [
    {
      label: "First Name",
      placeholder: "First Name",
      key: "firstName",
      keyboardType: "default",
      secureTextEntry: false,
    },
    {
      label: "Last Name",
      placeholder: "Last Name",
      key: "lastName",
      keyboardType: "default",
      secureTextEntry: false,
    },
    {
      label: "Mobile Number",
      placeholder: "Mobile Number",
      key: "phoneNumber",
      keyboardType: "numeric",
      secureTextEntry: false,
    },
    {
      label: "Email",
      placeholder: "Email",
      key: "email",
      keyboardType: "email-address",
      secureTextEntry: false,
    },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Layout
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            backgroundColor: color.primary,
          }}
        >
          <Layout
            style={{
              backgroundColor: color.primary,
              alignItems: "center",
              marginBottom: -50,
            }}
          >
            <Image
              source={Logo}
              style={{ width: 255, height: 49, padding: 20 }}
            />
          </Layout>
          <Layout
            style={{
              backgroundColor: color.white,
              opacity: 0.4,
              width: "95%",
              borderRadius: 50,
              height: 100,
              position: "relative",
              zIndex: 9,
              top: 85,
            }}
          >
            <Text> </Text>
          </Layout>
          <Layout
            style={{
              width: "100%",
              backgroundColor: color.white,
              padding: 25,
              borderRadius: 50,
              borderEndEndRadius: 0,
              borderEndStartRadius: 0,
              zIndex: 99,
            }}
          >
            <Layout
              style={{ alignItems: "center", marginBottom: 25, marginTop: 25 }}
            >
              <Text
                category="h3"
                style={{ color: color.black, marginBottom: 10 }}
              >
                Create an account.
              </Text>
              <Layout style={{ flexDirection: "row" }}>
                <Text style={{ color: color.light }}>Already a member? </Text>
                <Text
                  style={{ color: color.secondary }}
                  onPress={() => navigation.navigate("Login")}
                >
                  Sign in
                </Text>
              </Layout>
            </Layout>

            <Layout>
              {inputFields.map((field, index) => (
                <Input
                  key={field.key}
                  label={field.label}
                  size="large"
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  returnKeyType="next"
                  onSubmitEditing={() => handleInputFocus(index)}
                  placeholder={field.placeholder}
                  keyboardType={field.keyboardType}
                  secureTextEntry={field.secureTextEntry}
                  status={errors[field.key] ? errors[field.key] : "basic"}
                  value={newUser[field.key]}
                  maxLength={field.key === "phoneNumber" ? 10 : 25}
                  onChangeText={(text) => handleInputChange(field.key, text)}
                  style={{ marginVertical: 10 }}
                />
              ))}
              <Input
                label="Password"
                size="large"
                placeholder="********"
                value={newUser.password}
                onChangeText={(text) => handleInputChange("password", text)}
                secureTextEntry={secureTextEntry}
                accessoryRight={renderIcon}
                status={errors.password ? errors.password : "basic"}
                style={{ marginVertical: 10 }}
                caption={
                  <Layout>
                    <Text
                      style={{
                        marginTop: 10,
                        fontSize: 12,
                        fontWeight: 400,
                        color: "#8F9BB3",
                      }}
                    >
                      Min. 8 Characters
                    </Text>
                  </Layout>
                }
                ref={(ref) => (inputRefs.current[4] = ref)}
                returnKeyType="done"
                onSubmitEditing={() => handleInputFocus(4)}
              />
            </Layout>
            <Button
              onPress={handleRegister}
              style={{ marginBottom: 50, marginTop: 16 }}
              size="large"
            >
              Create Account
            </Button>
          </Layout>
        </Layout>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;
