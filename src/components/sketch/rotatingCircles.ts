import p5 from "p5";

let p: p5;

export default function rotatingCircles(inst: p5) {
    p = inst;

    let circles1: Pack;
    let circles2: Pack;

    p.setup = () => {
        p.createCanvas(600, 600);
        p.angleMode(p.DEGREES);
        circles1 = new Pack(p.width / 2, p.height / 2, 6, 180, 0);
        circles2 = new Pack(p.width / 2, p.height / 2, 6, 180, 180);
    };

    p.draw = () => {
        p.background(0, 10);
        circles1.update(1);
        circles1.display();
        circles2.update(1);
        circles2.display();
    }
}

class Pack {
    x: number;
    y: number;
    n: number;
    r: number;
    size: number;
    angle: number;
    startAngle: number;
    circles: Circle[];

    constructor(x: number, y: number, n: number, size: number, startAngle: number) {
        this.x = x;
        this.y = y;
        this.n = n;
        this.r = 150;
        this.size = size;
        this.angle = size / this.n;
        this.startAngle = startAngle;
        this.circles = [];

        this.createCircles();
    }

    createCircles() {
        for (let i = 0; i < this.n; i++) {
            let x = this.x + this.r * p.cos(this.angle * i + this.startAngle);
            let y = this.y + this.r * p.sin(this.angle * i + this.startAngle);
            this.circles[i] = new Circle(x, y, 10);
        }
    }

    update(speed: number) {
        this.startAngle += speed;
        for (let i = 0; i < this.n; i++) {
            this.circles[i].x = this.x + this.r * p.cos(this.angle * i + this.startAngle);
            this.circles[i].y = this.y + this.r * p.sin(this.angle * i + this.startAngle);
        }
    }

    display() {
        for (let i = 0; i < this.n; i++) {
            this.circles[i].update();
            this.circles[i].display();
        }
    }
}

class Circle {
    x: number;
    y: number;
    r: number;
    dir: number;

    constructor(x: number, y: number, r: number) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.dir = 1;
    }

    update() {
        if (this.r > 50 || this.r < 0) {
            this.dir = -this.dir;
        }
        this.r += this.dir;
    }

    display() {
        p.noFill();
        p.stroke(255);
        p.ellipse(this.x, this.y, this.r * 2, this.r * 2);
    }
}