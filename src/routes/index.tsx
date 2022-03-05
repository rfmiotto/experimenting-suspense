import { Route, Routes as ReactRoutes } from "react-router-dom";

import { Home } from "../pages/Home";
import { SecondApp } from "../pages/SecondHome";
import { ThirdApp } from "../pages/ThirdHome";

function Routes() {
  return (
    <ReactRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/session" element={<SecondApp />} />
      <Route path="/concurrency" element={<ThirdApp />} />
    </ReactRoutes>
  );
}

export { Routes };
