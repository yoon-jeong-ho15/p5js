import p5 from "p5";

let p: p5;

export default function eight(inst: p5) {
    p = inst;

    const r = 120;
    let t = 0;
    const speed = 3;

    p.setup = () => {
        p.createCanvas(600, 600);
        p.angleMode(p.DEGREES);
    };

    p.draw = () => {
        p.background(220);
        p.translate(p.width / 2, p.height / 2);

        p.noFill();
        p.ellipse(-r, 0, r * 2, r * 2);
        p.ellipse(r, 0, r * 2, r * 2);

        let x: number;
        let y: number;

        if (t < 360) {
            x = r * p.cos(t) - r;
            y = r * p.sin(t);
        } else {
            x = -r * p.cos(t) + r;
            y = r * p.sin(t);
        }

        p.fill(255);
        p.ellipse(x, y, 20, 20);

        t += speed;
        if (t >= 720) {
            t -= 720;
        }
    };
}
