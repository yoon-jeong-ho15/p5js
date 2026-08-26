import p5 from "p5";

let p: p5;

export default function fan(inst: p5) {
    p = inst;

    let count = 14;
    let space = 25;
    let angle = 0;

    p.setup = () => {
        p.createCanvas(600, 600);
        p.angleMode(p.DEGREES);
    }

    p.draw = () => {
        p.background(220);
        p.noFill();
        p.translate(p.mouseX, p.mouseY);
        for (let i = 0; i < count; i++) {
            p.stroke(100, 100, 250);
            p.arc(0, 0, space * i, space * i, 0 + angle + (i * 5), 90 + angle);
            p.arc(0, 0, space * i, space * i, 180 + angle + (i * 5), 270 + angle);
            p.stroke(100, 100, 100);
            p.arc(0, 0, space * i, space * i, 90 + angle + (i * 5), 180 + angle);
            p.arc(0, 0, space * i, space * i, 270 + angle + (i * 5), 360 + angle);
        }
        angle = angle + 10;
    }
}