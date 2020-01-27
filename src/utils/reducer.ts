import { updateGrid, resetGrid } from "./utils";
import { produce } from "immer";
import { Grid } from "./constants";

export type State = {
  grid: Grid;
  savedGrids: Grid[];
  running: boolean;
};

export const initialState: State = {
  grid: resetGrid(),
  savedGrids: [],
  running: false
};

interface UpdateAction {
  type: "update";
  data: { i: number; k: number };
}

interface RunAction {
  type: "run";
}

interface ToggleAction {
  type: "toggle";
}

interface SaveAction {
  type: "save";
}

interface DeleteAction {
  type: "delete";
  data: Grid;
}

interface LoadAction {
  type: "load";
  data: Grid;
}

interface ResetAction {
  type: "reset";
  data: { randomize: boolean };
}

type Action =
  | UpdateAction
  | SaveAction
  | DeleteAction
  | RunAction
  | ToggleAction
  | ResetAction
  | LoadAction;

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "update": {
      const { grid } = state;
      const { data } = action;
      const { i, k } = data;
      return {
        ...state,
        running: false,
        grid: produce(grid, gridCopy => {
          gridCopy[i][k] = grid[i][k] ? 0 : 1;
        })
      };
    }
    case "save": {
      return {
        ...state,
        grids: [...state.savedGrids, state.grid]
      };
    }
    case "delete": {
      return {
        ...state,
        grids: [...state.savedGrids].filter(g => g !== action.data)
      };
    }
    case "run": {
      return {
        ...state,
        grid: updateGrid(state.grid)
      };
    }
    case "toggle": {
      return { ...state, running: !state.running };
    }
    case "reset": {
      return {
        ...state,
        grid: resetGrid(action.data)
      };
    }
    case "load": {
      return {
        ...state,
        grid: action.data
      };
    }
    default:
      return state;
  }
};
