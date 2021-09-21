import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from "./Pages/Home/Index"
import Search from "./Pages/Search/Index"
import { configureRootTheme } from '@yandex/ui/Theme'
import { theme } from '@yandex/ui/Theme/presets/default'
configureRootTheme({ theme })

export default function App() {
  return (
      <Router>
        <Switch>
            <Route path="/search">
                <Search />
            </Route>
            <Route path="/">
                <Home />
            </Route>
            <Route>
                <h1>404 dude</h1>
            </Route>
        </Switch>
      </Router>
  );
}