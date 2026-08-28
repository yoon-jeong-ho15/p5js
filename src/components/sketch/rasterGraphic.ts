import p5 from "p5";

let p: p5;

export default function rasterGraphic(inst: p5) {
    p = inst;
    let img: p5.Image;
    let cols: number;
    let rows: number;
    let size = 10;
    let sizes: number[][] = [];

    p.setup = async () => {
        p.createCanvas(600, 600);
        cols = p.width / size;
        rows = p.height / size;
        img = await p.loadImage("/images/monalisa.webp");
        p.rectMode(p.CENTER);

        for (let i = 0; i < cols; i++) {
            sizes[i] = [];
            for (let j = 0; j < rows; j++) {
                sizes[i][j] = 0;
            }
        }
    }

    p.draw = () => {
        p.background(255);
        img.resize(600, 0);
        // p.image(img, 0, 0);

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                let c = img.get(i * size, j * size);
                sizes[i][j] = p.map(p.brightness(c), 0, 100, size * 2, 0);
                p.fill(c);
                p.noStroke();
                p.rect(i * size, j * size, sizes[i][j], sizes[i][j]);
            }
        }
    }
}