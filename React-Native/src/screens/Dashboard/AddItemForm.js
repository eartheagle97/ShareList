import {
  Input,
  Layout,
  Text,
  Select,
  SelectItem,
  Button,
  IndexPath,
  Icon,
} from "@ui-kitten/components";
import React, { useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import color from "../../Colors.json";
import axios from "../../services/Api";
import ItemListLayout from "./ItemListLayout";
import { Alert } from "react-native";

const AddItemForm = ({ route, navigation }) => {
  const { shoppingList } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [shopList, setShopList] = useState(shoppingList);
  const [newShopList, setNewShopList] = useState({
    subItems: [],
  });
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [saveChanges, setSaveChanges] = useState(false);
  const [newSubItem, setNewSubItem] = useState({
    name: "",
    qty: 1,
    qtyUnit: "ct",
    notes: "",
    purchased: false,
  });

  console.log(shoppingList);

  const handleTextChange = (key, value) => {
    setNewSubItem({ ...newSubItem, [key]: value });
  };

  const handleAddItem = () => {
    if (newSubItem.name) {
      const updatedShoppingList = { ...shopList };
      updatedShoppingList.subItems.push(newSubItem);
      updatedShoppingList.lastModified = new Date();
      newShopList.subItems.push(newSubItem);
      setShopList(updatedShoppingList);
      setNewSubItem({
        name: "",
        qty: 1,
        qtyUnit: "ct",
        notes: "",
        purchased: false,
      });
      setSelectedIndex(new IndexPath(0));
    } else {
      Alert.alert("Uh-Oh!", "Looks like you forgot to give your item a name!");
    }
  };

  const handleSave = async () => {
    await axios
      .put(`/api/shopping-lists/${shoppingList._id}`, shopList)
      .then((response) => {
        setShopList(response.data);
      })
      .catch((error) => {
        console.error("Error updating shopping list:", error.message);
      });
  };

  if (saveChanges) {
    console.log("Changes Saved");
    handleSave();
    setSaveChanges(false);
    navigation.pop();
  }

  const qtyUnits = ["ct", "LB", "GL", "Unit"];

  const handleQtyUnitSelect = (index) => {
    const selectedQtyUnit = qtyUnits[index.row];
    setNewSubItem((prev) => ({ ...prev, qtyUnit: selectedQtyUnit }));
  };

  navigation.setOptions({
    title: `Add Items to ${shoppingList.name}`,
    headerLeft: () => (
      <Icon
        style={{ width: 30, height: 35 }}
        name="arrow-ios-back-outline"
        fill="white"
        onPress={() => {
          if (newShopList.subItems.length > 0) {
            Alert.alert("Discard Changes?", "Are you sure?", [
              {
                text: "No",
                style: "cancel",
              },
              {
                text: "Yes",
                onPress: () => navigation.pop(),
              },
            ]);
          } else {
            navigation.pop();
          }
        }}
      />
    ),
    headerRight: () => (
      <Text
        category="s1"
        style={{ color: color.white }}
        onPress={() => setSaveChanges(true)}
      >
        Save
      </Text>
    ),
  });

  return (
    <Layout style={{ width: "100%" }}>
      <Layout style={{ padding: 20 }}>
        <Input
          label="Item Name"
          placeholder="Ex. Milk"
          value={newSubItem.name}
          onChangeText={(text) => handleTextChange("name", text)}
        />
        <Layout
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          <MaterialCommunityIcons
            name="minus-circle-outline"
            color={color.primary}
            size={30}
            onPress={() =>
              setNewSubItem((prevList) => ({
                ...prevList,
                qty: newSubItem.qty > 1 ? newSubItem.qty - 1 : 1,
              }))
            }
          />
          <Text style={{ marginHorizontal: 10 }}>{newSubItem.qty}</Text>
          <MaterialCommunityIcons
            name="plus-circle-outline"
            color={color.primary}
            size={30}
            onPress={() =>
              setNewSubItem((prevList) => ({
                ...prevList,
                qty: newSubItem.qty + 1,
              }))
            }
          />
          <Select
            selectedIndex={
              selectedIndex.row === -1 ? new IndexPath(0) : selectedIndex
            }
            value={qtyUnits[selectedIndex.row]}
            style={{ marginLeft: 10, width: 120 }}
            onSelect={(index) => {
              setSelectedIndex(index);
              handleQtyUnitSelect(index);
            }}
          >
            {qtyUnits.map((unit, index) => (
              <SelectItem key={index} title={unit} />
            ))}
          </Select>
        </Layout>
        <Layout
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Input
            multiline={true}
            label="Notes"
            placeholder="Ex. Vitamin D"
            value={newSubItem.notes}
            textStyle={{ minHeight: 64 }}
            style={{ width: "100%" }}
            onChangeText={(text) => handleTextChange("notes", text)}
          />
        </Layout>
        <Layout
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <Button
            status="primary"
            onPress={handleAddItem}
            style={{ width: "100%" }}
          >
            Add Item
          </Button>
        </Layout>
      </Layout>
      <Layout>
        <ItemListLayout
          height={430}
          isLoading={isLoading}
          shoppingList={newShopList}
          setShoppingList={setShopList}
          setSaveChanges={setSaveChanges}
        />
      </Layout>
    </Layout>
  );
};

export default AddItemForm;
