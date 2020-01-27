import React, { Fragment, useReducer, useCallback, useRef } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import "./App.css";

import { COLUMNS } from "./utils/constants";
import { findPopulation } from "./utils/utils";
import { reducer, initialState } from "./utils/reducer";
import Game from "./components/Game/Game";
import LifeBackground from "./components/LifeBackground/LifeBackground";

function App() {
  const [{ grid, savedGrids, running }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const runningRef = useRef<{}>();
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    dispatch({ type: "run" });
    setTimeout(runSimulation, 100);
  }, []);

  const toggleRunSimulation = () => {
    dispatch({ type: "toggle" });
    if (!running) {
      runningRef.current = true;
      runSimulation();
    }
  };

  return (
    <Router history={createBrowserHistory()}>
      <Switch>
        <Fragment>
          <Route
            path="/"
            exact={true}
            render={(_: any) => <Redirect to={"/game"} />}
          />
          <Route path={"/game"} exact={true} render={(_: any) => <Game />} />
          <Route
            path={"/bg"}
            exact={true}
            render={(_: any) => <LifeBackground />}
          />
        </Fragment>
      </Switch>
    </Router>
  );
}

export default App;
