import { Route, Routes as ReactRoutes } from "react-router-dom";

import { Home } from "../pages/Home";

function Routes() {
  return (
    <ReactRoutes>
      <Route path="/" element={<Home />} />
    </ReactRoutes>
  );
}

export { Routes };
