import {
  Button,
  Card,
  CheckBox,
  Icon,
  Input,
  Layout,
  List,
  Modal,
  Spinner,
  Select,
  SelectItem,
  Text,
} from "@ui-kitten/components";
import React, { useState } from "react";
import {
  Alert,
  Animated,
  SectionList,
  StyleSheet,
  View,
  VirtualizedList,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import color from "../../Colors.json";
import EditItem from "./EditItem";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ItemListLayout = ({
  isLoading,
  shoppingList,
  setShoppingList,
  setSaveChanges,
  height,
}) => {
  let row = [];
  let prevOpenedRow;
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editIndex, setEditIndex] = useState();
  const [newSubItem, setNewSubItem] = useState({
    name: "",
    qty: 1,
    qtyUnit: "ct",
    notes: "",
    purchased: false,
  });

  const [getItemCount, setGetItemCount] = useState(
    shoppingList.subItems.length
  );

  const handleEdit = async (index) => {
    const actualIndex = shoppingList.subItems.length - 1 - index;
    setEditIndex(actualIndex);
    setNewSubItem(shoppingList.subItems[actualIndex]);
    setDrawerVisible(true);
  };

  console.log("New List = ", newSubItem);
  console.log("editIndex = ", editIndex);
  const handleCloseDrawer = () => {
    setDrawerVisible(false);
  };

  const handleEditItem = (key, value) => {
    setNewSubItem({ ...newSubItem, [key]: value });
  };

  const handleDelete = (subItemIndex) => {
    const actualIndex = shoppingList.subItems.length - 1 - subItemIndex;
    const updatedSubItems = shoppingList.subItems.filter(
      (subItem, index) => index !== actualIndex
    );
    setShoppingList((prevList) => ({
      ...prevList,
      subItems: updatedSubItems,
      lastModified: new Date(),
    }));
    closeRow(actualIndex);
    Alert.alert("Uh-Yeahh!", "Item deleted successfully!");
    setSaveChanges(true);
  };

  const handleItemPurchased = (index) => {
    const actualIndex = shoppingList.subItems.length - 1 - index;
    setShoppingList((prevShoppingList) => {
      const updatedSubItems = [...prevShoppingList.subItems];
      updatedSubItems[actualIndex] = {
        ...updatedSubItems[actualIndex],
        purchased: !updatedSubItems[actualIndex].purchased,
      };

      return {
        ...prevShoppingList,
        subItems: updatedSubItems,
        lastModified: new Date(),
      };
    });
    setSaveChanges(true);
  };

  const handleUpdateItem = () => {
    setShoppingList((prevList) => {
      const updateSubItems = [...prevList.subItems];
      updateSubItems[editIndex] = newSubItem;

      return {
        ...prevList,
        subItems: updateSubItems,
        lastModified: new Date(),
      };
    });
    setSaveChanges(true);
    handleCloseDrawer();
  };

  const closeRow = (index) => {
    console.log("closerow");
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };

  const renderRightActions = (progress, dragX, index) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-50, 0, 0, 1],
    });
    return (
      <>
        <Button
          style={styles.rightAction}
          onPress={() => {
            handleDelete(index);
          }}
        >
          <Animated.Text
            style={[
              styles.actionText,
              {
                transform: [{ translateX: trans }],
              },
            ]}
          >
            Delete
          </Animated.Text>
        </Button>
        <Button
          style={{
            backgroundColor: color.primary,
            borderWidth: 0,
            borderRadius: 0,
          }}
          onPress={() => handleEdit(index)}
        >
          <Animated.Text
            style={[
              styles.actionText,
              {
                transform: [{ translateX: trans }],
              },
            ]}
          >
            Edit
          </Animated.Text>
        </Button>
      </>
    );
  };

  const renderItem = ({ item, index }) => (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, index)
      }
      onSwipeableOpen={() => closeRow(index)}
      ref={(ref) => (row[index] = ref)}
      rightOpenValue={-100}
    >
      <Card key={index}>
        <Layout
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            backgroundColor: "transparent",
          }}
        >
          <Layout
            style={{ flexDirection: "row", backgroundColor: "transparent" }}
          >
            <CheckBox
              checked={item.purchased}
              onChange={() => handleItemPurchased(index)}
            ></CheckBox>
            <Layout style={{ backgroundColor: "transparent", marginLeft: 16 }}>
              <Text>{item.name}</Text>
              {item.notes && (
                <Text category="c1" style={{ marginTop: 5 }}>
                  Notes - {item.notes}
                </Text>
              )}
            </Layout>
          </Layout>

          <Text>
            {item.qty} {item.qtyUnit}
          </Text>
        </Layout>
      </Card>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Layout
        style={{
          height: height,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isLoading ? (
          <Spinner />
        ) : shoppingList.subItems?.length > 0 ? (
          <List
            data={[...shoppingList.subItems].reverse()}
            style={{ width: "100%", backgroundColor: "white" }}
            renderItem={renderItem}
          />
        ) : (
          <Text style={{ textAlign: "center" }}>No items available</Text>
        )}
        <EditItem
          newSubItem={newSubItem}
          visible={drawerVisible}
          onClose={handleCloseDrawer}
          onEdit={handleEditItem}
          setNewSubItem={setNewSubItem}
          onUpdate={handleUpdateItem}
        />
      </Layout>
    </GestureHandlerRootView>
  );
};

export default ItemListLayout;

const styles = StyleSheet.create({
  rightAction: {
    backgroundColor: "#F44336",
    borderWidth: 0,
    borderRadius: 0,
  },
});
