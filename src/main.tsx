import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { LoginPage } from "./pages/login-page";
import { TimelinePage } from "./pages/timeline-page";
import { LabelsAdminPage } from "./pages/labels-admin-page";
import { SystemAdminPage } from "./pages/system-admin-page";
import { apolloClient } from "./lib/apollo";
import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element was not found.");
}

const isLoginPage = window.location.pathname.endsWith("/login.html");
const isAdminPage = window.location.pathname.endsWith("/admin.html");
const isSystemAdminPage = window.location.pathname.endsWith("/system-admin.html");

createRoot(rootElement).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      {isLoginPage ? <LoginPage /> : isAdminPage ? <LabelsAdminPage /> : isSystemAdminPage ? <SystemAdminPage /> : <TimelinePage />}
    </ApolloProvider>
  </StrictMode>,
);
