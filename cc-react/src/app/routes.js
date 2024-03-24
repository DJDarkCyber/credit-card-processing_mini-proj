import { lazy } from "react";

import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";

// SESSION PAGES
const NotFound = Loadable(lazy(() => import("app/views/sessions/NotFound")));
// E-CHART PAGE
// DASHBOARD PAGE
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics")));

const Checker = Loadable(lazy(() => import("app/views/ccchecker/Checker")));

const routes = [
  {
    element: <MatxLayout />,
    children: [
      // dashboard route
      { path: "/", element: <Analytics /> },
      // e-chart route
      { path: "/checker", element: <Checker /> }
    ]
  },

  // session pages route
  { path: "/session/404", element: <NotFound /> },
  { path: "*", element: <NotFound /> }
];

export default routes;
