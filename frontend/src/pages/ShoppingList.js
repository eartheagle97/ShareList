import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import {
  Avatar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import axios from "../services/api";
import DeleteIcon from "@mui/icons-material/Delete";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const ShoppingList = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [newList, setNewList] = useState("");
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    const fetchShoppingLists = async () => {
      try {
        const newUser = JSON.parse(user);
        const userId = newUser?.id;

        if (userId) {
          const response = await axios.get(
            `/api/shopping-lists?user_id=${userId}`
          );
          const shoppingLists = response.data;
          setShoppingList(shoppingLists);
        }
      } catch (error) {
        console.error("Error fetching shopping lists:", error.message);
      }
    };

    // Call the fetchShoppingLists function
    fetchShoppingLists();
  }, [user]);

  const handleSubmit = async () => {
    if (newList.trim() !== "") {
      const newUser = JSON.parse(user);
      const newshoppingList = {
        user: newUser?.id,
        name: newList,
        subitems: [],
        collaborators: [],
      };

      await axios
        .post("/api/shopping-lists", newshoppingList)
        .then((response) => {
          setShoppingList((prevLists) => [...prevLists, response.data]);
          setNewList("");
        })
        .catch((error) => {
          console.error("Error creating shopping list:", error.message);
        });
    }
  };

  const handleDelete = async (listId) => {
    try {
      await axios.delete(`/api/shopping-lists/${listId}`);
      setShoppingList((prevLists) =>
        prevLists.filter((item) => item._id !== listId)
      );
      alert("Shopping list deleted successfully");
    } catch (error) {
      alert("Error deleting shopping list");
    }
  };

  return (
    <>
      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Chart */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TextField
                id="standard-basic"
                label="Name of List"
                variant="standard"
                value={newList}
                onChange={(e) => setNewList(e.target.value)}
                sx={{ flexGrow: 1 }}
              />
              <Button
                type="submit"
                sx={{ mx: [1] }}
                component="label"
                onClick={handleSubmit}
                variant="contained"
                startIcon={<PlaylistAddIcon />}
              >
                Create
              </Button>
            </Paper>
            <Paper sx={{ mt: 2, py: 2 }}>
              <Grid item xs={12}>
                {shoppingList.length > 0 ? (
                  <>
                    {shoppingList.map((item, index) => (
                      <List
                        key={index} // Add a unique key for each list item
                        sx={{
                          maxWidth: "100%",
                          paddingBottom: 0,
                          paddingTop: 0,
                          bgcolor: "background.paper",
                        }}
                      >
                        <ListItemButton
                          onClick={() => navigate(`/shoppinglist/${item._id}`)}
                        >
                          <ListItem
                            sx={{
                              alignItems: "center",
                              paddingBottom: 0,
                              paddingTop: 0,
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar
                                alt={item.name}
                                src="/static/images/avatar/1.jpg"
                              />
                            </ListItemAvatar>
                            <ListItemText
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                              primary={item.name}
                              secondary={
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() => handleDelete(item._id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              }
                            />
                          </ListItem>
                        </ListItemButton>
                      </List>
                    ))}
                  </>
                ) : (
                  <p
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    No shopping list items available.
                  </p>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ShoppingList;
