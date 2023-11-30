// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Template from "./pages/Template";
import ShoppingList from "./pages/ShoppingList";
import ShoppingListSubList from "./pages/ShoppingListSubList";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={<Template element={<Dashboard />} title={"Dashboard"} />}
        />
        <Route
          path="/shoppinglist"
          element={
            <Template element={<ShoppingList />} title={"Shopping List"} />
          }
        />
        <Route
          path="/shoppinglist/:listId"
          element={
            <Template
              element={<ShoppingListSubList />}
              title={"Shopping List"}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
