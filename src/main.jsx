import React from "react";
import ReactDOM from "react-dom/client";
//import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createHashRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Presenter from "./pages/Presenter";
import InfiniteFusion from "./pages/InfiniteFusion";
import FindTheMove from "./pages/FindTheMove";
import "./index.css";

const router = createHashRouter([
  { path: "/", element: <App /> },
  { path: "/presentateur", element: <Presenter /> },
  { path: "/infinite-fusion", element: <InfiniteFusion /> },
  { path: "/find-the-move/:id", element: <FindTheMove /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);