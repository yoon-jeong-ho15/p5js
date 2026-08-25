import p5 from "p5";

let p: p5;

export default function circularGrid(inst: p5) {
    p = inst;

    let spacing = 10;
    let cols: number;
    let rows: number;
    let size: number[][] = [];

    p.setup = () => {
        p.createCanvas(600, 600);
        cols = p.width / spacing;
        rows = p.width / spacing;
        for (let i = 0; i < cols; i++) {
            size[i] = [];
            for (let j = 0; j < rows; j++) {
                size[i][j] = (j + 1) / rows * spacing;
                // size[i][j] = (rows - j) / rows * spacing;
                // size[i][j] = (i + j + 1) / rows * spacing;
            }
        }
    }

    p.draw = () => {
        p.background(0);
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                p.noStroke();
                p.fill((j + 1) / rows * 255);
                // p.fill((rows - j) / rows * 255);
                // p.fill((i + j) / rows * 255);
                p.ellipse(i * spacing + spacing / 2, j * spacing + spacing / 2, size[i][j], size[i][j])
            }
        }
    }
}
