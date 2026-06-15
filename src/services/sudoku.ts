export type Board = number[][];

export function solveSudoku(puzzle: Board): Board | null {
  const board = puzzle.map(row => [...row]); // clone to avoid mutation
  return solve(board) ? board : null;
}

function isValid(board: Board, row: number, col: number, value: number): boolean {
  if (board[row].includes(value)) return false;

  for (let r = 0; r < 9; r++) {
    if (board[r][col] === value) return false;
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === value) return false;
    }
  }

  return true;
}

function solve(board: Board): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let value = 1; value <= 9; value++) {
          if (isValid(board, row, col, value)) {
            board[row][col] = value;
            if (solve(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}