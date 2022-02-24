import { Route, Routes as ReactRoutes } from "react-router-dom";

import { Home } from "../pages/Home";
import { Home as SecondHome } from "../pages/SecondHome";

function Routes() {
  return (
    <ReactRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/session" element={<SecondHome />} />
    </ReactRoutes>
  );
}

export { Routes };
