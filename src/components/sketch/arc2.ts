import p5 from "p5";

let p: p5;

export default function arc2(inst: p5) {
    p = inst;

    const r = 120;
    const speed = 3;
    let dot: Dot;
    let a = 0;

    p.setup = () => {
        p.createCanvas(600, 600);
        p.angleMode(p.DEGREES);
        dot = new Dot(r);
    };

    p.draw = () => {
        p.background(220);
        p.translate(p.width / 2, p.height / 2);

        // 4개의 arc 궤도선 그리기
        p.noFill();
        p.stroke(0);
        p.strokeWeight(2);
        p.rotate(a);
        // 1. 좌상단 (TL): 90~360도 arc
        p.arc(-r, -r, r * 2, r * 2, 90, 360);

        // 2. 우상단 (TR): -180~90도 arc
        p.arc(r, -r, r * 2, r * 2, -180, 90);

        // 3. 우하단 (BR): -90~180도 arc
        p.arc(r, r, r * 2, r * 2, -90, 180);

        // 4. 좌하단 (BL): 0~270도 arc
        p.arc(-r, r, r * 2, r * 2, 0, 270);

        // 4개의 arc를 따라 움직이는 원 (1개)
        dot.update(speed);
        dot.display();
        a += speed * 0.1;
    };
}

class Dot {
    x: number = 0;
    y: number = 0;
    r: number;
    t: number = 0;
    readonly max: number = 1080; // 4개의 arc * 270도 = 1080도

    constructor(r: number) {
        this.r = r;
    }

    update(speed: number) {
        const currentArc = Math.floor(this.t / 270);
        const localT = this.t % 270;

        if (currentArc === 0) {
            // 1. 좌상단: 90~360도 (시작: (-r, 0) -> 끝: (0, -r))
            const angle = 90 + localT;
            this.x = -this.r + this.r * p.cos(angle);
            this.y = -this.r + this.r * p.sin(angle);
        } else if (currentArc === 1) {
            // 2. 우상단: -180~90도 (시작: (0, -r) -> 끝: (r, 0))
            const angle = -180 + localT;
            this.x = this.r + this.r * p.cos(angle);
            this.y = -this.r + this.r * p.sin(angle);
        } else if (currentArc === 2) {
            // 3. 우하단: -90~180도 (시작: (r, 0) -> 끝: (0, r))
            const angle = -90 + localT;
            this.x = this.r + this.r * p.cos(angle);
            this.y = this.r + this.r * p.sin(angle);
        } else {
            // 4. 좌하단: 0~270도 (시작: (0, r) -> 끝: (-r, 0))
            const angle = 0 + localT;
            this.x = -this.r + this.r * p.cos(angle);
            this.y = this.r + this.r * p.sin(angle);
        }

        this.t += speed;
        if (this.t >= this.max) {
            this.t -= this.max;
        }
    }

    display() {
        p.fill(255);
        p.stroke(0);
        p.strokeWeight(1.5);
        p.ellipse(this.x, this.y, 20, 20);
    }
}
