import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from "./Pages/Home/Index"
import { configureRootTheme } from '@yandex/ui/Theme'
import { theme } from '@yandex/ui/Theme/presets/default'
configureRootTheme({ theme })

export default function App() {
  return (
      <Router>
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
  );
}