import React, { useCallback, useState } from "react";
import {
  Card,
  Divider,
  Icon,
  Layout,
  Spinner,
  Text,
} from "@ui-kitten/components";
import { useAuth } from "../../services/AuthProvider";
import axios from "../../services/Api";
import color from "../../Colors.json";
import { useFocusEffect } from "@react-navigation/native";

const Setting = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getUserDetails = async () => {
    try {
      if (user) {
        const response = await axios.get(`/auth/user/${user}`);
        const { userDetails } = response.data;
        setUserData(userDetails);
      }
    } catch (error) {
      console.error("Error fetching User Data");
    }
  };

  useFocusEffect(
    useCallback(() => {
      getUserDetails();
      setIsLoading(false);
    }, [])
  );

  return (
    <Layout style={{ flex: 1, justifyContent: "space-between", padding: 20 }}>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Layout>
            <Text category="h4" style={{ marginBottom: 16 }}>
              Hello, {userData.firstName}!
            </Text>
            <Card disabled>
              <Layout
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center ",
                }}
              >
                <Text
                  category="h6"
                  style={{ color: color.primary, marginBottom: 10 }}
                >
                  Profile
                </Text>
                <Icon
                  name="edit-2-outline"
                  fill={color.secondary}
                  style={{ width: 24, height: 24 }}
                  onPress={() =>
                    navigation.navigate("UpdateProfile", { userData })
                  }
                />
              </Layout>
              <Layout style={{}}>
                <Text category="p2" style={{ color: color.light }}>
                  Name :{" "}
                </Text>
                <Text category="p1">
                  {userData.firstName} {userData.lastName}
                </Text>
              </Layout>
              <Divider style={{ marginVertical: 10 }} />
              <Layout>
                <Text category="p2" style={{ color: color.light }}>
                  Email :{" "}
                </Text>
                <Text category="p1">{userData.email}</Text>
              </Layout>
              <Divider style={{ marginVertical: 10 }} />
              <Layout>
                <Text category="p2" style={{ color: color.light }}>
                  Mobile Number :{" "}
                </Text>
                <Text category="p1">+{userData.phoneNumber}</Text>
              </Layout>
            </Card>
            <Card
              style={{ marginTop: 16 }}
              onPress={() => navigation.navigate("UpdatePassword")}
            >
              <Layout
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "transparent",
                }}
              >
                <Text>Change Password</Text>
                <Icon
                  name="arrow-ios-forward-outline"
                  fill="black"
                  style={{ width: 24, height: 24 }}
                />
              </Layout>
            </Card>
          </Layout>
          <Card onPress={logout}>
            <Layout
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "transparent",
              }}
            >
              <Icon
                name="trash-2-outline"
                fill={color.secondary}
                style={{ width: 24, height: 24 }}
              />
              <Text
                category="s1"
                style={{ marginLeft: 15, color: color.secondary }}
              >
                Logout
              </Text>
            </Layout>
          </Card>
        </>
      )}

      {/* <Button onPress={logout}>Logout</Button> */}
    </Layout>
  );
};

export default Setting;
