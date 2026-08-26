import p5 from "p5";

let p: p5;

export default function mouseGrid(inst: p5) {
    p = inst;

    let cols: number;
    let rows: number;
    let scaling = 20;
    let size: number[][] = [];

    p.setup = () => {
        p.createCanvas(600, 600);
        cols = p.width / scaling;
        rows = p.height / scaling;
    }

    p.draw = () => {
        p.background(0);
        p.noStroke();
        p.rectMode(p.CENTER);

        for (let i = 0; i < cols; i++) {
            size[i] = [];
            for (let j = 0; j < rows; j++) {
                size[i][j] = p.dist(p.mouseX, p.mouseY, i * scaling, j * scaling) * 0.15;
            }
        }

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                p.rect(scaling / 2 + i * scaling, scaling / 2 + j * scaling, size[i][j], size[i][j]);
            }
        }

    }
}