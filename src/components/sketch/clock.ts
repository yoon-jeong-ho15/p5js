import p5 from "p5";

let p: p5;

export default function clock(inst: p5) {
    p = inst;

    let hLength = 60;
    let mLength = 75;
    let sLength = 100;

    p.setup = () => {
        p.createCanvas(600, 600);
        p.angleMode(p.DEGREES);
    }

    p.draw = () => {
        p.background(220);
        let h = p.hour();
        let m = p.minute();
        let s = p.second();

        p.translate(p.width / 2, p.height / 2);
        p.rotate(-90);

        p.stroke(0, 0, 0);
        p.ellipse(0, 0, 250, 250);

        let hAngle = p.map(h - 12, 0, 12, 0, 360);
        let mAngle = p.map(m, 0, 60, 0, 360);
        let sAngle = p.map(s, 0, 60, 0, 360);

        let hx = hLength * p.cos(hAngle);
        let hy = hLength * p.sin(hAngle);

        let mx = mLength * p.cos(mAngle);
        let my = mLength * p.sin(mAngle);

        let sx = sLength * p.cos(sAngle);
        let sy = sLength * p.sin(sAngle);

        p.stroke(3);
        p.stroke(125, 0, 255);
        p.line(0, 0, hx, hy);
        p.ellipse(hx, hy, 20, 20);

        p.stroke(125, 255, 0);
        p.line(0, 0, mx, my);
        p.ellipse(mx, my, 20, 20);

        p.stroke(0, 255, 255);
        p.line(0, 0, sx, sy);
        p.ellipse(sx, sy, 20, 20);




    }
}