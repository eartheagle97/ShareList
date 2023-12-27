import {
  Button,
  Card,
  Divider,
  Icon,
  Input,
  Layout,
  List,
  Text,
} from "@ui-kitten/components";
import React, { useCallback, useEffect, useState } from "react";
import axios from "../../services/Api";
import { Alert, RefreshControl, ScrollView } from "react-native";
import color from "../../Colors.json";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../services/AuthProvider";

const ListSettings = ({ route, navigation }) => {
  const { user } = useAuth();
  const { listId, shoppingList, collaborator } = route.params;
  const [shopList, setShopList] = useState(shoppingList);
  const [collabUser, setCollabUser] = useState(collaborator);
  const [userEmail, setUserEmail] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [leaveConfirm, setLeaveConfirm] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchShoppingList(listId);
    }, [])
  );

  const fetchShoppingList = async (listId) => {
    axios
      .get(`/api/shopping-lists/${listId}`)
      .then((response) => {
        const { updatedshoppingList } = response.data;
        setShopList(updatedshoppingList);
      })
      .catch((error) => {
        console.error("Error fetching shopping list:", error.message);
      });
  };

  const handleAddUser = async () => {
    if (userEmail.trim() !== "") {
      await axios
        .put(`/api/shopping-lists/collaborators/${listId}`, {
          userEmail: userEmail,
          currentUser: shoppingList.user,
        })
        .then((response) => {
          const { collabUser } = response.data;
          setUserEmail("");
          setCollabUser(collabUser);
          setRefreshing(true);
        })
        .catch((error) => {
          Alert.alert("Error", error.response.data.error);
        });
    } else {
      Alert.alert(
        "Uh-Oh!",
        "Looks like you forgot to give your friend a name!"
      );
    }
  };

  const handleCollabDelete = async (CollabUserID) => {
    await axios
      .delete(`/api/shopping-lists/collaborators/${listId}/${CollabUserID}`)
      .then((response) => {
        const { collabUser, message } = response.data;
        setCollabUser(collabUser);
        setRefreshing(true);
        Alert.alert("Success", message);
      })
      .catch((error) => Alert.alert("Error", error));

    if (CollabUserID === user) {
      navigation.navigate("Home");
    }
  };

  const renderItem = ({ item, index }) => (
    <Card key={index} disabled={true} style={{ borderWidth: 0 }}>
      <Layout
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Layout style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon
            name="person-outline"
            style={{ width: 24, height: 24 }}
            fill="#3366fc"
          />
          <Layout style={{ marginLeft: 10 }}>
            <Text category="s1">
              {item.firstName} {item.lastName}{" "}
              {item._id === shoppingList.user ? "(Admin)" : ""}
            </Text>
            <Text category="c1">{item.email}</Text>
          </Layout>
        </Layout>
        {item._id === shopList.user ? (
          ""
        ) : (
          <Icon
            name="trash-2"
            style={{ width: 24, height: 24 }}
            fill="gray"
            onPress={() => handleCollabDelete(item._id)}
          />
        )}
      </Layout>
      {index === collabUser.length - 1 ? (
        ""
      ) : (
        <Divider style={{ marginTop: 8 }} />
      )}
    </Card>
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchCollaborations(listId);
    setRefreshing(false);
  }, [listId]);

  if (refreshing) {
    onRefresh();
  }

  const fetchCollaborations = async (listId) => {
    await axios
      .get(`/api/shopping-lists/collaborators/${listId}`)
      .then((response) => {
        const { collabUser } = response.data;
        setCollabUser(collabUser);
      })
      .catch((error) => {
        console.error("Could Refresh Collabs");
      });
  };

  useEffect(() => {
    fetchCollaborations(listId);
  }, [listId]);

  navigation.setOptions({
    title: "List Settings",
    headerBackTitleVisible: false,
    headerLeft: () => (
      <Icon
        style={{ width: 30, height: 35 }}
        name="arrow-ios-back-outline"
        fill="white"
        onPress={() => navigation.pop()}
      />
    ),
  });

  const ConfirmDelete = () => {
    Alert.alert("Hold on!", "Sure you wanna dump this list?", [
      {
        text: "Nah, Keep It",
        onPress: () => setDeleteConfirm(false),
        style: "cancel",
      },
      { text: "Yep, Trash It", onPress: () => setDeleteConfirm(true) },
    ]);
  };

  const ConfirmLeave = () => {
    Alert.alert("Hold on!", "Sure you wanna leave this group?", [
      {
        text: "Nah, Keep It",
        onPress: () => setLeaveConfirm(false),
        style: "cancel",
      },
      { text: "Yep, Leave It", onPress: () => setLeaveConfirm(true) },
    ]);
  };

  if (leaveConfirm) {
    handleCollabDelete(user);
    setLeaveConfirm(false);
    navigation.navigate("Home");
  }

  const handleListDelete = async () => {
    try {
      // Delete the shopping list using axios
      await axios.delete(`/api/shopping-lists/${listId}`);
      // Update the shoppingList state by filtering out the deleted item
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Error", "Error Deleting Shopping List..!");
    }
  };

  if (deleteConfirm) {
    handleListDelete();
    setDeleteConfirm(false);
  }
  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Layout>
        <Layout
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
          }}
        >
          <Text category="h6">{shopList.name}</Text>
          <Text
            category="s1"
            style={{ color: color.secondary }}
            onPress={() => navigation.navigate("UpdateListName", { shopList })}
          >
            Edit
          </Text>
        </Layout>
        <Divider />
        <Layout style={{ padding: 16 }}>
          <Text category="s2" style={{ marginBottom: 16 }}>
            Group Member
          </Text>
          <Layout
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Input
              label="Email"
              value={userEmail}
              onChangeText={setUserEmail}
              style={{ width: "80%" }}
            />
            <Button style={{ marginTop: 16 }} onPress={handleAddUser}>
              Add
            </Button>
          </Layout>
        </Layout>
        <Divider />
        <List
          data={collabUser}
          renderItem={renderItem}
          style={{ width: "100%" }}
        />
        <Divider />
        <Card
          style={{
            borderWidth: 0,
            backgroundColor: `${
              user === shopList.user ? "#f8f9fa" : color.white
            }`,
          }}
          onPress={ConfirmLeave}
          disabled={user === shopList.user ? true : false}
        >
          <Layout
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              marginVertical: 16,
              backgroundColor: "transparent",
            }}
          >
            <Icon
              name="corner-up-left-outline"
              fill={user === shopList.user ? color.light : color.primary}
              style={{ width: 24, height: 24 }}
            />
            <Layout
              style={{
                flexDirection: "column",
                marginLeft: 10,
                backgroundColor: "transparent",
              }}
            >
              <Text
                category="s1"
                style={{
                  color: `${
                    user === shopList.user ? color.light : color.primary
                  }`,
                }}
              >
                Leave Group
              </Text>
              {user === shopList.user ? (
                <Text
                  category="p2"
                  style={{ marginTop: 6, color: color.light }}
                >
                  Sorry You can't leave the group. You're Admin!
                </Text>
              ) : (
                ""
              )}
            </Layout>
          </Layout>
        </Card>
        <Divider />
        <Card style={{ borderWidth: 0 }} onPress={ConfirmDelete}>
          <Layout
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              marginVertical: 16,
              backgroundColor: "transparent",
            }}
          >
            <Icon
              name="trash-2"
              fill={color.secondary}
              style={{ width: 24, height: 24 }}
            />
            <Text
              category="s1"
              style={{ marginLeft: 10, color: color.secondary }}
            >
              Delete Group
            </Text>
          </Layout>
        </Card>
      </Layout>
    </ScrollView>
  );
};

export default ListSettings;
