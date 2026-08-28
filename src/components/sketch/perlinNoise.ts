import p5 from "p5";

let p: p5;

export default function perlinNoise(inst: p5) {
    p = inst;

    let cols: number;
    let rows: number;
    let size = 50;
    let noiseMap: number[][] = [];
    let xOff = 0;
    let yOff = 0;
    let inc = 0.1;

    p.setup = () => {
        p.createCanvas(600, 600);

        cols = p.width / size;
        rows = p.height / size;

        for (let i = 0; i < cols; i++) {
            noiseMap[i] = [];
            yOff = 0;
            for (let j = 0; j < rows; j++) {
                noiseMap[i][j] = p.noise(xOff, yOff);
                yOff += inc;
            }
            xOff += inc;
        }
    }

    p.draw = () => {
        p.background(220);
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                p.rect(i * size, j * size, size, size);
                p.textAlign(p.CENTER, p.CENTER);
                p.text(p.round(noiseMap[i][j], 3), i * size + size / 2, j * size + size / 2);
            }
        }
    }
}