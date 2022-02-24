import { Route, Routes as ReactRoutes } from "react-router-dom";

import { Home } from "../pages/Home";
import { SecondApp } from "../pages/SecondHome";

function Routes() {
  return (
    <ReactRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/session" element={<SecondApp />} />
    </ReactRoutes>
  );
}

export { Routes };
