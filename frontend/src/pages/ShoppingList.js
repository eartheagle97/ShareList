import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {
  Box,
  Button,
  Card,
  CardContent,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import axios from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import BreadcrumbsUrl from "../components/BreadcrumbsUrl";
import AlertMessage from "../components/AlertMessage";
import ShoppingListActions from "../components/ShoppingListActions";

const ShoppingList = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [newList, setNewList] = useState("");
  const [shoppingList, setShoppingList] = useState([]);
  const [alertMessage, setAlertMessage] = useState({
    open: false,
    message: "",
    type: "",
  });

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/shoppinglist">
      Shopping List
    </Link>,
  ];

  useEffect(() => {
    const fetchShoppingLists = async () => {
      try {
        if (userId) {
          const response = await axios.get(
            `/api/shopping-lists/user/${userId}`
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
  }, [userId]);

  const handleSubmit = async () => {
    if (newList.trim() !== "") {
      const newshoppingList = {
        user: userId,
        name: newList,
        subitems: [],
        collaborators: [],
      };
      await axios
        .post("/api/shopping-lists", newshoppingList)
        .then((response) => {
          setShoppingList((prevLists) => [...prevLists, response.data]);
          setNewList("");
          setAlertMessage({
            open: true,
            message: "Shopping List Created Successfully",
            type: "success",
          });
        })
        .catch((error) => {
          setAlertMessage({
            open: true,
            message: "Error creating shopping list",
            type: "error",
          });
        });
    }
  };

  const handleDelete = async (listId) => {
    // Show a confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this shopping list?"
    );

    if (!confirmDelete) {
      // User clicked cancel, exit the function
      return;
    }

    try {
      await axios.delete(`/api/shopping-lists/${listId}`);
      setShoppingList((prevLists) =>
        prevLists.filter((item) => item._id !== listId)
      );
      setAlertMessage({
        open: true,
        message: "Shopping list deleted successfully",
        type: "error",
      });
    } catch (error) {
      setAlertMessage({
        open: true,
        message: "Error deleting shopping list",
        type: "error",
      });
    }
  };

  return (
    <>
      <BreadcrumbsUrl breadcrumbs={breadcrumbs} />
      <Typography variant="h5" sx={{ mb: 2 }}>
        Shopping List
      </Typography>
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
          <Paper sx={{ mt: 2, p: 2 }}>
            <Grid container spacing={2}>
              {shoppingList.length > 0 ? (
                <>
                  {shoppingList.map((item, index) => {
                    return (
                      <Grid item xs={12} md={3} lg={4} key={index}>
                        <Card
                          // sx={{ minWidth: 275 }}
                          variant="outlined"
                        >
                          <CardContent>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                sx={{ fontSize: 14 }}
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                              >
                                {item.subItems.length} Items
                              </Typography>
                              <ShoppingListActions
                                id={item._id}
                                handleClickDelete={() => handleDelete(item._id)}
                              />
                            </Box>
                            <Link
                              variant="h5"
                              sx={{ mb: 1.5 }}
                              component="button"
                              underline="hover"
                              onClick={() =>
                                navigate(`/shoppinglist/${item._id}`)
                              }
                            >
                              {item.name}
                            </Link>
                            <Typography
                              sx={{ mb: 1.5 }}
                              variant="body2"
                              color="text.secondary"
                            >
                              {item.collaborators.length} Collaborators
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </>
              ) : (
                ""
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <AlertMessage
        alertMessage={alertMessage}
        setAlertMessage={setAlertMessage}
      />
    </>
  );
};

export default ShoppingList;
