import p5 from "p5";

let p: p5;

export default function discoGrid(inst: p5) {
    p = inst;

    let sizes: number[][] = [];
    let cols: number;
    let rows: number;
    let size: number = 10;
    let noiseMap: number[][] = [];
    let xoff = 0;
    let yoff = 0;
    let zoff = 0;
    let inc = 0.1;

    p.setup = () => {
        p.createCanvas(600, 600);
        cols = p.width / size;
        rows = p.height / size;
        p.rectMode(p.CENTER);

    }

    p.draw = () => {
        p.background(220);
        xoff = 0;
        for (let i = 0; i < cols; i++) {
            sizes[i] = [];
            yoff = 0;
            for (let j = 0; j < rows; j++) {
                sizes[i][j] = p.map(p.noise(xoff, yoff, zoff), 0, 1, 0, size * 1.5);
                yoff += inc;

                let r = p.noise(zoff) * 255;
                let g = p.noise(zoff + 10) * 255;
                let b = p.noise(zoff + 20) * 255;

                p.fill(r, g, b);
                p.noStroke();
                p.rect(i * size + size / 2, j * size + size / 2, sizes[i][j], sizes[i][j]);
            }
            xoff += inc;
            zoff += 0.00035;
        }
    }
}
