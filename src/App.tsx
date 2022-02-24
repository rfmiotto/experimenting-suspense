import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "react-query";

import { makeServer } from "./services/mirage";
import { queryClient } from "./services/queryClient";
import { Routes } from "./routes";
import "./services/firebase";

if (import.meta.env.DEV) {
  makeServer();
}

function App() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100 antialiased">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export { App };
