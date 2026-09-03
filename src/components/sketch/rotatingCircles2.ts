import p5 from "p5";

let p: p5;

export default function rotatingCircles2(inst: p5) {
    p = inst;

    let count = 9;
    let arr: CircleArray[] = [];

    p.setup = () => {
        p.createCanvas(600, 600);
        p.angleMode(p.DEGREES);
        let x = p.width / 2;
        let y = p.height / 2;

        for (let i = 0; i < count; i++) {
            let angle = 360 / count;
            arr[i] = new CircleArray(x, y, 150, 5, angle * 0.5, i * angle);
        }

        p.draw = () => {
            p.background(0);

            for (let i = 0; i < count; i++) {
                arr[i].update(0.8);
                arr[i].display();
            }
        }
    }

    class CircleArray {
        x: number;
        y: number;
        r: number;
        n: number;
        size: number;
        angle: number;
        startAngle: number;
        circles: Circle[];
        dir: number;

        constructor(x: number, y: number, r: number, n: number, size: number, startAngle: number) {
            this.x = x;
            this.y = y;
            this.r = r;
            this.n = n;
            this.size = size;
            this.angle = size / this.n;
            this.startAngle = startAngle;
            this.circles = [];
            this.dir = 1;

            this.createCircles();
        }

        createCircles() {
            for (let i = 0; i < this.n; i++) {
                let x = this.x + this.r * p.cos(this.startAngle + this.angle * i)
                let y = this.y + this.r * p.sin(this.startAngle + this.angle * i)
                this.circles.push(new Circle(x, y, p.map(i, 0, this.n, 20, 50)));
            }
        }

        update(speed: number) {
            this.startAngle += speed;
            for (let i = 0; i < this.n; i++) {
                this.circles[i].x = this.x + this.r * p.cos(this.startAngle + this.angle * i)
                this.circles[i].y = this.y + this.r * p.sin(this.startAngle + this.angle * i)
            }

            if (this.r > 200 || this.r < 100) {
                this.dir *= -1;
            }
            this.r += this.dir;
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
            this.r += this.dir;
            if (this.r > 50 || this.r < 20) {
                this.dir *= -1;
            }
        }

        display() {
            p.stroke(255);
            p.noFill();
            p.ellipse(this.x, this.y, this.r * 2, this.r * 2);
        }
    }
}