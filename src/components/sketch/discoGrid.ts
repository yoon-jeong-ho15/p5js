import p5 from "p5";

let p: p5;

export default function discoGrid(inst: p5) {
    p = inst;

    let sizes: number[][] = [];
    let cols: number;
    let rows: number;
    let size: number = 10;
    let xoff = 0;
    let yoff = 0;
    let zoff = 0;
    let inc = 0.025;

    p.setup = () => {
        p.createCanvas(600, 600);
        cols = p.width / size;
        rows = p.height / size;
        p.rectMode(p.CENTER);
        p.noStroke();
        p.colorMode(p.HSB, 360, 100, 100)

    }

    p.draw = () => {
        p.background(0);
        xoff = 0;
        for (let i = 0; i < cols; i++) {
            yoff = 0;
            for (let j = 0; j < rows; j++) {
                let n = p.noise(xoff, yoff, zoff);
                let s = p.map(n, 0, 1, -size, size * 1.5);
                let c = p.map(p.noise(xoff + 100, yoff + 100, zoff + 100), 0, 1, 0, 360);
                p.fill(c, 80, 90);
                p.rect(i * size + size / 2, j * size + size / 2, s, s);
                yoff += inc;
            }
            xoff += inc;
        }
        zoff += inc;
    }
}
