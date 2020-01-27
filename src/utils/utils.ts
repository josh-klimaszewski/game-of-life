import { produce } from "immer";
import { ROWS, COLUMNS, Grid, operations } from "./constants";

export function resetGrid(props?: { randomize: boolean }): Grid {
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

export const findPopulation = (grid: Grid): number => {
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

export const updateGrid = (oldGrid: Grid) => {
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
};
