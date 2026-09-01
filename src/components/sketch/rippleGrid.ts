import p5 from "p5";

let p: p5;

export default function rippleGrid(inst: p5) {
    p = inst;

    let cols = 30;
    let rows = 30;
    let bricks: Brick[] = [];
    let ripples: Ripple[] = [];

    p.setup = () => {
        p.createCanvas(600, 600);
        p.angleMode(p.DEGREES);
        p.rectMode(p.CENTER);
        p.noFill();
        p.strokeWeight(2);

        let size = p.width / cols;
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                let x = i * size + size / 2;
                let y = j * size + size / 2;
                bricks.push(new Brick(x, y, size - 5));
            }
        }
    };

    p.draw = () => {
        p.background(0);

        for (let brick of bricks) {
            brick.display(ripples);
        }

        for (let i = ripples.length - 1; i >= 0; i--) {
            ripples[i].update();
            ripples[i].display();

            if (ripples[i].r >= 300) {
                ripples.splice(i, 1);
            }
        }
    };

    p.mouseClicked = () => {
        let r = new Ripple(p.mouseX, p.mouseY);
        ripples.push(r);
    };

}

class Brick {
    x: number;
    y: number;
    size: number;
    angle: number;

    constructor(x: number, y: number, size: number) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.angle = 0;
    }

    display(ripples: Ripple[]) {
        let isHit = false;

        // 활성화된 파동(ripple) 중 사각형과 겹치는지 판별
        for (let i = 0; i < ripples.length; i++) {
            let ripple = ripples[i];
            let d = p.dist(this.x, this.y, ripple.x, ripple.y);
            let waveRadius = ripple.r / 2;

            if (Math.abs(d - waveRadius) < 15) {
                isHit = true;
                break;
            }
        }

        // 목표 각도 (겹치면 50도, 아니면 0도)
        let targetAngle = isHit ? 50 : 0;
        // lerp(선형 보간)를 이용해 현재 각도에서 목표 각도로 부드럽게 전환
        this.angle = p.lerp(this.angle, targetAngle, 0.1);

        // 각도 변화에 맞춰 stroke 색상도 자연스럽게 전환 (100 -> 255)
        let currentStroke = p.map(this.angle, 0, 50, 100, 255);

        p.push();
        p.translate(this.x, this.y);
        p.stroke(currentStroke);
        p.rotate(this.angle);
        p.rect(0, 0, this.size, this.size);
        p.pop();
    }
}

class Ripple {
    x: number;
    y: number;
    r: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.r = 0;
    }

    update() {
        this.r += 5;
    }

    display() {
        p.noStroke();
        p.circle(this.x, this.y, this.r);
    }
}