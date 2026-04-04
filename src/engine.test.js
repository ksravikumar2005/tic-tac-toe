import { describe, it, expect } from 'vitest';
import { createInitialState, resetGame, checkWinner, isBoardFull, makeMove } from './engine.js';

describe('createInitialState', () => {
  it('returns a 3x3 empty board', () => {
    const state = createInitialState();
    expect(state.board).toEqual([
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ]);
  });

  it('sets currentPlayer to X', () => {
    expect(createInitialState().currentPlayer).toBe('X');
  });

  it('sets status to playing', () => {
    expect(createInitialState().status).toBe('playing');
  });

  it('sets winner to null', () => {
    expect(createInitialState().winner).toBeNull();
  });
});

describe('resetGame', () => {
  it('returns the same shape as createInitialState', () => {
    expect(resetGame()).toEqual(createInitialState());
  });
});

describe('checkWinner', () => {
  it('returns null for an empty board', () => {
    const board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    expect(checkWinner(board)).toBeNull();
  });

  it('detects a row win for X', () => {
    const board = [
      ['X', 'X', 'X'],
      ['O', 'O', ''],
      ['', '', ''],
    ];
    expect(checkWinner(board)).toBe('X');
  });

  it('detects a column win for O', () => {
    const board = [
      ['X', 'O', ''],
      ['X', 'O', ''],
      ['', 'O', 'X'],
    ];
    expect(checkWinner(board)).toBe('O');
  });

  it('detects a diagonal win (top-left to bottom-right)', () => {
    const board = [
      ['X', 'O', ''],
      ['O', 'X', ''],
      ['', '', 'X'],
    ];
    expect(checkWinner(board)).toBe('X');
  });

  it('detects a diagonal win (top-right to bottom-left)', () => {
    const board = [
      ['X', 'O', 'O'],
      ['X', 'O', ''],
      ['O', '', 'X'],
    ];
    expect(checkWinner(board)).toBe('O');
  });

  it('returns null when no winner exists', () => {
    const board = [
      ['X', 'O', 'X'],
      ['X', 'O', 'O'],
      ['O', 'X', 'X'],
    ];
    expect(checkWinner(board)).toBeNull();
  });
});

describe('isBoardFull', () => {
  it('returns false for an empty board', () => {
    const board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    expect(isBoardFull(board)).toBe(false);
  });

  it('returns false when one cell is empty', () => {
    const board = [
      ['X', 'O', 'X'],
      ['O', 'X', 'O'],
      ['O', 'X', ''],
    ];
    expect(isBoardFull(board)).toBe(false);
  });

  it('returns true when all cells are occupied', () => {
    const board = [
      ['X', 'O', 'X'],
      ['O', 'X', 'O'],
      ['O', 'X', 'O'],
    ];
    expect(isBoardFull(board)).toBe(true);
  });
});

describe('makeMove', () => {
  it('places mark on an empty cell and switches turn', () => {
    const state = createInitialState();
    const next = makeMove(state, 0, 0);
    expect(next.board[0][0]).toBe('X');
    expect(next.currentPlayer).toBe('O');
    expect(next.status).toBe('playing');
  });

  it('does not mutate the original state', () => {
    const state = createInitialState();
    const next = makeMove(state, 1, 1);
    expect(state.board[1][1]).toBe('');
    expect(next.board[1][1]).toBe('X');
  });

  it('rejects move on an occupied cell', () => {
    const state = makeMove(createInitialState(), 0, 0); // X at (0,0)
    const result = makeMove(state, 0, 0); // O tries same cell
    expect(result).toBe(state);
  });

  it('rejects move when game status is won', () => {
    const wonState = {
      board: [
        ['X', 'X', 'X'],
        ['O', 'O', ''],
        ['', '', ''],
      ],
      currentPlayer: 'O',
      status: 'won',
      winner: 'X',
    };
    const result = makeMove(wonState, 2, 0);
    expect(result).toBe(wonState);
  });

  it('rejects move when game status is draw', () => {
    const drawState = {
      board: [
        ['X', 'O', 'X'],
        ['X', 'O', 'O'],
        ['O', 'X', 'X'],
      ],
      currentPlayer: 'X',
      status: 'draw',
      winner: null,
    };
    const result = makeMove(drawState, 0, 0);
    expect(result).toBe(drawState);
  });

  it('rejects out-of-range row', () => {
    const state = createInitialState();
    expect(makeMove(state, -1, 0)).toBe(state);
    expect(makeMove(state, 3, 0)).toBe(state);
  });

  it('rejects out-of-range col', () => {
    const state = createInitialState();
    expect(makeMove(state, 0, -1)).toBe(state);
    expect(makeMove(state, 0, 3)).toBe(state);
  });

  it('detects a win after a winning move', () => {
    let state = createInitialState();
    state = makeMove(state, 0, 0); // X
    state = makeMove(state, 1, 0); // O
    state = makeMove(state, 0, 1); // X
    state = makeMove(state, 1, 1); // O
    state = makeMove(state, 0, 2); // X wins top row
    expect(state.status).toBe('won');
    expect(state.winner).toBe('X');
  });

  it('detects a draw when board fills with no winner', () => {
    let state = createInitialState();
    // X O X
    // X X O
    // O X O
    state = makeMove(state, 0, 0); // X
    state = makeMove(state, 0, 1); // O
    state = makeMove(state, 0, 2); // X
    state = makeMove(state, 1, 2); // O
    state = makeMove(state, 1, 0); // X
    state = makeMove(state, 2, 0); // O
    state = makeMove(state, 1, 1); // X
    state = makeMove(state, 2, 2); // O
    state = makeMove(state, 2, 1); // X
    expect(state.status).toBe('draw');
    expect(state.winner).toBeNull();
  });

  it('keeps currentPlayer unchanged on winning move', () => {
    let state = createInitialState();
    state = makeMove(state, 0, 0); // X
    state = makeMove(state, 1, 0); // O
    state = makeMove(state, 0, 1); // X
    state = makeMove(state, 1, 1); // O
    state = makeMove(state, 0, 2); // X wins
    expect(state.currentPlayer).toBe('X');
  });
});
