import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Template from "../pages/Template";
import Dashboard from "../pages/Dashboard";
import ShoppingList from "../pages/ShoppingList";
import ShoppingListSubList from "../pages/ShoppingListSubList";

const Routes = () => {
  const { token } = useAuth();

  const routesForPublic = [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ];

  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/dashboard",
          element: <Template element={<Dashboard />} title={"Dashboard"} />,
        },
        {
          path: "/shoppinglist",
          element: <Template element={<ShoppingList />} title={"Dashboard"} />,
        },
        {
          path: "/shoppinglist/:listId",
          element: (
            <Template element={<ShoppingListSubList />} title={"Dashboard"} />
          ),
        },
      ],
    },
  ];

  const routesForNotAuthenticatedOnly = [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ];

  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;
