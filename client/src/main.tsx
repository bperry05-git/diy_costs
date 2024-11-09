import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { SWRConfig } from "swr";
import { fetcher } from "./lib/fetcher";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "./pages/HomePage";
import AnalyzePage from "./pages/AnalyzePage";
import ProjectsPage from "./pages/ProjectsPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SWRConfig value={{ fetcher }}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/analyze" component={AnalyzePage} />
        <Route path="/projects" component={ProjectsPage} />
        <Route>404 Page Not Found</Route>
      </Switch>
      <Toaster />
    </SWRConfig>
  </StrictMode>,
);
