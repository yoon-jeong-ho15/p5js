import p5 from "p5";

let p: p5;

export default function generativeTypography(inst: p5) {
    p = inst;

    let arcs: Arc[][] = [];
    let cols: number;
    let rows: number;
    let size = 15;
    let img: p5.Image;

    p.setup = async () => {
        p.createCanvas(600, 600);
        p.angleMode(p.DEGREES);
        img = await p.loadImage("images/a.webp");
        img.resize(600, 0);

        cols = p.width / size;
        rows = p.height / size;

        for (let i = 0; i < cols; i++) {
            arcs[i] = [];
            for (let j = 0; j < rows; j++) {
                let c = img.get(i * size, j * size,);
                let b = p.map(p.brightness(c), 0, 100, 5, 0);
                let x = i * size + size / 2;
                let y = j * size + size / 2;
                arcs[i][j] = new Arc(x, y, size, p.random(0, 360), p.random(0, 360), b);
            }
        }



    }

    p.draw = () => {
        p.background(255);

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                arcs[i][j].display();
            }
        }

    }
}

class Arc {
    x: number;
    y: number;
    d: number;
    start: number;
    stop: number;
    b: number;
    c: number;

    constructor(x: number, y: number, d: number, start: number, stop: number, b: number) {
        this.x = x;
        this.y = y;
        this.d = d;
        this.start = start;
        this.stop = stop;
        this.b = b;
        this.c = Math.floor(p.random(7));
    }

    display() {
        let colors = ["#abcd5e", "#14976b", "#2b67af", "#62b6de", "#f589a3", "#ef562f", "#fc8405"]
        p.noFill();
        p.strokeWeight(this.b);
        p.stroke(colors[this.c]);
        p.arc(this.x, this.y, this.d, this.d, this.start, this.stop);
    }
}

