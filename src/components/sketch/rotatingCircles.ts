import p5 from "p5";

let p: p5;

export default function rotatingCircles(inst: p5) {
    p = inst;

    let circles1: Pack;
    let circles2: Pack;
    let speed = 1;

    p.setup = () => {
        p.createCanvas(600, 600);
        p.angleMode(p.DEGREES);
        circles1 = new Pack(p.width / 2, p.height / 2, 6, 180, 0);
        circles2 = new Pack(p.width / 2, p.height / 2, 6, 180, 180);
    };

    p.draw = () => {
        p.background(0, 10);
        circles1.displayPack();
        circles1.movePack(speed);
        circles2.displayPack();
        circles2.movePack(speed);
    };
}

class Pack {
    packx: number;
    packy: number;
    pack: Circle[];
    n: number;
    angle: number;
    packr: number;
    startAngle: number;

    constructor(x: number, y: number, n: number, size: number, startAngle: number) {
        this.packx = x;
        this.packy = y;
        this.pack = [];

        this.n = n;
        this.angle = size / this.n;
        this.packr = 150;
        this.startAngle = startAngle;
        this.createCircles();
    }

    createCircles() {
        let scl = 0.1;
        for (let i = 0; i < this.n; i++) {
            this.pack[i] = new Circle(
                this.packx + this.packr * p.cos(this.startAngle + this.angle * i),
                this.packy + this.packr * p.sin(this.startAngle + this.angle * i),
                (i + 1) * scl * 25
            );
        }
    }

    displayPack() {
        for (let i = 0; i < this.n; i++) {
            this.pack[i].display();
            this.pack[i].move();
        }
    }

    movePack(speed: number) {
        this.startAngle += speed;
        for (let i = 0; i < this.n; i++) {
            this.pack[i].x = this.packx + this.packr * p.cos(this.startAngle + this.angle * i);
            this.pack[i].y = this.packy + this.packr * p.sin(this.startAngle + this.angle * i);
        }
    }
}

class Circle {
    x: number;
    y: number;
    r: number;
    dr: number;

    constructor(x: number, y: number, r: number) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.dr = 1;
    }

    display() {
        p.noFill();
        p.stroke(255);
        p.ellipse(this.x, this.y, this.r * 2, this.r * 2);
    }

    move() {
        if (this.r > 50 || this.r < 0) {
            this.dr = this.dr * -1;
        }
        this.r = this.r + this.dr;
    }
}