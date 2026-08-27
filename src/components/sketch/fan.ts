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

        let maxRadius = (space * (4)) / 2;
        let x = p.constrain(p.mouseX, maxRadius, p.width - maxRadius);
        let y = p.constrain(p.mouseY, maxRadius, p.height - maxRadius);

        for (let i = 0; i < count; i++) {
            p.stroke(100, 100, 250);
            p.arc(x, y, space * i, space * i, 0 + angle + (i * 5), 90 + angle);
            p.arc(x, y, space * i, space * i, 180 + angle + (i * 5), 270 + angle);
            p.stroke(100, 100, 100);
            p.arc(x, y, space * i, space * i, 90 + angle + (i * 5), 180 + angle);
            p.arc(x, y, space * i, space * i, 270 + angle + (i * 5), 360 + angle);
        }

        let isInsideCanvas = p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
        if (p.mouseIsPressed && isInsideCanvas) {
            angle = angle + 15;
        }
    }

}