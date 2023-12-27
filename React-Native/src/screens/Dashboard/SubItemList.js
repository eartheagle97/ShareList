import {
  Icon,
  Layout,
  Button,
  Modal,
  Text,
  Card,
  Divider,
  CheckBox,
} from "@ui-kitten/components";
import React, { useState, useEffect, useCallback } from "react";
import axios from "../../services/Api";
import { ScrollView, RefreshControl, Alert } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ItemListLayout from "./ItemListLayout";
import { useFocusEffect } from "@react-navigation/native";
import color from "../../Colors.json";
import LoadingScreen from "../../components/LoadingScreen";

const SubItemList = ({ route, navigation }) => {
  const { listId } = route.params;
  const [shoppingList, setShoppingList] = useState({});
  const [collaborator, setCollaborator] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saveChanges, setSaveChanges] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  console.log(collaborator);
  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchShoppingList(listId);
    }, [])
  );

  navigation.setOptions({
    title: "",
    headerLeft: () => (
      <Icon
        style={{ width: 30, height: 35 }}
        name="arrow-ios-back-outline"
        fill="white"
        onPress={() => navigation.navigate("Home")}
      />
    ),
    headerRight: () => (
      <MaterialCommunityIcons
        name="cog"
        color="white"
        size={30}
        onPress={() =>
          navigation.navigate("ListSettings", {
            listId,
            shoppingList,
            collaborator,
            setCollaborator,
            setShoppingList,
          })
        }
      />
    ),
  });

  const fetchShoppingList = async (listId) => {
    axios
      .get(`/api/shopping-lists/${listId}`)
      .then((response) => {
        const { collabUser, updatedshoppingList } = response.data;
        setShoppingList(updatedshoppingList);
        setCollaborator(collabUser);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching shopping list:", error.message);
      });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchShoppingList(listId);
    setRefreshing(false);
  }, [listId]);

  useEffect(() => {
    fetchShoppingList(listId);
  }, [listId]);

  const handleSave = async () => {
    await axios
      .put(`/api/shopping-lists/${shoppingList._id}`, shoppingList)
      .then((response) => {
        setShoppingList(response.data);
      })
      .catch((error) => {
        console.error("Error updating shopping list:", error.message);
      });
  };

  const handleDeleteAll = () => {
    setShoppingList((prevList) => ({
      ...prevList,
      subItems: [],
    }));
    Alert.alert("Hurrayy!", "You dump everything.");
    setSaveChanges(true);
  };

  const ConfirmDeleteAll = () => {
    if (shoppingList.subItems.length > 0) {
      Alert.alert("Hold on!", "Sure you wanna dump all items?", [
        {
          text: "Nah, Keep It",
          onPress: () => setDeleteConfirm(false),
          style: "cancel",
        },
        { text: "Yep, Trash It", onPress: () => setDeleteConfirm(true) },
      ]);
    } else {
      Alert.alert("Hold on!", "What are you trying to dump? list is empty!");
    }
  };

  if (deleteConfirm) {
    handleDeleteAll();
    setDeleteConfirm(false);
  }

  if (saveChanges) {
    console.log("Changes Saved");
    handleSave();
    setSaveChanges(false);
  }

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Layout>
            <Layout style={{ padding: 20 }}>
              <Text category="h3" style={{ color: color.primary }}>
                {shoppingList.name}
              </Text>
              <Text
                category="s2"
                style={{
                  color: color.light,
                  fontStyle: "italic",
                  marginBottom: 10,
                }}
              >
                Created By {collaborator[0].firstName} on{" "}
                {new Date(shoppingList.dateCreated).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }
                )}
              </Text>
              <Text category="p1" style={{ marginBottom: 10 }}>
                Total Items : {shoppingList?.subItems?.length}
              </Text>
              <Text category="p1" style={{ marginBottom: 10 }}>
                Purchased Items :{" "}
                {
                  shoppingList?.subItems?.filter((item) => item.purchased)
                    .length
                }
              </Text>
              <Text
                category="s2"
                style={{
                  color: color.light,
                  fontStyle: "italic",
                  marginBottom: 10,
                }}
              >
                Last Modified:{" "}
                {new Date(shoppingList.lastModified).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour12: true,
                    hour: "numeric",
                    minute: "numeric",
                  }
                )}
              </Text>
            </Layout>
            <Divider />
            <Layout
              style={{
                flexDirection: "row",
                padding: 10,
                justifyContent: "space-evenly",
              }}
            >
              <Button
                style={{
                  backgroundColor: color.primary,
                  borderWidth: 0,
                }}
                size="small"
                accessoryLeft={
                  <Icon
                    name="plus"
                    style={{ width: 20, height: 24 }}
                    fill={color.white}
                  />
                }
                onPress={() =>
                  navigation.navigate("AddItems", { shoppingList })
                }
              >
                Add Items
              </Button>
              <Button
                style={{
                  backgroundColor: color.secondary,
                  borderWidth: 0,
                  width: 140,
                }}
                size="small"
                accessoryLeft={
                  <Icon
                    name="trash-2-outline"
                    style={{ width: 20, height: 24 }}
                    fill={color.white}
                  />
                }
                onPress={ConfirmDeleteAll}
              >
                Delete All
              </Button>
            </Layout>
            <Divider />
            <ItemListLayout
              height={500}
              isLoading={isLoading}
              shoppingList={shoppingList}
              setShoppingList={setShoppingList}
              setSaveChanges={setSaveChanges}
            />
          </Layout>
        </ScrollView>
      )}
    </>
  );
};

export default SubItemList;
