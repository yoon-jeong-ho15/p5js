import p5 from "p5";

let p: p5;

export default function eight(inst: p5) {
    p = inst;

    const r = 120;
    let dots: Dot[] = [];
    const speed = 2;

    p.setup = () => {
        p.createCanvas(600, 600);
        p.angleMode(p.DEGREES);
        for (let i = 0; i < 5; i++) {
            dots.push(new Dot(p.width / 2, p.height / 2, r, (i * 5), 720));
        }
    };

    p.draw = () => {
        p.background(220);
        p.translate(p.width / 2, p.height / 2);

        p.noFill();
        p.ellipse(-r, 0, r * 2, r * 2);
        p.ellipse(r, 0, r * 2, r * 2);

        dots.forEach((d: Dot) => {
            d.update(speed);
            d.display();
        });

    };
}

class Dot {
    x: number;
    y: number;
    r: number;
    t: number;
    max: number;

    constructor(x: number, y: number, r: number, t: number, max: number) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.t = t;
        this.max = max;
    }

    update(speed: number) {
        if (this.t < this.max / 2) {
            this.x = this.r * p.cos(this.t) - this.r;
            this.y = this.r * p.sin(this.t);
        } else {
            this.x = -this.r * p.cos(this.t) + this.r;
            this.y = this.r * p.sin(this.t);
        }

        this.t += speed;
        if (this.t >= this.max) {
            this.t -= this.max;
        }
    }

    display() {
        p.fill(255);
        p.ellipse(this.x, this.y, 20, 20);
    }
}
