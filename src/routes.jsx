import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/pages/Dashboard";
import isAuthenticated from "./ProtectedRouter";
import NewProduct from "./components/pages/NewProduct";
import MyCategory from "./components/pages/MyCategory";
import MyProducts from "./components/pages/MyProducts";

const router =  createBrowserRouter([
    {
        path: "/",
        element: <Login />
    },
    {
        path: "/dashboard",
        element: isAuthenticated() ? <Dashboard /> : <Navigate to="/" replace />
    },
    {
        path: "/dashboard/view_categories",
        element: isAuthenticated() ? <MyCategory /> : <Navigate to="/" replace />
    },
    {
        path: "/dashboard/view_categories/:id/view_products",
        element: isAuthenticated() ? <MyProducts /> : <Navigate to="/" replace />
    },
    {
        path: "/dashboard/new_products",
        element: isAuthenticated() ? <NewProduct /> : <Navigate to="/" replace />
    }
])

export default router;