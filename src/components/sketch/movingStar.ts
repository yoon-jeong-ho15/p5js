import p5 from "p5";

let p: p5;

export default function movingStar(inst: p5) {
    p = inst;

    let outer: Star[] = [];
    let outerNum = 12;
    let outerAngles: number[] = [];

    let inner: Star[] = [];
    let innerNum = 3;
    let innerAngles: number[] = [];


    p.setup = () => {
        p.createCanvas(600, 600);
        for (let i = 0; i < outerNum; i++) {
            outerAngles[i] = (p.TWO_PI / outerNum) * i;
            outer[i] = new Star(outerAngles[i], false);
        }
        for (let i = 0; i < innerNum; i++) {
            innerAngles[i] = (p.TWO_PI / innerNum) * i;
            inner[i] = new Star(innerAngles[i], true);
        }
    }

    p.draw = () => {
        p.background(220);
        p.translate(p.width / 2, p.height / 2);
        for (let i = 0; i < outerNum; i++) {
            outer[i].angle += 0.02;
            outer[i].update();
            outer[i].display();
        }
        for (let i = 0; i < innerNum; i++) {
            inner[i].angle -= 0.01;
            inner[i].update();
            inner[i].display();
        }

        for (let i = 0; i < outerNum; i++) {
            for (let j = 0; j < innerNum; j++) {
                p.line(outer[i].x, outer[i].y, inner[j].x, inner[j].y);
            }
        }
    }

}

class Star {
    angle: number;
    r: number;
    x: number;
    y: number;

    constructor(angle: number, inner: boolean) {
        this.angle = angle;
        if (inner) {
            this.r = 75;
        } else {
            this.r = 150;
        }
        this.x = 0;
        this.y = 0;
    }

    update() {
        this.x = this.r * Math.cos(this.angle);
        this.y = this.r * Math.sin(this.angle);
    }

    display() {
        // p.ellipse(this.x, this.y, 5, 5);
    }
}