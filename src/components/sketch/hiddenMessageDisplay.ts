import p5 from "p5";

let p: p5;

export default function hiddenMessageDisplay(inst: p5) {
    p = inst;

    let cols: number;
    let rows: number;
    let csize = 40;
    let rsize = 50;

    p.setup = () => {
        p.createCanvas(400, 400);
        cols = p.width / csize;
        rows = p.height / rsize;
    };

    p.draw = () => {
        p.background(220);
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                let x = i * csize;
                let y = j * rsize;
                p.ellipse(x, y, csize, rsize);
            }
        }

    };
}