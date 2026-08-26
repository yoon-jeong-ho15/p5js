import p5 from "p5";

let p: p5;

export default function mouseFollowingDial(inst: p5) {
    p = inst;

    let dials: Dial[][] = [];
    let cols = 20;
    let rows = 20;


    p.setup = () => {
        p.createCanvas(600, 600);
        p.rectMode(p.CENTER);
        for (let i = 0; i < cols; i++) {
            dials[i] = [];
            for (let j = 0; j < rows; j++) {
                let space = p.width / cols;
                dials[i][j] = new Dial(i * space + space / 2, j * space + space / 2, space, space / 2);
            }
        }
    }

    p.draw = () => {
        p.background(220);
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                dials[i][j].moveDial();
            }
        }
    }
}

class Dial {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    moveDial() {
        p.push();
        p.translate(this.x, this.y);
        p.rotate(p.atan2(p.mouseY - this.y, p.mouseX - this.x));
        p.rect(0, 0, this.height, this.width);
        p.pop();
    }
}