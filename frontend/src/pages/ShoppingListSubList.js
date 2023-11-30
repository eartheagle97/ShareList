import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Toolbar,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "../services/api";

const ShoppingListSubList = ({ params }) => {
  const { listId } = useParams();
  const [shoppingList, setShoppingList] = useState({});
  const [newSubItem, setNewSubItem] = useState({
    name: "",
    quantity: "",
    qty: "",
    unit: "",
    notes: "",
  });
  useEffect(() => {
    if (listId) {
      axios.get(`/api/shopping-lists/${listId}`).then((response) => {
        setShoppingList(response.data);
      });
    }
  }, [listId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubItem = async () => {
    const SubmittedItem = {
        name: newSubItem.name,
        quantity: `${newSubItem.qty} ${newSubItem.unit}`,
        notes: newSubItem.notes
    }

    console.log(SubmittedItem)

  };
  return (
    <>
      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
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
            <Grid item xs={4} sx={{ display: "flex", alignItems: "center" }}>
              <Grid item xs={6}>
                <TextField
                  label="Quantity"
                  name="qty"
                  value={newSubItem.qty}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="standard"
                  sx={{ marginTop: 0, marginBottom: 0 }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl
                  fullWidth
                  margin="normal"
                  sx={{ marginTop: 0, marginBottom: 0 }}
                >
                  <InputLabel id="unit-label"></InputLabel>
                  <Select
                    labelId="unit-label"
                    id="unit"
                    name="unit"
                    variant="standard"
                    defaultValue={"Unit"}
                    value={newSubItem.unit}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Unit">Unit</MenuItem>
                    <MenuItem value="LB">LB</MenuItem>
                    <MenuItem value="ML">ML</MenuItem>
                    <MenuItem value="Galon">Galon</MenuItem>
                    {/* Add more unit options as needed */}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item xs={8}>
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
                color="primary"
                onClick={handleAddSubItem}
                sx={{ mt: 2 }}
              >
                Add Subitem
              </Button>
            </Grid>
          </Grid>
        </Paper>
        <Paper>
          <Grid item xs={12}>
            <ul>
              {shoppingList.subItems &&
                shoppingList.subItems.map((subItem, index) => (
                  <li key={index}>
                    {subItem.name} - {subItem.quantity} - {subItem.notes}
                  </li>
                ))}
            </ul>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default ShoppingListSubList;
