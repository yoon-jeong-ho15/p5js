import p5 from "p5";

let p: p5;

export default function wavePattern(inst: p5) {
    p = inst;

    let grid: Cell[][] = [];
    let cols = 25;
    let rows = 25;
    let loc = 37.5;

    p.setup = () => {
        p.createCanvas(600, 600);
        let colSize = p.width / cols;
        let rowSize = p.height / rows;
        for (let i = -1; i < cols + 1; i++) {
            grid[i] = [];
            for (let j = -1; j < rows + 1; j++) {
                grid[i][j] = new Cell(
                    colSize / 2 + i * colSize,
                    rowSize / 2 + j * rowSize,
                    colSize / 2 + 12,
                    i * loc + j * loc
                );
            }
        }
    };

    p.draw = () => {
        p.background(220);
        for (let i = -1; i < cols + 1; i++) {
            for (let j = -1; j < rows + 1; j++) {
                grid[i][j].update();
                grid[i][j].display();
            }
        }
    };
}

class Cell {
    r: number;
    angle: number;
    x: number;
    y: number;
    x0: number;
    y0: number;

    constructor(x0: number, y0: number, r: number, angle: number) {
        this.r = r;
        this.angle = angle;
        this.x0 = x0;
        this.y0 = y0;
        this.x = 0;
        this.y = 0;
    }

    update() {
        this.x = this.r * Math.cos(this.angle);
        this.y = this.r * Math.sin(this.angle);
        this.angle += 0.04;
    }

    display() {
        // p.line(this.x0, this.y0, this.x + this.x0, this.y + this.y0);
        p.ellipse(this.x + this.x0, this.y + this.y0, 4, 4);
    }
}