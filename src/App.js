import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

/* Importing the custom pages as each components */
import { Navigation } from "./component/navigation";
import { Home } from "./Home/Home";
import { Login } from "./Login/Login";

/* Main function for all the pages and elements */
export default function App() {

  return (

    <Router>

      <div>

        <Link to="/login">Login </Link>

        <Link to="/">Home</Link>

        <Navigation />

        <Switch>

          <Route path="/">

            <Home />

          </Route>

          <Route path="/login">

            <Login />

          </Route>

        </Switch>

      </div>

    </Router>
  );
}
