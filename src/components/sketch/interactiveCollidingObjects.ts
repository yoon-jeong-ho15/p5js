import p5 from "p5";

let p: p5;

export default function interactiveCollidingObjects(inst: p5) {
    p = inst;
    let circles: Circle[] = [];
    let rectagles: Rectangle[] = [];
    let ball: Ball;

    p.setup = () => {
        p.createCanvas(600, 600);
        ball = new Ball(p.mouseX, p.mouseY);
    }

    p.draw = () => {
        p.background(220);
        ball.x = p.mouseX;
        ball.y = p.mouseY;
        ball.drawBall();

        if (Math.floor(p.random(0, 10)) === 1) {
            circles.push(new Circle());
            rectagles.push(new Rectangle());
        }

        for (let i = 0; i < circles.length; i++) {
            ball.collided(circles[i]);
            circles[i].drawCircle();
            circles[i].moveCircle();
        }

        for (let i = 0; i < rectagles.length; i++) {
            ball.collided(rectagles[i]);
            rectagles[i].drawRect();
            rectagles[i].moveRect();
        }

    }
}

class Circle {
    x: number;
    y: number;
    r: number;
    dy: number;
    collide: boolean;
    circle: boolean;

    constructor() {
        this.x = p.random(0, p.width);
        this.y = p.random(-50, p.height);
        this.r = p.random(10, 20);
        this.dy = 2;
        this.collide = false;
        this.circle = true;
    }

    drawCircle() {
        if (this.collide) {
            p.fill(255, 255, 0, 100);
        } else {
            p.fill(255, 0, 0, 100);
        }
        p.noStroke();
        p.ellipse(this.x, this.y, this.r * 2, this.r * 2);
    }

    moveCircle() {
        this.y += this.dy;

    }
}

class Rectangle {
    x: number;
    y: number;
    w: number;
    h: number;
    dy: number;
    collide: boolean;

    constructor() {
        this.x = p.random(0, p.width);
        this.y = p.random(-50, p.height);
        this.w = p.random(10, 20);
        this.h = p.random(10, 20);
        this.dy = 2;
        this.collide = false;
    }

    drawRect() {
        if (this.collide) {
            p.fill(255, 255, 0, 100);
        } else {
            p.fill(255, 0, 255, 100);
        }
        p.rect(this.x, this.y, this.w, this.h);
    }

    moveRect() {
        this.y += this.dy;
    }
}
class Ball {
    x: number;
    y: number;
    r: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.r = 25;
    }

    drawBall() {
        p.fill(100);
        p.ellipse(this.x, this.y, this.r * 2, this.r * 2);
    }

    collided(object: Circle | Rectangle) {
        if (object.circle) {
            let distance = p.dist(this.x, this.y, object.x, object.y);
            if (distance < this.r + object.r) {
                object.collide = true;
            } else {
                object.collide = false;
            }
        } else {
            let closeX = object.x;
            let closeY = object.y;

            if (this.x < object.x) {
                closeX = object.x;
            } else if (this.x > object.x + object.w) {
                closeX = object.x + object.w;
            }

            if (this.y < object.y) {
                closeY = object.y
            } else if (this.y > object.y + object.h) {
                closeY = object.y + object.h;
            }

            let distance = p.dist(this.x, this.y, closeX, closeY);
            if (distance < this.r) {
                object.collide = true;
            } else {
                object.collide = false;
            }
        }

    }
}