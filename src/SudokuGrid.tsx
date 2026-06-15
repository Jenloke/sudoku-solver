import { Input } from "@/components/ui/input"
import type { Board } from "./services/sudoku"

function isValidCell(
  board: Board,
  row: number,
  col: number,
  value: number
): boolean {
  if (value === 0) return true
  for (let i = 0; i < 9; i++) {
    if (i !== col && board[row][i] === value) return false
    if (i !== row && board[i][col] === value) return false
  }
  const br = Math.floor(row / 3) * 3
  const bc = Math.floor(col / 3) * 3
  for (let r = br; r < br + 3; r++)
    for (let c = bc; c < bc + 3; c++)
      if ((r !== row || c !== col) && board[r][c] === value) return false
  return true
}


export function SudokuGrid({
  board,
  puzzle,
  readOnly = false,
  onChange,
}: {
  board: Board
  puzzle?: Board
  readOnly?: boolean
  onChange?: (row: number, col: number, value: number) => void
}) {
  return (
    <div className="inline-grid overflow-hidden rounded-sm border-2 border-foreground">
      {board.map((row, r) => (
        <div
          key={r}
          className="flex"
        >
          {row.map((cell, c) => {
            const isGiven = puzzle ? puzzle[r][c] !== 0 : false
            const isConflict =
              !readOnly && cell !== 0 && !isValidCell(board, r, c, cell)
            const isSolved =
              readOnly && puzzle ? puzzle[r][c] === 0 && cell !== 0 : false

            return (
              <div
                key={c}
                className={`flex h-10 w-10 items-center justify-center border border-border/20 ${c === 2 || c === 5 ? "border-r-2 border-r-foreground/70" : "border-r border-r-border/20"} ${r === 2 || r === 5 ? "border-b-2 border-b-foreground/70" : "border-b border-b-border/20"} ${isConflict ? "bg-destructive/15" : ""} ${isSolved ? "bg-emerald-500/10" : ""} `}
              >
                {readOnly ? (
                  <span
                    className={`text-sm font-medium ${
                      isSolved
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-foreground"
                    }`}
                  >
                    {cell !== 0 ? cell : ""}
                  </span>
                ) : (
                  <Input
                    value={cell !== 0 ? cell : ""}
                    readOnly={isGiven}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^1-9]/g, "")
                      onChange?.(r, c, val ? parseInt(val.slice(-1)) : 0)
                    }}
                    className={`h-full w-full rounded-none border-0 p-0 text-center text-sm shadow-none focus-visible:z-10 focus-visible:ring-1 focus-visible:ring-inset ${isGiven ? "cursor-default bg-muted/40 font-semibold text-foreground" : "font-normal"} ${isConflict ? "text-destructive" : ""} `}
                    maxLength={1}
                  />
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default SudokuGrid