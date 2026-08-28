import p5 from "p5";

let p: p5;

export default function mouseGridInteraction(inst: p5) {
    p = inst;
    let rectangles: Rectangle[][] = [];
    let cr = 10;
    let cols = 10;
    let rows = 10;
    let size;

    p.setup = () => {
        p.createCanvas(600, 600);
        size = p.width / cols;
        for (let i = 0; i < cols; i++) {
            rectangles[i] = [];
            for (let j = 0; j < rows; j++) {
                rectangles[i][j] = new Rectangle(i * size, j * size, size, size);
            }
        }
    }

    p.draw = () => {
        p.background(220);
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                rectangles[i][j].drawRect();
                rectangles[i][j].collided(p.mouseX, p.mouseY, cr);
            }
        }
        p.ellipse(p.mouseX, p.mouseY, cr * 2, cr * 2);
    }
}

class Rectangle {
    x: number;
    y: number;
    w: number;
    h: number;
    collide: boolean;

    constructor(x: number, y: number, w: number, h: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.collide = false;
    }

    drawRect() {
        if (this.collide) {
            p.fill(255, 255, 0);
        } else {
            p.fill(255);
        }
        p.rect(this.x, this.y, this.w, this.h);
    }

    collided(cx: number, cy: number, cr: number) {
        //Find the closest point on the rectangle to the circle
        let closestX = cx;
        let closestY = cy;

        if (cx < this.x) closestX = this.x;
        else if (cx > this.x + this.w) closestX = this.x + this.w;

        if (cy < this.y) closestY = this.y;
        else if (cy > this.y + this.h) closestY = this.y + this.h;

        //Calculate the distance between the closest point and the circle
        let distX = cx - closestX;
        let distY = cy - closestY;
        let distance = Math.sqrt(distX * distX + distY * distY);

        //If the distance is less than the circle's radius, there is a collision
        if (distance < cr) {
            this.collide = true;
        } else {
            this.collide = false;
        }
    }

}