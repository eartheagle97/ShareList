import { Text, Icon, Layout, Input } from "@ui-kitten/components";
import React, { useRef, useState } from "react";
import { Alert } from "react-native";
import axios from "../../services/Api";

const UpdateListName = ({ route, navigation }) => {
  const { shopList } = route.params;
  const inputRef = useRef(null);
  const [updateShoppingList, setUpdateShoppingList] = useState(shopList);
  const [newListName, setNewListName] = useState(shopList.name);
  const [saveChanges, setSaveChanges] = useState(false);

  navigation.setOptions({
    title: "Change list name",
    headerBackTitleVisible: false,
    headerLeft: () => (
      <Icon
        style={{ width: 30, height: 35 }}
        name="arrow-ios-back-outline"
        fill="white"
        onPress={() => navigation.pop()}
      />
    ),
    headerRight: () => (
      <Text
        category="s1"
        style={{ color: "white" }}
        onPress={handleTitleUpdate}
      >
        Done
      </Text>
    ),
  });

  const handlesave = async () => {
    await axios
      .put(`/api/shopping-lists/${shopList._id}`, updateShoppingList)
      .then((response) => {
        setUpdateShoppingList(response.data);
      })
      .catch((error) => {
        console.error("Error updating shopping list:", error.message);
      });
  };

  const handleTitleUpdate = () => {
    if (newListName !== "") {
      setUpdateShoppingList((prevList) => ({
        ...prevList,
        name: newListName,
      }));
      setSaveChanges(true);
    } else {
      Alert.alert("Uh-Oh!", "Looks like you forgot to give your list a name!");
    }
  };

  if (saveChanges) {
    handlesave();
    setSaveChanges(false);
    navigation.pop();
  }

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

export default UpdateListName;
