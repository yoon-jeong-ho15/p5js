import p5 from "p5";

// ==========================================
// 1. Domain Types & State Model (Immutable)
// ==========================================

export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = readonly (readonly Cell[])[];

export interface Point {
    readonly x: number;
    readonly y: number;
}

export interface WinningInfo {
    readonly winner: Player;
    readonly line: readonly Point[];
}

export type GameStatus =
    | { readonly type: "PLAYING"; readonly turn: Player }
    | { readonly type: "WON"; readonly winner: Player; readonly winningLine: readonly Point[] }
    | { readonly type: "DRAW" };

export interface GameConfig {
    readonly width: number;
    readonly height: number;
    readonly cols: number;
    readonly rows: number;
    readonly boardX: number;
    readonly boardY: number;
    readonly boardSize: number;
    readonly cellSize: number;
    readonly cellGap: number;
    readonly cellRadius: number;
}

export interface GameState {
    readonly board: Board;
    readonly status: GameStatus;
    readonly moveCount: number;
}

// ==========================================
// 2. Declarative Win Combinations & Constants
// ==========================================

const WINNING_COMBINATIONS: readonly (readonly Point[])[] = [
    // Rows (Horizontal)
    [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
    [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
    [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
    // Columns (Vertical)
    [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }],
    [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
    [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
    // Diagonals
    [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }],
    [{ x: 2, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 2 }],
];

// Color Theme Tokens
const THEME = {
    bg: "#f1f5f9",           // Slate 100
    cardBg: "#ffffff",       // White
    border: "#cbd5e1",       // Slate 300
    borderLight: "#e2e8f0",  // Slate 200
    textPrimary: "#0f172a",  // Slate 900
    textSecondary: "#64748b",// Slate 500
    hoverBg: "#f8fafc",      // Slate 50
    // Player X: Modern Blue
    playerX: "#2563eb",      // Blue 600
    playerXLight: "#dbeafe", // Blue 100
    // Player O: Modern Coral/Rose
    playerO: "#e11d48",      // Rose 600
    playerOLight: "#ffe4e6", // Rose 100
    // Win / Success: Emerald
    winLine: "#10b981",      // Emerald 500
    winCellBg: "#dcfce7",    // Emerald 100
    winCellBorder: "#34d399",// Emerald 400
    // Draw / Neutral: Amber
    drawBadge: "#f59e0b",    // Amber 500
    drawBadgeBg: "#fef3c7",  // Amber 100
} as const;

// ==========================================
// 3. Pure Helper Functions & State Transitions
// ==========================================

const arePointsEqual = (a: Point, b: Point): boolean => a.x === b.x && a.y === b.y;

const isPointInLine = (point: Point, line: readonly Point[]): boolean =>
    line.some((p) => arePointsEqual(p, point));

const getAllCells = (config: GameConfig): readonly Point[] =>
    Array.from({ length: config.cols * config.rows }, (_, index) => ({
        x: index % config.cols,
        y: Math.floor(index / config.cols),
    }));

const createEmptyBoard = (config: GameConfig): Board =>
    Array.from({ length: config.rows }, () =>
        Array.from({ length: config.cols }, () => null)
    );

const findWinningInfo = (board: Board): WinningInfo | null => {
    const winningCombo = WINNING_COMBINATIONS.find((line) => {
        const [first, ...rest] = line.map(({ x, y }) => board[y][x]);
        return first !== null && rest.every((cell) => cell === first);
    });

    if (!winningCombo) return null;
    const winner = board[winningCombo[0].y][winningCombo[0].x]!;
    return { winner, line: winningCombo };
};

const isBoardFull = (board: Board): boolean =>
    board.every((row) => row.every((cell) => cell !== null));

const getNextPlayer = (player: Player): Player => (player === "X" ? "O" : "X");

const determineStatus = (board: Board, nextTurn: Player): GameStatus => {
    const winInfo = findWinningInfo(board);
    if (winInfo) {
        return {
            type: "WON",
            winner: winInfo.winner,
            winningLine: winInfo.line,
        };
    }
    if (isBoardFull(board)) {
        return { type: "DRAW" };
    }
    return { type: "PLAYING", turn: nextTurn };
};

const createInitialState = (
    config: GameConfig,
    startingPlayer: Player = "X"
): GameState => ({
    board: createEmptyBoard(config),
    status: { type: "PLAYING", turn: startingPlayer },
    moveCount: 0,
});

const makeMove = (state: GameState, point: Point): GameState => {
    if (state.status.type !== "PLAYING") return state;

    const { x, y } = point;
    if (x < 0 || x >= 3 || y < 0 || y >= 3) return state;
    if (state.board[y][x] !== null) return state;

    const currentTurn = state.status.turn;
    const nextBoard: Board = state.board.map((row, rIdx) =>
        row.map((cell, cIdx) => (rIdx === y && cIdx === x ? currentTurn : cell))
    );

    const nextPlayer = getNextPlayer(currentTurn);
    const nextStatus = determineStatus(nextBoard, nextPlayer);

    return {
        board: nextBoard,
        status: nextStatus,
        moveCount: state.moveCount + 1,
    };
};

const getCellAtMouse = (
    mouseX: number,
    mouseY: number,
    config: GameConfig
): Point | null => {
    const relX = mouseX - config.boardX;
    const relY = mouseY - config.boardY;

    if (relX < 0 || relX >= config.boardSize || relY < 0 || relY >= config.boardSize) {
        return null;
    }

    const step = config.cellSize + config.cellGap;
    const col = Math.floor(relX / step);
    const row = Math.floor(relY / step);

    const withinCellX = relX - col * step <= config.cellSize;
    const withinCellY = relY - row * step <= config.cellSize;

    if (col >= 0 && col < config.cols && row >= 0 && row < config.rows && withinCellX && withinCellY) {
        return { x: col, y: row };
    }
    return null;
};

const getCellBounds = (point: Point, config: GameConfig) => {
    const x = config.boardX + point.x * (config.cellSize + config.cellGap);
    const y = config.boardY + point.y * (config.cellSize + config.cellGap);
    return {
        x,
        y,
        size: config.cellSize,
        centerX: x + config.cellSize / 2,
        centerY: y + config.cellSize / 2,
    };
};

// ==========================================
// 4. Declarative Render Functions (View = f(State))
// ==========================================

const renderHeader = (p: p5, config: GameConfig, state: GameState) => {
    const headerX = config.boardX;
    const headerY = 20;
    const headerW = config.boardSize;
    const headerH = 68;

    // Header Background Card
    p.fill(THEME.cardBg);
    p.stroke(THEME.borderLight);
    p.strokeWeight(1.5);
    p.rect(headerX, headerY, headerW, headerH, 14);

    if (state.status.type === "PLAYING") {
        const isX = state.status.turn === "X";
        const badgeColor = isX ? THEME.playerX : THEME.playerO;
        const badgeBg = isX ? THEME.playerXLight : THEME.playerOLight;

        // Turn Label
        p.noStroke();
        p.fill(THEME.textSecondary);
        p.textAlign(p.LEFT, p.CENTER);
        p.textSize(14);
        p.textStyle(p.NORMAL);
        p.text("CURRENT TURN", headerX + 24, headerY + headerH / 2);

        // Turn Badge
        const badgeX = headerX + headerW - 130;
        const badgeY = headerY + 16;
        const badgeW = 106;
        const badgeH = 36;

        p.fill(badgeBg);
        p.rect(badgeX, badgeY, badgeW, badgeH, 18);

        p.fill(badgeColor);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(16);
        p.textStyle(p.BOLD);
        p.text(`PLAYER ${state.status.turn}`, badgeX + badgeW / 2, badgeY + badgeH / 2);
    } else if (state.status.type === "WON") {
        const isX = state.status.winner === "X";
        const winnerColor = isX ? THEME.playerX : THEME.playerO;

        p.noStroke();
        p.textAlign(p.CENTER, p.CENTER);
        p.fill(winnerColor);
        p.textSize(22);
        p.textStyle(p.BOLD);
        p.text(`🎉 PLAYER ${state.status.winner} WINS!`, headerX + headerW / 2, headerY + headerH / 2);
    } else {
        // DRAW
        p.noStroke();
        p.textAlign(p.CENTER, p.CENTER);
        p.fill(THEME.drawBadge);
        p.textSize(22);
        p.textStyle(p.BOLD);
        p.text("🤝 IT'S A DRAW!", headerX + headerW / 2, headerY + headerH / 2);
    }
};

const renderMarkX = (p: p5, cx: number, cy: number, size: number, alpha: number = 255) => {
    const offset = size * 0.26;
    p.push();
    const c = p.color(THEME.playerX);
    c.setAlpha(alpha);
    p.stroke(c);
    p.strokeWeight(10);
    p.strokeCap(p.ROUND);
    p.line(cx - offset, cy - offset, cx + offset, cy + offset);
    p.line(cx + offset, cy - offset, cx - offset, cy + offset);
    p.pop();
};

const renderMarkO = (p: p5, cx: number, cy: number, size: number, alpha: number = 255) => {
    const diameter = size * 0.54;
    p.push();
    const c = p.color(THEME.playerO);
    c.setAlpha(alpha);
    p.stroke(c);
    p.strokeWeight(10);
    p.noFill();
    p.ellipse(cx, cy, diameter, diameter);
    p.pop();
};

const renderCell = (
    p: p5,
    point: Point,
    cell: Cell,
    isWinningCell: boolean,
    isHovered: boolean,
    currentTurn: Player | null,
    config: GameConfig
) => {
    const { x, y, size, centerX, centerY } = getCellBounds(point, config);

    // 1. Cell Background
    if (isWinningCell) {
        p.fill(THEME.winCellBg);
        p.stroke(THEME.winCellBorder);
        p.strokeWeight(2.5);
    } else if (isHovered && cell === null && currentTurn !== null) {
        p.fill(THEME.hoverBg);
        p.stroke(THEME.border);
        p.strokeWeight(2);
    } else {
        p.fill(THEME.cardBg);
        p.stroke(THEME.borderLight);
        p.strokeWeight(1.5);
    }

    p.rect(x, y, size, size, config.cellRadius);

    // 2. Cell Content / Hover Preview
    if (cell === "X") {
        renderMarkX(p, centerX, centerY, size);
    } else if (cell === "O") {
        renderMarkO(p, centerX, centerY, size);
    } else if (isHovered && currentTurn !== null) {
        // Faint preview for interactive feedback
        if (currentTurn === "X") {
            renderMarkX(p, centerX, centerY, size, 70);
        } else {
            renderMarkO(p, centerX, centerY, size, 70);
        }
    }
};

const renderWinningLine = (
    p: p5,
    winningLine: readonly Point[],
    config: GameConfig
) => {
    const startBounds = getCellBounds(winningLine[0], config);
    const endBounds = getCellBounds(winningLine[2], config);

    const angle = Math.atan2(
        endBounds.centerY - startBounds.centerY,
        endBounds.centerX - startBounds.centerX
    );
    const extension = 20;

    const startX = startBounds.centerX - Math.cos(angle) * extension;
    const startY = startBounds.centerY - Math.sin(angle) * extension;
    const endX = endBounds.centerX + Math.cos(angle) * extension;
    const endY = endBounds.centerY + Math.sin(angle) * extension;

    p.push();
    p.stroke(THEME.winLine);
    p.strokeWeight(10);
    p.strokeCap(p.ROUND);
    p.line(startX, startY, endX, endY);
    p.pop();
};

const renderFooter = (p: p5, config: GameConfig, state: GameState) => {
    const isGameOver = state.status.type !== "PLAYING";
    const textY = config.height - 18;

    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(13);

    if (isGameOver) {
        p.fill(THEME.textPrimary);
        p.textStyle(p.BOLD);
        p.text("Press SPACE or Click anywhere to restart", config.width / 2, textY);
    } else {
        p.fill(THEME.textSecondary);
        p.textStyle(p.NORMAL);
        p.text("Click any empty cell to place your mark", config.width / 2, textY);
    }
};

const render = (
    p: p5,
    state: GameState,
    hoveredCell: Point | null,
    config: GameConfig
) => {
    // 1. Clear & Background
    p.background(THEME.bg);

    // 2. Header
    renderHeader(p, config, state);

    // 3. Grid Cells
    const winningLine = state.status.type === "WON" ? state.status.winningLine : [];
    const currentTurn = state.status.type === "PLAYING" ? state.status.turn : null;

    getAllCells(config).forEach((point) => {
        const cell = state.board[point.y][point.x];
        const isWinning = isPointInLine(point, winningLine);
        const isHovered = hoveredCell !== null && arePointsEqual(point, hoveredCell);

        renderCell(p, point, cell, isWinning, isHovered, currentTurn, config);
    });

    // 4. Winning Strike Line (if won)
    if (state.status.type === "WON") {
        renderWinningLine(p, state.status.winningLine, config);
    }

    // 5. Footer Instructions
    renderFooter(p, config, state);
};

// ==========================================
// 5. Main p5 Instance Function
// ==========================================

export default function ticTacToe(p: p5) {
    const config: GameConfig = {
        width: 600,
        height: 600,
        cols: 3,
        rows: 3,
        boardX: 75,
        boardY: 104,
        boardSize: 450,
        cellSize: 142,
        cellGap: 12,
        cellRadius: 14,
    };

    const getRandomStartingPlayer = (): Player =>
        p.random() < 0.5 ? "X" : "O";

    let state: GameState;

    p.setup = () => {
        p.createCanvas(config.width, config.height);
        state = createInitialState(config, getRandomStartingPlayer());
    };

    p.draw = () => {
        const hoveredCell = getCellAtMouse(p.mouseX, p.mouseY, config);
        render(p, state, hoveredCell, config);
    };

    p.mousePressed = () => {
        // If game is over, any click restarts
        if (state.status.type !== "PLAYING") {
            state = createInitialState(config, getRandomStartingPlayer());
            return;
        }

        const clickedCell = getCellAtMouse(p.mouseX, p.mouseY, config);
        if (clickedCell) {
            state = makeMove(state, clickedCell);
        }
    };

    p.keyPressed = () => {
        // SPACE key restarts game when over
        if (p.key === " " || p.keyCode === 32) {
            state = createInitialState(config, getRandomStartingPlayer());
        }
    };
}