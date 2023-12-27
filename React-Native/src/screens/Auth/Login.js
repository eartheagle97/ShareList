import React, { useState, useRef } from "react";
import { Button, Icon, Input, Layout, Text } from "@ui-kitten/components";
import { useAuth } from "../../services/AuthProvider";
import axios from "../../services/Api";
import { useNavigation } from "@react-navigation/native";
import {
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  Alert,
  Image,
} from "react-native";
import color from "../../Colors.json";
import Logo from "../../../assets/Logo.png";

const Login = () => {
  const navigation = useNavigation();
  const inputRefs = useRef([]);
  const { setUser, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const handleInputFocus = (index) => {
    if (inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    } else {
      // If there is no next input, close the keyboard
      Keyboard.dismiss();
    }
  };

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon
        {...props}
        name={secureTextEntry ? "eye-off" : "eye"}
        fill={color.secondary}
      />
    </TouchableWithoutFeedback>
  );

  const handleLogin = () => {
    const validationErrors = {};

    if (email === "") {
      validationErrors.email = "danger";
    }

    if (password === "") {
      validationErrors.password = "danger";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    axios
      .post("/auth/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        const { user, token } = response.data;
        login(token);
        setUser(user.id);
        console.log(token);
        console.log(user.id);
        navigation.navigate("BottomTab", { screen: "Home" });
      })
      .catch((error) => {
        if (error.response) {
          Alert.alert("Error", error.response.data.error);
        }
      });
  };

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
            style={{ backgroundColor: color.primary, alignItems: "center" }}
          >
            <Image
              source={Logo}
              style={{ width: 255, height: 49, marginBottom: 50, padding: 20 }}
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
              style={{ alignItems: "center", marginBottom: 100, marginTop: 25 }}
            >
              <Text
                category="h3"
                style={{ color: color.black, marginBottom: 10 }}
              >
                Welcome Back!
              </Text>
              <Layout style={{ flexDirection: "row" }}>
                <Text style={{ color: color.light }}>
                  Don't have an account?{" "}
                </Text>
                <Text
                  style={{ color: color.secondary }}
                  onPress={() => navigation.navigate("Register")}
                >
                  Register
                </Text>
              </Layout>
            </Layout>
            <Layout>
              <Input
                label="E-mail"
                status={errors.email ? errors.email : "basic"}
                placeholder="abc@example.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors({ ...errors, email: undefined });
                }}
                size="large"
                accessoryLeft={
                  <Icon name="email-outline" fill={color.secondary} />
                }
                ref={(ref) => (inputRefs.current[0] = ref)}
                returnKeyType="next"
                onSubmitEditing={() => handleInputFocus(0)}
                style={{ marginVertical: 10 }}
              />
              <Input
                label="Password"
                status={errors.password ? errors.password : "basic"}
                placeholder="********"
                secureTextEntry={secureTextEntry}
                value={password}
                size="large"
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors({ ...errors, password: undefined });
                }}
                accessoryLeft={
                  <Icon name="lock-outline" fill={color.secondary} />
                }
                accessoryRight={renderIcon}
                ref={(ref) => (inputRefs.current[1] = ref)}
                returnKeyType="done"
                onSubmitEditing={() => handleInputFocus(1)}
                style={{ marginVertical: 16 }}
              />
            </Layout>
            <Layout style={{ alignItems: "flex-end", marginBottom: 20 }}>
              <Text style={{ color: color.secondary }}>Forget Password?</Text>
            </Layout>
            <Button
              onPress={handleLogin}
              style={{
                marginTop: 16,
                backgroundColor: color.primary,
                borderColor: color.primary,
              }}
            >
              Login
            </Button>
            <Layout style={{ alignItems: "center", marginTop: 100 }}></Layout>
          </Layout>
        </Layout>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
