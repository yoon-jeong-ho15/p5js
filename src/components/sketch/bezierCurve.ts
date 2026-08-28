import p5 from "p5";

let p: p5;

export default function bezierCurve(inst: p5) {
    p = inst;
    let x1: number;
    let y1: number;
    let x2: number;
    let y2: number;
    let x3: number;
    let y3: number;
    let x4: number;
    let y4: number;
    let offset = 0;

    p.setup = () => {
        p.createCanvas(600, 600);
    }

    p.draw = () => {
        // p.background(220);

        p.strokeWeight(0.5);
        p.noFill();

        x1 = p.noise(offset + 5) * p.width;
        y1 = p.noise(offset + 10) * p.height;
        x2 = p.noise(offset + 15) * p.width;
        y2 = p.noise(offset + 20) * p.height;
        x3 = p.noise(offset + 25) * p.width;
        y3 = p.noise(offset + 30) * p.height;
        x4 = p.noise(offset + 35) * p.width;
        y4 = p.noise(offset + 40) * p.height;

        offset += 0.02;

        p.bezier(x1, y1, x2, y2, x3, y3, x4, y4);
    }
}