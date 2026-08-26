import p5 from "p5";


interface Point {
    readonly x: number;
    readonly y: number;
}

interface GameConfig {
    readonly width: number;
    readonly height: number;
    readonly cellSize: number;
    readonly cols: number;
    readonly rows: number;
    readonly frameRate: number;
}

interface GameState {
    readonly snake: readonly Point[];
    readonly direction: Point;
    readonly nextDirection: Point;
    readonly food: Point;
    readonly isGameOver: boolean;
    readonly score: number;
}

const DIRECTIONS: Record<"UP" | "DOWN" | "LEFT" | "RIGHT" | "NONE", Point> = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
    NONE: { x: 0, y: 0 },
};

const arePointsEqual = (a: Point, b: Point): boolean => a.x === b.x && a.y === b.y;

const isOppositeDirection = (a: Point, b: Point): boolean =>
    a.x + b.x === 0 && a.y + b.y === 0 && (a.x !== 0 || a.y !== 0);

const isOutOfBounds = (point: Point, config: GameConfig): boolean =>
    point.x < 0 || point.x >= config.cols || point.y < 0 || point.y >= config.rows;

const isSelfColliding = (head: Point, body: readonly Point[]): boolean =>
    body.some((segment) => arePointsEqual(segment, head));

const getAllCells = (config: GameConfig): readonly Point[] =>
    Array.from({ length: config.cols * config.rows }, (_, index) => ({
        x: index % config.cols,
        y: Math.floor(index / config.cols),
    }));

const getEmptyCells = (snake: readonly Point[], config: GameConfig): readonly Point[] =>
    getAllCells(config).filter(
        (cell) => !snake.some((segment) => arePointsEqual(segment, cell))
    );

const spawnFood = (
    snake: readonly Point[],
    config: GameConfig,
    randomFn: (max: number) => number
): Point => {
    const emptyCells = getEmptyCells(snake, config);
    if (emptyCells.length === 0) return { x: 0, y: 0 };
    const randomIndex = randomFn(emptyCells.length);
    return emptyCells[randomIndex];
};

const moveSnake = (
    snake: readonly Point[],
    direction: Point,
    willGrow: boolean
): readonly Point[] => {
    const head = snake[0];
    const newHead: Point = { x: head.x + direction.x, y: head.y + direction.y };
    return willGrow ? [newHead, ...snake] : [newHead, ...snake.slice(0, -1)];
};

const createInitialState = (
    config: GameConfig,
    randomFn: (max: number) => number
): GameState => {
    const initialHead: Point = {
        x: Math.floor(config.cols / 2),
        y: Math.floor(config.rows / 2),
    };
    const initialSnake: readonly Point[] = [initialHead];
    const initialFood = spawnFood(initialSnake, config, randomFn);

    return {
        snake: initialSnake,
        direction: DIRECTIONS.NONE,
        nextDirection: DIRECTIONS.NONE,
        food: initialFood,
        isGameOver: false,
        score: 0,
    };
};

const changeDirection = (state: GameState, newDir: Point): GameState => {
    if (state.isGameOver) return state;
    if (isOppositeDirection(state.direction, newDir)) return state;

    return {
        ...state,
        nextDirection: newDir,
    };
};

const stepGame = (
    state: GameState,
    config: GameConfig,
    randomFn: (max: number) => number
): GameState => {
    if (state.isGameOver) return state;

    if (state.nextDirection.x === 0 && state.nextDirection.y === 0) {
        return state;
    }

    const currentDirection = state.nextDirection;
    const currentHead = state.snake[0];
    const newHead: Point = {
        x: currentHead.x + currentDirection.x,
        y: currentHead.y + currentDirection.y,
    };

    const hitWall = isOutOfBounds(newHead, config);
    const hitBody = isSelfColliding(newHead, state.snake);

    if (hitWall || hitBody) {
        return {
            ...state,
            isGameOver: true,
            direction: DIRECTIONS.NONE,
            nextDirection: DIRECTIONS.NONE,
        };
    }

    const willEatFood = arePointsEqual(newHead, state.food);
    const nextSnake = moveSnake(state.snake, currentDirection, willEatFood);
    const nextFood = willEatFood ? spawnFood(nextSnake, config, randomFn) : state.food;

    return {
        ...state,
        snake: nextSnake,
        direction: currentDirection,
        food: nextFood,
        score: state.score + (willEatFood ? 1 : 0),
    };
};

const renderGrid = (p: p5, config: GameConfig) => {
    p.stroke(220);
    p.strokeWeight(1);
    p.fill(255);

    getAllCells(config).forEach(({ x, y }) => {
        p.rect(x * config.cellSize, y * config.cellSize, config.cellSize, config.cellSize);
    });
};

const renderFood = (p: p5, food: Point, cellSize: number) => {
    p.fill(255, 69, 58);
    p.stroke(200, 30, 30);
    p.rect(food.x * cellSize, food.y * cellSize, cellSize, cellSize, 4);
};

const renderSnake = (p: p5, snake: readonly Point[], cellSize: number) => {
    snake.forEach((segment, index) => {
        const isHead = index === 0;
        if (isHead) {
            p.fill(255, 204, 0);
            p.stroke(210, 160, 0);
        } else {
            p.fill(255, 230, 80);
            p.stroke(220, 190, 50);
        }
        p.rect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize, isHead ? 6 : 2);
    });
};

const renderScore = (p: p5, score: number) => {
    p.noStroke();
    p.fill(50);
    p.textSize(14);
    p.textAlign(p.LEFT, p.TOP);
    p.text(`Score: ${score}`, 10, 10);
};

const renderGameOver = (p: p5, config: GameConfig) => {
    p.fill(0, 0, 0, 150);
    p.noStroke();
    p.rect(0, 0, config.width, config.height);

    p.textAlign(p.CENTER, p.CENTER);
    p.fill(255, 60, 60);
    p.textSize(48);
    p.textStyle(p.BOLD);
    p.text("GAME OVER", config.width / 2, config.height / 2 - 20);

    p.fill(255);
    p.textSize(16);
    p.textStyle(p.NORMAL);
    p.text("Press SPACE to Restart", config.width / 2, config.height / 2 + 30);
};

const render = (p: p5, state: GameState, config: GameConfig) => {
    p.background(240);
    renderGrid(p, config);
    renderFood(p, state.food, config.cellSize);
    renderSnake(p, state.snake, config.cellSize);
    renderScore(p, state.score);

    if (state.isGameOver) {
        renderGameOver(p, config);
    }
};

export default function snakeGame(p: p5) {
    const config: GameConfig = {
        width: 600,
        height: 600,
        cellSize: 25,
        cols: 600 / 25,
        rows: 600 / 25,
        frameRate: 7,
    };

    let state: GameState;

    p.setup = () => {
        p.createCanvas(config.width, config.height);
        p.frameRate(config.frameRate);
        state = createInitialState(config, (max) => p.floor(p.random(max)));
    };

    p.draw = () => {
        state = stepGame(state, config, (max) => p.floor(p.random(max)));
        render(p, state, config);
    };

    p.keyPressed = () => {
        const keyDirectionMap: Record<string, Point> = {
            [p.LEFT_ARROW]: DIRECTIONS.LEFT,
            [p.RIGHT_ARROW]: DIRECTIONS.RIGHT,
            [p.UP_ARROW]: DIRECTIONS.UP,
            [p.DOWN_ARROW]: DIRECTIONS.DOWN,
        };

        const nextDir = keyDirectionMap[p.key];
        if (nextDir) {
            state = changeDirection(state, nextDir);
        } else if (state.isGameOver && (p.key === " " || p.keyCode === 32)) {
            state = createInitialState(config, (max) => p.floor(p.random(max)));
        }
    };
}