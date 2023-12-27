import React, { useCallback, useEffect, useState } from "react";
import {
  Layout,
  Card,
  Text,
  OverflowMenu,
  MenuItem,
  Icon,
} from "@ui-kitten/components";
import { useAuth } from "../../services/AuthProvider";
import axios from "../../services/Api";
import { Alert, RefreshControl, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const Home = ({ navigation }) => {
  const { user } = useAuth();
  const [shoppingList, setShoppingList] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [listToDelete, setListToDelete] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchShoppingLists();
    setRefreshing(false);
  }, [user]);

  const fetchShoppingLists = async () => {
    try {
      if (user) {
        const response = await axios.get(`/api/shopping-lists/user/${user}`);
        const shoppingLists = response.data;
        setShoppingList(shoppingLists);
      }
    } catch (error) {
      console.error("Error fetching shopping lists:", error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchShoppingLists();
    }, [])
  );

  useEffect(() => {
    fetchShoppingLists();
    navigation.setOptions({
      headerRight: () => (
        <Icon
          onPress={() => navigation.navigate("NewList")}
          name="plus-square-outline"
          fill="white"
          style={{ width: 24, height: 24, marginRight: 16 }}
        />
      ),
    });
  }, [navigation, user]);

  const handleMenuAction = async (index) => {
    try {
      const selectedList = shoppingList[selectedIndex];
      switch (index) {
        case 0: // Edit
          navigation.navigate("UpdateListName", { shopList: selectedList });
          break;
        case 1: // Delete
          setListToDelete(selectedList._id);
          ConfirmDelete();
          break;
        default:
          break;
      }
      setMenuVisible(false);
    } catch (error) {
      console.error("Error handling menu action:", error.message);
    }
  };

  const renderMenuIcon = (props) => (
    <Icon {...props} name="more-vertical-outline" fill="black" />
  );

  const renderEditIcon = (props) => (
    <Icon {...props} name="edit-2-outline" fill="black" />
  );

  const renderDeleteIcon = (props) => (
    <Icon {...props} name="trash-2-outline" fill="black" />
  );

  const renderMenuItems = () => [
    <MenuItem
      key={0}
      title="Rename"
      onPress={() => handleMenuAction(0)}
      accessoryLeft={renderEditIcon}
    />,
    <MenuItem
      key={1}
      title="Delete"
      onPress={() => handleMenuAction(1)}
      accessoryLeft={renderDeleteIcon}
    />,
  ];

  const handleListDelete = async () => {
    try {
      // Delete the shopping list using axios
      await axios.delete(`/api/shopping-lists/${listToDelete}`);
      // Update the shoppingList state by filtering out the deleted item
      setShoppingList((prevLists) =>
        prevLists.filter((item) => item._id !== listToDelete)
      );
      Alert.alert("Success", "Shopping List Deleted Successfully..!");
    } catch (error) {
      Alert.alert("Error", "Error Deleting Shopping List..!");
    }
  };

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

  if (deleteConfirm) {
    handleListDelete();
    setDeleteConfirm(false);
  }

  const handleShoppingListPress = (listId) => {
    navigation.navigate("SubitemsScreen", { listId });
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Layout
        style={{
          height: 750,
          padding: 20,
        }}
      >
        <Text category="h4" style={{ textAlign: "left", marginBottom: 16 }}>
          My Lists
        </Text>
        {shoppingList.length > 0 ? (
          <>
            {shoppingList.map((list, index) => {
              return (
                <Card
                  style={{ width: "100%", marginBottom: 16 }}
                  key={list._id}
                  onPress={() => handleShoppingListPress(list._id)}
                >
                  <Layout
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Text category="h6" style={{ marginBottom: 10 }}>
                      {list.name}
                    </Text>
                    <OverflowMenu
                      visible={menuVisible && selectedIndex === index}
                      anchor={() =>
                        renderMenuIcon({
                          onPress: () => {
                            setMenuVisible(true);
                            setSelectedIndex(index);
                          },
                          style: { width: 24, height: 24 },
                        })
                      }
                      onSelect={(index) => handleMenuAction(index)}
                      onBackdropPress={() => setMenuVisible(false)}
                    >
                      {renderMenuItems()}
                    </OverflowMenu>
                  </Layout>
                  <Text category="c1">
                    {list.subItems.length} Items | {list.collaborators.length}{" "}
                    Collaboratos
                  </Text>
                </Card>
              );
            })}
          </>
        ) : (
          <Text
            style={{
              textAlign: "center",
              color: "gray",
            }}
          >
            No shopping lists available.
          </Text>
        )}
      </Layout>
    </ScrollView>
  );
};

export default Home;
