import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "../services/api";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCollaborators from "../components/addCollaborators";
import { useAuth } from "../provider/authProvider";
import BreadcrumbsUrl from "../components/BreadcrumbsUrl";
import AlertMessage from "../components/AlertMessage";
import EditIcon from "@mui/icons-material/Edit";

const ShoppingListSubList = () => {
  const { listId } = useParams();
  const { userId } = useAuth();
  const [shoppingList, setShoppingList] = useState({});
  const [newSubItem, setNewSubItem] = useState({
    name: "",
    quantity: "",
    notes: "",
    purchased: false,
  });
  const [alertMessage, setAlertMessage] = useState({
    open: false,
    message: "",
    type: "",
  });
  const [saveChanges, setSaveChanges] = useState(false);
  const [editChanges, setEditChanges] = useState({
    edit: false,
    index: "",
  });
  const [titleEdit, setTitleEdit] = useState({
    edit: false,
    title: "",
  });

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/shoppinglist">
      Shopping List
    </Link>,
    <Typography variant="p" key="2" color="text.primary">
      {shoppingList.name}
    </Typography>,
  ];

  const [collaborator, setCollaborator] = useState();
  useEffect(() => {
    if (listId) {
      axios.get(`/api/shopping-lists/${listId}`).then((response) => {
        const { collabUser, updatedshoppingList } = response.data;
        setShoppingList(updatedshoppingList);
        setCollaborator(collabUser);
      });
    }
  }, [listId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubItem = () => {
    if (newSubItem.name) {
      const SubmittedItem = {
        name: newSubItem.name,
        quantity: `${newSubItem.quantity}`,
        notes: newSubItem.notes,
        purchased: newSubItem.purchased,
      };
      const updatedShoppingList = { ...shoppingList };
      updatedShoppingList.subItems.push(SubmittedItem);
      setShoppingList(updatedShoppingList);
      setNewSubItem({
        name: "",
        quantity: "",
        qty: "",
        unit: "",
        notes: "",
        purchased: false,
      });
      handlesave();
    } else {
      setAlertMessage({
        open: true,
        message: "Please provide a name.",
        type: "info",
      });
    }
  };

  const handleUpdateItem = () => {
    setShoppingList((prevList) => {
      const updatedList = { ...prevList };
      updatedList.subItems[editChanges.index] = newSubItem;
      return updatedList;
    });
    setSaveChanges(true);
    setEditChanges(false);
    setNewSubItem({
      name: "",
      quantity: "",
      notes: "",
      purchased: false,
    });
  };

  const handlesave = async () => {
    await axios
      .put(`/api/shopping-lists/${shoppingList._id}`, shoppingList)
      .then((response) => {
        setShoppingList(response.data);
      })
      .catch((error) => {
        console.error("Error updating shopping list:", error.message);
      });
  };

  const handleDelete = (subItemIndex) => {
    const updatedSubItems = shoppingList.subItems.filter(
      (subItem, index) => index !== subItemIndex
    );

    // Assuming shoppingList is an object with a subItems property
    setShoppingList((prevList) => ({
      ...prevList,
      subItems: updatedSubItems,
    }));
    setAlertMessage({
      open: true,
      message: "Item deleted successfully!",
      type: "success",
    });
    setSaveChanges(true);
  };

  const handleItemPurchased = (index) => {
    setShoppingList((prevShoppingList) => {
      const updatedSubItems = [...prevShoppingList.subItems];
      updatedSubItems[index] = {
        ...updatedSubItems[index],
        purchased: !updatedSubItems[index].purchased,
      };

      return {
        ...prevShoppingList,
        subItems: updatedSubItems,
      };
    });
    setSaveChanges(true);
  };

  const handleTitleUpdate = () => {
    if (titleEdit.title) {
      setShoppingList((prevList) => ({
        ...prevList,
        name: titleEdit.title,
      }));
      setSaveChanges(true);
      setTitleEdit({
        edit: false,
        title: "",
      });
      setAlertMessage({
        open: "true",
        message: "Title successfully changed!",
        type: "success",
      });
    } else {
      setAlertMessage({
        open: "true",
        message: "Provide a Title!",
        type: "info",
      });
    }
  };

  if (saveChanges) {
    handlesave();
    setSaveChanges(false);
  }

  return (
    <>
      <BreadcrumbsUrl breadcrumbs={breadcrumbs} />
      <Grid container justifyContent="space-between">
        <Link href="/shoppinglist">
          <Button
            component="label"
            variant="contained"
            startIcon={<KeyboardBackspaceIcon />}
            sx={{ mb: 2 }}
          >
            Back
          </Button>
        </Link>
        {userId === shoppingList.user ? (
          <AddCollaborators
            setAlertMessage={setAlertMessage}
            shoppingList={shoppingList}
            setShoppingList={setShoppingList}
            collaborator={collaborator}
            setCollaborator={setCollaborator}
          />
        ) : (
          ""
        )}
      </Grid>

      <Paper sx={{ p: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {titleEdit.edit ? (
                <>
                  <TextField
                    variant="standard"
                    value={titleEdit.title}
                    onChange={(e) => {
                      setTitleEdit((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }));
                    }}
                    margin="normal"
                    sx={{ marginTop: 0, marginBottom: 0 }}
                  ></TextField>
                  <Button
                    variant="contained"
                    onClick={handleTitleUpdate}
                    color="primary"
                    sx={{ mx: 2 }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setTitleEdit({ edit: false, title: "" })}
                  >
                    Discard
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {shoppingList.name}
                  </Typography>
                  <IconButton sx={{ mb: 2 }}>
                    <EditIcon
                      fontSize="small"
                      onClick={() =>
                        setTitleEdit({
                          edit: true,
                          title: shoppingList.name,
                        })
                      }
                    />
                  </IconButton>
                </>
              )}
            </Box>
            <TextField
              label="Name"
              name="name"
              value={newSubItem.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="standard"
              sx={{ marginTop: 0, marginBottom: 0 }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Quantity"
              name="quantity"
              value={newSubItem.quantity}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="standard"
              sx={{ marginTop: 0, marginBottom: 0 }}
            />
          </Grid>
          <Grid item xs={9}>
            <TextField
              label="Notes"
              name="notes"
              value={newSubItem.notes}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="standard"
              sx={{ marginTop: 0, marginBottom: 0 }}
            />
          </Grid>
          <Grid item xs={9}>
            <Button
              variant="contained"
              color={editChanges.edit ? "success" : "primary"}
              onClick={editChanges.edit ? handleUpdateItem : handleAddSubItem}
              sx={{ mt: 2 }}
            >
              {editChanges.edit ? "Update " : "Add "}SubItem
            </Button>
            {editChanges.edit ? (
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  setNewSubItem({
                    name: "",
                    quantity: "",
                    notes: "",
                    purchased: false,
                  });
                  setEditChanges({
                    edit: false,
                    index: "",
                  });
                }}
                sx={{ mx: 2, mt: 2 }}
              >
                Discard
              </Button>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
      </Paper>
      <Paper>
        <Grid item sx={{ mt: 2 }} xs={12}>
          {shoppingList.subItems &&
            shoppingList?.subItems.map((item, index) => (
              <List
                key={index}
                sx={{
                  maxWidth: "100%",
                  paddingBottom: 0,
                  paddingTop: 0,
                  bgcolor: "background.paper",
                }}
              >
                <ListItemButton>
                  <ListItem
                    sx={{
                      alignItems: "center",
                      paddingBottom: 0,
                      paddingTop: 0,
                    }}
                  >
                    <Checkbox
                      sx={{ pl: 0 }}
                      checked={item.purchased}
                      onChange={() => handleItemPurchased(index)}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                    <ListItemAvatar>
                      <Avatar
                        alt={item.name}
                        src="/static/images/avatar/1.jpg"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      sx={{
                        textDecorationLine: `${
                          item.purchased ? "line-through" : "none"
                        }`,
                      }}
                      primary={item.name}
                      secondary={`${item.quantity} ${
                        item.notes ? ` - Notes: ${item.notes}` : ` `
                      }`}
                    />
                    <ListItemText
                      sx={{ display: "contents" }}
                      primary={
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => {
                            setNewSubItem(item);
                            setEditChanges({
                              edit: true,
                              index: index,
                            });
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      }
                      secondary={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDelete(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    />
                  </ListItem>
                </ListItemButton>
              </List>
            ))}
        </Grid>
      </Paper>
      <AlertMessage
        alertMessage={alertMessage}
        setAlertMessage={setAlertMessage}
      />
    </>
  );
};

export default ShoppingListSubList;
