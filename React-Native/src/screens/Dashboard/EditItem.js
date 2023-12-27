import {
  Icon,
  Input,
  Layout,
  Select,
  SelectItem,
  Text,
  IndexPath,
  Button,
} from "@ui-kitten/components";
import React, { useState } from "react";
import { Modal, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import color from "../../Colors.json";

const EditItem = ({
  visible,
  onClose,
  onEdit,
  newSubItem,
  setNewSubItem,
  onUpdate,
}) => {
  const qtyUnits = ["ct", "LB", "GL", "Unit"];

  return (
    <>
      {newSubItem ? (
        <Modal animationType="slide" transparent={true} visible={visible}>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 16,
                borderRadius: 25,
              }}
            >
              <Icon
                name="close"
                style={{ width: 24, height: 24 }}
                onPress={onClose}
              />
              <Layout style={{ padding: 20 }}>
                <Input
                  label="Item Name"
                  placeholder="Ex. Milk"
                  value={newSubItem?.name}
                  onChangeText={(text) => onEdit("name", text)}
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
                        qty: Math.max(newSubItem.qty - 1, 1),
                      }))
                    }
                  />
                  <Text style={{ marginHorizontal: 10 }}>
                    {newSubItem?.qty}
                  </Text>
                  <MaterialCommunityIcons
                    name="plus-circle-outline"
                    color={color.primary}
                    size={30}
                    onPress={() =>
                      setNewSubItem((prevList) => ({
                        ...prevList,
                        qty: parseInt(newSubItem.qty, 10) + 1,
                      }))
                    }
                  />
                  <Select
                    selectedIndex={
                      newSubItem.qtyUnit
                        ? new IndexPath([
                            0,
                            qtyUnits.indexOf(newSubItem.qtyUnit),
                          ])
                        : new IndexPath(0)
                    }
                    style={{ marginLeft: 10, width: 120 }}
                    value={newSubItem.qtyUnit}
                    onSelect={(index) => {
                      const selectedQtyUnit = qtyUnits[index.row];
                      setNewSubItem((prev) => ({
                        ...prev,
                        qtyUnit: selectedQtyUnit,
                      }));
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
                    value={newSubItem?.notes}
                    textStyle={{ minHeight: 64 }}
                    style={{ width: "100%" }}
                    onChangeText={(text) => onEdit("notes", text)}
                  />
                </Layout>
                <Layout
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <Button
                    onPress={onUpdate}
                    style={{ backgroundColor: color.primary }}
                  >
                    {" "}
                    Update
                  </Button>
                  <Button
                    onPress={onClose}
                    style={{ backgroundColor: color.secondary, borderWidth: 0 }}
                  >
                    Cancel{" "}
                  </Button>
                </Layout>
              </Layout>
            </View>
          </View>
        </Modal>
      ) : (
        ""
      )}
    </>
  );
};

export default EditItem;
