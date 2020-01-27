export const ROWS = 30;
export const COLUMNS = 60;

export const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

export type Row = Array<number>;
export type Grid = Array<Row>;
