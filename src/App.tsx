import React, { Fragment, useState, useCallback, useRef } from "react";
import produce from "immer";
import "./App.css";

const ROWS = 30;
const COLUMNS = 60;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

type Row = Array<number>;
type Grid = Array<Row>;

function resetGrid(props?: { randomize: boolean }): Grid {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push(
      Array.from(Array(COLUMNS), () => {
        if (props && props.randomize) {
          return Math.random() > 0.7 ? 1 : 0;
        }
        return 0;
      })
    );
  }
  return rows;
}

function App() {
  const [grid, setGrid] = useState(resetGrid);
  const [savedGrids, setSavedGrids] = useState([] as number[][][]);
  const [running, setRunning] = useState(false);
  const runningRef = useRef<{}>();
  runningRef.current = running;

  const update = (i: number, k: number) => {
    setRunning(false);
    const newGrid: Grid = produce(grid, gridCopy => {
      gridCopy[i][k] = grid[i][k] ? 0 : 1;
    });
    setGrid(newGrid);
  };

  const saveGrid = (grid: number[][]) => {
    setSavedGrids([...savedGrids, grid]);
  };

  const deleteGrid = (grid: number[][]) => {
    setSavedGrids([...savedGrids].filter(g => g !== grid));
  };

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid(oldGrid => {
      return produce(oldGrid, newGrid => {
        for (let i = 0; i < ROWS; i++) {
          for (let k = 0; k < COLUMNS; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < ROWS && newK >= 0 && newK < COLUMNS) {
                neighbors += oldGrid[newI][newK];
              }
            });
            if (neighbors < 2 || neighbors > 3) {
              newGrid[i][k] = 0;
            } else if (oldGrid[i][k] === 0 && neighbors === 3) {
              newGrid[i][k] = 1;
            }
          }
        }
      });
    });
    setTimeout(runSimulation, 100);
  }, []);

  const toggleRunSimulation = () => {
    setRunning(!running);
    if (!running) {
      runningRef.current = true;
      runSimulation();
    }
  };

  const findPopulation = (): number => {
    let count = 0;
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell) {
          count += 1;
        }
      });
    });
    return count;
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
                update(i, k);
              }}
              onMouseOver={e => {
                if (e.buttons === 1) {
                  update(i, k);
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
        <div>{`Popluation: ${findPopulation()}`}</div>
        <button onClick={toggleRunSimulation}>
          {running ? "stop" : "start"}
        </button>
        <button onClick={() => setGrid(resetGrid({ randomize: true }))}>
          randomize
        </button>
        <button onClick={() => setGrid(resetGrid())}>reset</button>
        <button onClick={() => saveGrid(grid)}>save</button>
        {savedGrids.map((savedGrid, index) => (
          <Fragment key={index}>
            <button
              onClick={() => setGrid(savedGrid)}
            >{`Load grid ${index}`}</button>
            <button
              onClick={() => deleteGrid(savedGrid)}
            >{`Delete grid ${index}`}</button>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default App;
