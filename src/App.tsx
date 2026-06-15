import { useState } from "react"
import { SudokuGrid } from "./SudokuGrid"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { solveSudoku } from "./services/sudoku"
import type { Board } from "./services/sudoku"
import { ModeToggle } from "@/components/mode-toggle"

const EMPTY_BOARD: Board = Array.from({ length: 9 }, () => Array(9).fill(0))

const EXAMPLE_PUZZLE: Board = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
]

export function App() {
  const [board, setBoard] = useState<Board>(EMPTY_BOARD.map((r) => [...r]))
  const [solved, setSolved] = useState<Board | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (row: number, col: number, value: number) => {
    setBoard((prev) => {
      const next = prev.map((r) => [...r])
      next[row][col] = value
      return next
    })
    setSolved(null)
    setError(null)
  }

  const handleSolve = () => {
    const result = solveSudoku(board)
    if (result) {
      setSolved(result)
      setError(null)
    } else {
      setSolved(null)
      setError("No solution exists for this puzzle.")
    }
  }

  const handleLoadExample = () => {
    setBoard(EXAMPLE_PUZZLE.map((r) => [...r]))
    setSolved(null)
    setError(null)
  }

  const handleReset = () => {
    setBoard(EMPTY_BOARD.map((r) => [...r]))
    setSolved(null)
    setError(null)
  }

  const filledCount = board.flat().filter((v) => v !== 0).length

  return (
    <div className="flex min-h-svh items-start justify-center bg-background p-8">
      <div className="flex w-full max-w-3xl flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Sudoku Solver
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill in the puzzle below, then hit Solve.
          </p>
          <div className="absolute top-4 right-4">
            <ModeToggle />
          </div>
        </div>

        <div className="flex flex-col items-start gap-8 lg:flex-row">
          {/* Input board */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Puzzle</span>
              <Badge variant="outline" className="text-xs">
                {filledCount} / 81
              </Badge>
            </div>

            <SudokuGrid board={board} onChange={handleChange} />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSolve}>Solve →</Button>
              <Button variant="outline" onClick={handleLoadExample}>
                Load example
              </Button>
              <Button variant="ghost" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </div>

          {/* Divider */}
          {solved && (
            <>
              <Separator
                orientation="vertical"
                className="hidden self-stretch lg:block"
              />
              <Separator className="block lg:hidden" />
            </>
          )}

          {/* Solved board */}
          {solved && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Solution</span>
                <Badge className="bg-emerald-500 text-xs text-white hover:bg-emerald-500">
                  Solved
                </Badge>
              </div>

              <SudokuGrid board={solved} puzzle={board} readOnly />

              <p className="text-xs text-muted-foreground">
                Green cells are the values filled in by the solver.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
