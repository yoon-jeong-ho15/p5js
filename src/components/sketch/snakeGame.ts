import p5 from "p5";

let p: p5;

export default function snakeGame(inst: p5) {
    p = inst;

    let cols: number;
    let rows: number;
    let size = 25;
    let board: number[][] = [];
    let food: p5.Vector;
    let head: p5.Vector;
    let dir: p5.Vector;
    let gameOver = false;
    let length = 1;

    p.setup = () => {
        p.createCanvas(600, 600);
        p.frameRate(5);
        cols = p.width / size;
        rows = p.height / size;
        for (let i = 0; i < cols; i++) {
            board[i] = [];
            for (let j = 0; j < rows; j++) {
                board[i][j] = 0;
            }
        }
        generateFood();
        head = p.createVector(p.int(p.random(0, cols)), p.int(p.random(0, rows)));
        dir = p.createVector(0, 0);
    }

    p.draw = () => {
        p.background(200);
        update();
        displayBoard();
        board[food.x][food.y] = -1;
        if (gameOver) {
            p.textAlign(p.CENTER, p.CENTER);
            p.fill(0);
            p.textSize(50);
            p.text("GAME OVER", p.width / 2, p.height / 2);
        }
    }

    function displayBoard() {
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (board[i][j] == 0) {
                    p.fill(255);
                } else if (board[i][j] < 0) {
                    p.fill(255, 0, 0);
                } else if (board[i][j] > 0) {
                    p.fill(255, 255, 0);
                }

                p.rect(i * size, j * size, size, size);
                displayText(i, j);
            }
        }
    }

    function update() {
        head.add(dir);

        if (p.dist(head.x, head.y, food.x, food.y) === 0) {
            length += 1;
            generateFood();
        }
        if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
            gameOver = true;
            p.print("game over : wall")
        } else if (board[head.x][head.y] > 1) {
            gameOver = true;
            p.print("game over: self")
            dir.set(0, 0);
        } else {
            board[head.x][head.y] = 1 + length;
            removeTail();
        }
    }

    function removeTail() {
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (board[i][j] > 0) {
                    board[i][j] -= 1;
                }
            }
        }
    }

    function generateFood() {
        while (true) {
            food = p.createVector(p.int(p.random(0, cols)), p.int(p.random(0, rows)));
            if (board[food.x][food.y] == 0) {
                break;
            }
        }
    }

    function displayText(x: number, y: number) {
        p.textAlign(p.CENTER, p.CENTER);
        p.fill(0);
        p.textSize(10);
        p.text(board[x][y], x * size + size / 2, y * size + size / 2);
    }

    p.keyPressed = () => {
        if (p.key === p.LEFT_ARROW) {
            dir = p.createVector(-1, 0);
        } else if (p.key === p.RIGHT_ARROW) {
            dir = p.createVector(1, 0);
        } else if (p.key === p.UP_ARROW) {
            dir = p.createVector(0, -1);
        } else if (p.key === p.DOWN_ARROW) {
            dir = p.createVector(0, 1);
        }
    }
}