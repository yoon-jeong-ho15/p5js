import p5 from "p5";

let p: p5;

export default function rainbowCircle(inst: p5) {
    p = inst;

    let count = 12;
    let circles: Circle[] = [];
    let colors: p5.Color[] = [];
    let angles: number[] = [];

    p.setup = () => {
        p.createCanvas(600, 600);
        colors = [
            p.color(255, 0, 0),
            p.color(0, 255, 0),
            p.color(0, 0, 255)
        ];

        for (let i = 0; i < count; i++) {
            angles[i] = (i * (p.TWO_PI / count));
            circles[i] = new Circle(
                angles[i],
                colors[i % colors.length]
            );
        }
    };

    p.draw = () => {
        p.background(220);
        p.translate(p.width / 2, p.height / 2);

        p.push();
        p.blendMode(p.DIFFERENCE);
        for (let i = 0; i < count; i++) {
            circles[i].update();
            circles[i].display();
        }
        p.pop();
    }

}

class Circle {
    r: number;
    angle: number;
    size: number;
    direction: number;
    color: p5.Color;
    x: number;
    y: number;

    constructor(angle: number, color: p5.Color) {
        this.r = 100;
        this.angle = angle;
        this.size = 100;
        this.direction = -1;
        this.color = color;
        this.x = 0;
        this.y = 0;
    }

    update() {
        this.x = this.r * Math.cos(this.angle);
        this.y = this.r * Math.sin(this.angle);

        if (this.r < 0 || this.r > 100) {
            this.direction = this.direction * -1;
        }
        this.r = this.r + this.direction;

    }

    display() {
        p.fill(this.color);
        p.ellipse(this.x, this.y, this.size, this.size);
    }
}   