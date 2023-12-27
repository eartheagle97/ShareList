import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../provider/authProvider";

const MainListItems = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    setToken();
    navigate("/login", { replace: true });
  };

  const mainMenu = [
    {
      icon: <DashboardIcon />,
      name: "Dashboard",
      onClick: () => {
        navigate("/dashboard");
      },
    },
    {
      icon: <ShoppingCartIcon />,
      name: "Shopping List",
      onClick: () => {
        navigate("/shoppinglist");
      },
    },
    {
      icon: <PeopleIcon />,
      name: "Friends",
    },
    {
      icon: <SettingsIcon />,
      name: "Setting",
    },
    {
      icon: <LogoutIcon />,
      name: "Sign Out",
      onClick: handleLogout,
    },
  ];

  return (
    <>
      {mainMenu.map((item, index) => {
        return (
          <ListItemButton key={index} onClick={item.onClick}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItemButton>
        );
      })}
    </>
  );
};

export default MainListItems;
