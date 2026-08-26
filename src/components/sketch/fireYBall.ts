import p5 from "p5";

let p: p5;

export default function fireYBall(inst: p5) {
    p = inst;

    let pos: number[] = [];
    let vel: number[] = [];
    let count = 10;
    let spacing = 50;
    let angle = 0;

    p.setup = () => {
        p.createCanvas(600, 600);
        p.angleMode(p.DEGREES);

        for (let i = 0; i < count; i++) {
            pos[i] = 1;
            vel[i] = (i + 1) * 0.5;
        }
    }

    p.draw = () => {
        p.background(220);
        p.noFill();
        p.translate(p.width / 2, p.height / 2);
        p.strokeWeight(4);
        for (let i = 0; i < count; i++) {
            pos[i] = p.constrain(pos[i], 0, 180);
            p.stroke(200, 120 * (i / count), 0);
            p.arc(0, 0, spacing * (i + 1), spacing * (i + 1), angle + 0, angle + pos[i]);
            p.arc(0, 0, spacing * (i + 1), spacing * (i + 1), angle + 180, angle + 180 + pos[i]);
        }
        for (let i = 0; i < count; i++) {
            if (pos[i] >= 180 || pos[i] <= 0) {
                vel[i] = vel[i] * -1;
            }
            pos[i] = pos[i] + vel[i];
        }
        angle = angle + 1;
    }
}