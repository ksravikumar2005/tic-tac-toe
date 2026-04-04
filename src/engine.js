// Game Engine — pure logic, no DOM dependencies

/**
 * Creates the initial game state.
 * @returns {GameState}
 */
export function createInitialState() {
  return {
    board: [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ],
    currentPlayer: 'X',
    status: 'playing',
    winner: null,
  };
}

/**
 * Checks the board for a winner.
 * @param {Board} board
 * @returns {'X' | 'O' | null}
 */
export function checkWinner(board) {
  const lines = [
    // Rows
    [[0,0],[0,1],[0,2]],
    [[1,0],[1,1],[1,2]],
    [[2,0],[2,1],[2,2]],
    // Columns
    [[0,0],[1,0],[2,0]],
    [[0,1],[1,1],[2,1]],
    [[0,2],[1,2],[2,2]],
    // Diagonals
    [[0,0],[1,1],[2,2]],
    [[0,2],[1,1],[2,0]],
  ];

  for (const [[r1,c1],[r2,c2],[r3,c3]] of lines) {
    const v = board[r1][c1];
    if (v && v === board[r2][c2] && v === board[r3][c3]) {
      return v;
    }
  }
  return null;
}

/**
 * Checks if the board is completely filled.
 * @param {Board} board
 * @returns {boolean}
 */
export function isBoardFull(board) {
  return board.every(row => row.every(cell => cell !== ''));
}

/**
 * Attempts to place a mark at the given row and column.
 * Returns a new state if the move is valid, or the same state if invalid.
 * @param {GameState} state
 * @param {number} row - 0, 1, or 2
 * @param {number} col - 0, 1, or 2
 * @returns {GameState}
 */
export function makeMove(state, row, col) {
  // Reject if game is not in playing status
  if (state.status !== 'playing') return state;

  // Reject out-of-range row/col
  if (row < 0 || row > 2 || col < 0 || col > 2) return state;

  // Reject if cell is occupied
  if (state.board[row][col] !== '') return state;

  // Deep-copy the board and place the mark
  const newBoard = state.board.map(r => [...r]);
  newBoard[row][col] = state.currentPlayer;

  // Check for winner
  const winner = checkWinner(newBoard);
  if (winner) {
    return {
      board: newBoard,
      currentPlayer: state.currentPlayer,
      status: 'won',
      winner,
    };
  }

  // Check for draw
  if (isBoardFull(newBoard)) {
    return {
      board: newBoard,
      currentPlayer: state.currentPlayer,
      status: 'draw',
      winner: null,
    };
  }

  // Switch turn
  return {
    board: newBoard,
    currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
    status: 'playing',
    winner: null,
  };
}

/**
 * Resets the game to initial state.
 * @returns {GameState}
 */
export function resetGame() {
  return createInitialState();
}
