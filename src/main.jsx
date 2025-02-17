import React from "react";
import ReactDOM from "react-dom/client";
//import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createHashRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Presenter from "./pages/Presenter";
import "./index.css";

const router = createHashRouter([
  { path: "/", element: <App /> },
  { path: "/presentateur", element: <Presenter /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);