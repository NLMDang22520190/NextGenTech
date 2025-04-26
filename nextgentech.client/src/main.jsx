import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { registerLicense } from "@syncfusion/ej2-base";
registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NDaF1cXmhIfEx1RHxQdld5ZFRHallYTnNWUj0eQnxTdEFiWH1acXRVT2VYWU12WA=="
);

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
import { Provider } from "react-redux";
import { store } from "./store.js";

root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
