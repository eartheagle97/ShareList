import React, { useState, useRef, useEffect } from "react";
import { Icon, Input, Layout, Text } from "@ui-kitten/components";
import { useAuth } from "../../services/AuthProvider";
import axios from "../../services/Api";
import { Alert } from "react-native";

const NewList = ({ navigation }) => {
  const inputRef = useRef(null);
  const { user } = useAuth();
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    // Focus on the input when the component mounts
    inputRef.current.focus();
  }, []);
  console.log(new Date());
  const handleCreateShoppingList = async () => {
    if (newListName === "") {
      Alert.alert("Uh-Oh!", "Looks like you forgot to give your list a name!");
      return;
    }

    if (newListName.trim() !== "") {
      const newshoppingList = {
        user: user,
        name: newListName,
        subitems: [],
        collaborators: [user],
        dateCreated: new Date(),
        lastModified: new Date(),
      };
      await axios
        .post("/api/shopping-lists", newshoppingList)
        .then((response) => {
          const { _id } = response.data;
          setNewListName("");
          navigation.navigate("SubitemsScreen", { listId: _id });
        })
        .catch((error) => {});
    }
  };

  navigation.setOptions({
    title: "Create a list",
    headerRight: () => (
      <Text
        category="s1"
        style={{ color: "white" }}
        onPress={handleCreateShoppingList}
      >
        Done
      </Text>
    ),
    headerLeft: () => (
      <Icon
        style={{ width: 30, height: 35 }}
        name="arrow-ios-back-outline"
        fill="white"
        onPress={() => navigation.navigate("Home")}
      />
    ),
  });

  return (
    <Layout style={{ flex: 1, padding: 20 }}>
      <Input
        ref={inputRef}
        label="List Name"
        size="large"
        onChangeText={setNewListName}
        value={newListName}
      />
    </Layout>
  );
};

export default NewList;
