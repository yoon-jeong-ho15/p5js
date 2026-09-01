import p5 from "p5";

let p: p5;

export default function ripple(inst: p5) {
    p = inst;
    let ripples: Ripple[] = [];
    p.setup = () => {
        p.createCanvas(600, 600);
    }

    p.draw = () => {
        p.background(220);
        for (let i = ripples.length - 1; i >= 0; i--) {
            ripples[i].display();

            if (ripples[i].r >= 200) {
                ripples.splice(i, 1);
            }
        }
    }

    p.mouseClicked = () => {
        let ri = new Ripple(p.mouseX, p.mouseY);
        ripples.push(ri);
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

    display() {
        p.noFill();
        this.r += 5;
        p.circle(this.x, this.y, this.r);
    }
}