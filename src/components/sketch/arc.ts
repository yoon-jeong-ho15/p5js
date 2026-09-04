import p5 from "p5";

let p: p5;

export default function arc(inst: p5) {
    p = inst;

    const r = 150;
    let dots: Dot[] = [];
    const speed = 2;

    p.setup = () => {
        p.createCanvas(600, 600);
        p.angleMode(p.DEGREES);
        dots.push(new Dot(r, 0, 270));
    };

    p.draw = () => {
        p.background(220);
        p.translate(p.width / 2, p.height / 2);

        // 0~270도 arc 궤도선
        p.noFill();
        p.stroke(0);
        p.strokeWeight(2);
        p.arc(0, 0, r * 2, r * 2, 0, 270);

        // 궤도를 따라 움직이는 원
        dots.forEach((d: Dot) => {
            d.update(speed);
            d.display();
        });
    };
}

class Dot {
    x: number = 0;
    y: number = 0;
    r: number;
    t: number;
    max: number;
    dir = 1;


    constructor(r: number, t: number, max: number) {
        this.r = r;
        this.t = t;
        this.max = max;
    }

    update(speed: number) {
        this.x = this.r * p.cos(this.t);
        this.y = this.r * p.sin(this.t);

        this.t += speed * this.dir;

        if (this.t >= this.max) {
            this.t = this.max;
            this.dir = -1;
        }
        if (this.t <= 0) {
            this.t = 0;
            this.dir = 1;
        }
    }

    display() {
        p.fill(255);
        p.stroke(0);
        p.strokeWeight(1.5);
        p.ellipse(this.x, this.y, 20, 20);
    }
}
