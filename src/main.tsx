import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

import { registerSW } from "virtual:pwa-register";

registerSW({
  onOfflineReady() {
    console.log("App ready offline!");
  },
  onNeedRefresh() {
    console.log("New version available, refresh to update.");
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RecoilRoot>
  </StrictMode>
);
