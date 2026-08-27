import p5 from "p5";

let p: p5;

export default function mouseFollowingDots(inst: p5) {
    p = inst;

    let cols = 30;
    let rows = 30;
    let dots: Dot[][] = [];

    p.setup = () => {
        p.createCanvas(600, 600);
        let size = p.width / cols;
        for (let i = -1; i < cols + 1; i++) {
            dots[i] = [];
            for (let j = -1; j < rows + 1; j++) {
                dots[i][j] = new Dot(i * size + (size / 2), j * size + (size / 2));
            }
        }
    }

    p.draw = () => {
        p.background(220);
        for (let i = -1; i < cols + 1; i++) {
            for (let j = -1; j < rows + 1; j++) {
                let angle = p.atan2(p.mouseY - dots[i][j].yo, p.mouseX - dots[i][j].xo);
                // let isInsideCanvas = p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
                // if (isInsideCanvas) {
                dots[i][j].rotate(angle);
                // } else {
                // dots[i][j].rotate(0);
                // }
                dots[i][j].display();
            }
        }
    }

}

class Dot {
    xo: number;
    yo: number;
    x: number;
    y: number;
    r: number;
    angle: number;

    constructor(xo: number, yo: number) {
        this.xo = xo;
        this.yo = yo;
        this.x = 0;
        this.y = 0;
        this.r = 30;
        this.angle = 0;
    }

    rotate(angle: number) {
        this.x = this.r * p.cos(angle);
        this.y = this.r * p.sin(angle);
    }

    display() {
        p.ellipse(this.x + this.xo, this.y + this.yo, 2, 2);
    }
}