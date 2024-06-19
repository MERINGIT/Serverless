import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./Features/User-Authentication/Login";

function App() {
  return (
    <div>
      <Router>
        <Switch className="remainingBody">
          <Route exact path="/">
            <Login />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
