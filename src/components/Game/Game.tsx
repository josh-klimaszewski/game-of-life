import React, { Fragment, useReducer, useCallback, useRef } from "react";

import { COLUMNS } from "../.././utils/constants";
import { findPopulation } from "../.././utils/utils";
import { reducer, initialState } from "../.././utils/reducer";

function Game() {
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
    <div style={{ width: "1600px", display: "flex" }}>
      <div
        style={{
          padding: "20px",
          display: "grid",
          gridTemplateColumns: `repeat(${COLUMNS}, 20px)`
        }}
      >
        {grid.map((rows, i) =>
          rows.map((row, k) => (
            <div
              key={`${i}-${k}`}
              onMouseDown={_ => {
                dispatch({ type: "update", data: { i, k } });
              }}
              onMouseOver={e => {
                if (e.buttons === 1) {
                  dispatch({ type: "update", data: { i, k } });
                }
              }}
              style={{
                width: 20,
                height: 20,
                border: "1px solid black",
                backgroundColor: row ? "red" : undefined
              }}
            />
          ))
        )}
      </div>
      <div
        style={{
          paddingTop: "20px",
          paddingLeft: "20px",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div>{`Population: ${findPopulation(grid)}`}</div>
        <button onClick={toggleRunSimulation}>
          {running ? "stop" : "start"}
        </button>
        <button
          onClick={() => dispatch({ type: "reset", data: { randomize: true } })}
        >
          randomize
        </button>
        <button
          onClick={() =>
            dispatch({ type: "reset", data: { randomize: false } })
          }
        >
          reset
        </button>
        <button onClick={() => dispatch({ type: "save" })}>save</button>
        {savedGrids.map((savedGrid, index) => (
          <Fragment key={index}>
            <button
              onClick={() => dispatch({ type: "load", data: savedGrid })}
            >{`Load grid ${index}`}</button>
            <button
              onClick={() => dispatch({ type: "delete", data: savedGrid })}
            >{`Delete grid ${index}`}</button>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default Game;
