import p5 from "p5";

let p: p5;

export default function interactiveRotatingBlocks(inst: p5) {
    p = inst;
    const cols = 30;
    const rows = 30;
    const bricks: Brick[] = [];

    p.setup = () => {
        p.createCanvas(600, 600);
        p.rectMode(p.CENTER);
        p.angleMode(p.DEGREES);
        p.noFill();
        p.strokeWeight(2);

        const size = p.width / cols;
        const halfSize = size / 2;
        const blockSize = size - 7;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                bricks.push(new Brick(i * size + halfSize, j * size + halfSize, blockSize));
            }
        }
    };

    p.draw = () => {
        p.background(0);

        const mx = p.mouseX;
        const my = p.mouseY;
        const interactionRadius = 35;
        const radiusSq = interactionRadius * interactionRadius;
        const total = bricks.length;

        for (let i = 0; i < total; i++) {
            const brick = bricks[i];
            brick.update(mx, my, radiusSq);
            brick.display();
        }
    };
}

class Brick {
    x: number;
    y: number;
    size: number;
    angle: number;

    constructor(x: number, y: number, size: number) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.angle = 0;
    }

    update(mx: number, my: number, radiusSq: number) {
        const dx = mx - this.x;
        const dy = my - this.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < radiusSq) {
            this.angle = Math.min(50, this.angle + 6);
        } else if (radiusSq < distSq && distSq < radiusSq * 1.5) {
            this.angle = Math.min(25, this.angle + 4);
        } else if (this.angle > 0) {
            this.angle = Math.max(0, this.angle - 2);
        }
    }

    display() {
        if (this.angle > 0) {
            p.stroke(255);
            p.push();
            p.translate(this.x, this.y);
            p.rotate(this.angle);
            p.rect(0, 0, this.size, this.size);
            p.pop();
        } else {
            p.stroke(100);
            p.rect(this.x, this.y, this.size, this.size);
        }
    }
}