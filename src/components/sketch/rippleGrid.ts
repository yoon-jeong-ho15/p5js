import p5 from "p5";

let p: p5;

export default function rippleGrid(inst: p5) {
    p = inst;

    let cols: number;
    let rows: number;
    let size = 10;

    let bricks: Brick[] = [];
    let ripples: Ripple[] = [];
    p.setup = () => {
        p.createCanvas(600, 600);
        p.angleMode(p.DEGREES);
        p.rectMode(p.CENTER);
        p.noFill();
        p.strokeWeight(1);

        cols = p.width / size;
        rows = p.height / size;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                let x = i * size + size / 2;
                let y = j * size + size / 2;
                bricks.push(new Brick(x, y, size - 3));
            }
        }

    }

    p.draw = () => {
        p.background(0);
        for (let i = ripples.length - 1; i >= 0; i--) {
            ripples[i].update();

            if (ripples[i].r > 200) {
                ripples.splice(i, 1);
            }
        }

        for (let i = 0; i < bricks.length; i++) {
            bricks[i].update(ripples);
            bricks[i].display();
        }
    }

    p.mouseClicked = () => {
        let r = new Ripple(p.mouseX, p.mouseY);
        ripples.push(r);
    }
}

class Brick {
    x: number;
    y: number;
    size: number;
    isHit: boolean;
    angle: number;

    constructor(x: number, y: number, size: number) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.isHit = false;
        this.angle = 0;
    }

    update(ripples: Ripple[]) {
        this.isHit = false;
        for (let i = 0; i < ripples.length; i++) {
            let r = ripples[i];
            let d = p.dist(this.x, this.y, r.x, r.y);

            if (Math.abs(d - r.r) < 10) {
                this.isHit = true;
                break;
            }
        }
    }

    display() {
        let targetAngle = this.isHit ? 45 : 0;
        this.angle = p.lerp(this.angle, targetAngle, 0.2);
        let strokeColor = this.isHit ? 255 : 100;

        p.push();
        p.translate(this.x, this.y);
        p.stroke(strokeColor);
        p.rotate(this.angle);
        p.rect(0, 0, this.size, this.size);
        p.pop();
    }
}

class Ripple {
    x: number;
    y: number;
    r: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.r = 5;
    }

    update() {
        this.r += 1.5;
    }

}