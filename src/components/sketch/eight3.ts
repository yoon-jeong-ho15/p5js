import p5 from "p5";

let p: p5;

export default function eightWorm(inst: p5) {
    p = inst;

    const r = 120;
    const speed = 2.5;
    let worm: Worm;

    p.setup = () => {
        p.createCanvas(600, 600);
        p.angleMode(p.DEGREES);

        // Worm 생성 (반지름 r=120, 몸통 마디 수=6, 마디 간격=8도)
        worm = new Worm(r, 6, 8);
    };

    p.draw = () => {
        p.background(220);
        p.translate(p.width / 2, p.height / 2);

        // 8자 궤도선
        p.noFill();
        p.stroke(0);
        p.strokeWeight(2);
        p.ellipse(-r, 0, r * 2, r * 2);
        p.ellipse(r, 0, r * 2, r * 2);

        // 메인 함수에서는 오직 worm만 호출!
        worm.update(speed);
        worm.display();
    };
}

/**
 * 궤도를 따라 움직이는 단일 점(몸통 마디)
 */
class Dot {
    x: number = 0;
    y: number = 0;
    r: number;
    t: number;
    max: number;
    size: number;

    constructor(r: number, t: number, max: number, size: number = 20) {
        this.r = r;
        this.t = t;
        this.max = max;
        this.size = size;
        this.calcPosition();
    }

    calcPosition() {
        if (this.t < this.max / 2) {
            this.x = this.r * p.cos(this.t) - this.r;
            this.y = this.r * p.sin(this.t);
        } else {
            this.x = -this.r * p.cos(this.t) + this.r;
            this.y = this.r * p.sin(this.t);
        }
    }

    update(speed: number) {
        this.t += speed;
        if (this.t >= this.max) {
            this.t -= this.max;
        }
        this.calcPosition();
    }

    display() {
        p.fill(255);
        p.stroke(0);
        p.strokeWeight(1.5);
        p.ellipse(this.x, this.y, this.size, this.size);
    }
}

/**
 * 진행 방향을 바라보는 눈이 달린 머리 (Dot을 상속받음)
 */
class Head extends Dot {
    angle: number = 0;

    constructor(r: number, t: number, max: number) {
        super(r, t, max, 24); // 머리는 몸통(20)보다 살짝 큰 24
    }

    update(speed: number) {
        const prevX = this.x;
        const prevY = this.y;

        super.update(speed);

        // 직전 위치와 현재 위치의 차이(dx, dy)로 진행 방향 각도 계산
        const dx = this.x - prevX;
        const dy = this.y - prevY;
        if (dx !== 0 || dy !== 0) {
            this.angle = p.atan2(dy, dx);
        }
    }

    display() {
        // 머리만 자신의 위치(x, y)로 가서 진행 방향(angle)만큼 독립적으로 회전
        p.push();
        p.translate(this.x, this.y);
        p.rotate(this.angle);

        // 1. 머리 본체
        p.fill(255);
        p.stroke(0);
        p.strokeWeight(1.5);
        p.ellipse(0, 0, this.size, this.size);

        // 2. 두 눈 (진행 방향 기준 좌/우)
        p.fill(0);
        p.noStroke();
        p.ellipse(6, -6, 5, 5); // 왼쪽 눈
        p.ellipse(6, 6, 5, 5);  // 오른쪽 눈

        // 3. 눈동자 반사광
        p.fill(255);
        p.ellipse(7, -7, 2, 2);
        p.ellipse(7, 5, 2, 2);

        p.pop();
    }
}

/**
 * Head 1개와 여러 개의 Dot을 관리하는 Worm 클래스
 */
class Worm {
    head: Head;
    body: Dot[] = [];

    constructor(r: number, bodyCount: number = 6, spacing: number = 8) {
        const max = 720;

        // 1. 몸통 마디들 생성 (뒤에서부터 배치)
        for (let i = 0; i < bodyCount; i++) {
            // 꼬리 쪽으로 갈수록 크기가 살짝 작아지도록 연출 (20 -> 14)
            const bodySize = p.map(i, 0, bodyCount - 1, 14, 20);
            this.body.push(new Dot(r, i * spacing, max, bodySize));
        }

        // 2. 머리 생성 (몸통들 맨 앞에 배치: bodyCount * spacing)
        this.head = new Head(r, bodyCount * spacing, max);
    }

    update(speed: number) {
        // 몸통과 머리 모두 전진
        this.body.forEach((segment) => segment.update(speed));
        this.head.update(speed);
    }

    display() {
        // 몸통을 먼저 그리고 그 위에 머리를 덮어 그립니다
        this.body.forEach((segment) => segment.display());
        this.head.display();
    }
}
