// Game UI — DOM rendering and event binding

import { createInitialState, makeMove, resetGame } from './engine.js';

/**
 * Renders the current game state to the DOM.
 * Updates each cell's text content and occupied class based on state.board.
 * @param {GameState} state
 */
export function renderBoard(state) {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell) => {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const value = state.board[row][col];
    cell.textContent = value;
    if (value) {
      cell.classList.add('occupied');
    } else {
      cell.classList.remove('occupied');
    }
  });
}

/**
 * Displays the current game status (whose turn, winner, draw).
 * @param {GameState} state
 */
export function renderStatus(state) {
  const statusEl = document.getElementById('status');
  if (state.status === 'won') {
    statusEl.textContent = `Player ${state.winner} wins!`;
  } else if (state.status === 'draw') {
    statusEl.textContent = "It's a draw!";
  } else {
    statusEl.textContent = `Player ${state.currentPlayer}'s turn`;
  }
}

/** Module-level game state */
let currentState;

/**
 * Initializes event listeners on the board and restart button.
 */
export function initUI() {
  currentState = createInitialState();

  document.querySelectorAll('.cell').forEach((cell) => {
    cell.addEventListener('click', () => {
      const row = Number(cell.dataset.row);
      const col = Number(cell.dataset.col);
      currentState = makeMove(currentState, row, col);
      renderBoard(currentState);
      renderStatus(currentState);
    });
  });

  document.getElementById('restart').addEventListener('click', () => {
    currentState = resetGame();
    renderBoard(currentState);
    renderStatus(currentState);
  });

  renderBoard(currentState);
  renderStatus(currentState);
}

document.addEventListener('DOMContentLoaded', initUI);
