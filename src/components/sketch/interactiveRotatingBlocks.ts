import p5 from "p5";

let p: p5;

export default function interactiveRotatingBlocks(inst: p5) {
    p = inst;

    let cols: number;
    let rows: number;
    let size = 10;
    let blocks: Block[] = [];

    p.setup = () => {
        p.createCanvas(600, 600);
        p.rectMode(p.CENTER);
        p.angleMode(p.DEGREES);

        cols = p.width / size;
        rows = p.height / size;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                let x = i * size + size / 2;
                let y = j * size + size / 2;
                let b = new Block(x, y, size - 3);
                blocks.push(b);
            }
        }
    };

    p.draw = () => {
        p.background(0);
        for (let i = 0; i < blocks.length; i++) {
            blocks[i].update();
            blocks[i].display();
        }
    };
}

class Block {
    x: number;
    y: number;
    size: number;
    angle: number;
    isHit: boolean;

    constructor(x: number, y: number, size: number) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.angle = 0;
        this.isHit = false;
    }

    update() {
        let d = p.dist(this.x, this.y, p.mouseX, p.mouseY);
        if (d < 40) {
            this.isHit = true;
        } else {
            this.isHit = false;
        }

    }

    display() {
        if (this.isHit) {
            this.angle += 4;
            if (this.angle > 45) {
                this.angle = 45;
            }
        } else {
            this.angle -= 1;
            if (this.angle < 0) {
                this.angle = 0;
            }
        }
        let strokeColor = this.angle > 0 ? 255 : 100;
        p.push();
        p.translate(this.x, this.y);
        p.rotate(this.angle);
        p.noFill();
        p.stroke(strokeColor);
        p.rect(0, 0, this.size, this.size);
        p.pop();
    }

}