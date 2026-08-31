import p5 from "p5";

let p: p5;

export default function interactiveRotatingBlocks(inst: p5) {
    p = inst;
    let cols = 30;
    let rows = 30;
    let bricks: Brick[][] = [];

    p.setup = () => {
        p.createCanvas(600, 600);
        p.rectMode(p.CENTER);
        p.angleMode(p.DEGREES);

        for (let i = 0; i < cols; i++) {
            bricks[i] = [];
            for (let j = 0; j < rows; j++) {
                let size = p.width / cols;
                bricks[i][j] = new Brick(i * size + size / 2, j * size + size / 2, size - 7);
            }
        }
    }

    p.draw = () => {
        p.background(0);
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                bricks[i][j].display(35);
            }
        }
    }


}

class Brick {
    x: number;
    y: number;
    size: number;
    angle: number;

    constructor(x: number, y: number, size: number,) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.angle = 0;
    }

    display(d: number) {
        p.push();
        p.translate(this.x, this.y);
        this.move(d);
        p.rotate(this.angle);
        p.noFill();
        p.strokeWeight(2);
        if (this.angle > 0) {
            p.stroke(255);
        } else {
            p.stroke(100);
        }
        p.rect(0, 0, this.size, this.size);
        p.pop();
    }

    move(d: number) {
        let distance = p.dist(p.mouseX, p.mouseY, this.x, this.y);
        if (distance < d) {
            this.angle += 6;
            if (this.angle >= 50) {
                this.angle = 50;
            }
        } else {
            this.angle -= 2;
            if (this.angle <= 0) {
                this.angle = 0;
            }
        }
    }
}