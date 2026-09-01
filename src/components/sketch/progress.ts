import p5 from "p5";

let p: p5;

export default function progress(inst: p5) {
    p = inst;

    let progressVal = 0;
    let duration = 2.0; // 1회 왕복/재생 시간 (초)
    let isLooping = true;
    let isOpening = true;

    p.setup = () => {
        p.createCanvas(800, 500);
        p.strokeCap(p.ROUND);
        p.strokeJoin(p.ROUND);
    };

    p.draw = () => {
        p.background(26, 26, 36);

        // 1. 진행도(progress) 시간 갱신 (0.0 -> 1.0 -> 0.0)
        if (isLooping) {
            const delta = p.deltaTime / 1000;
            if (isOpening) {
                progressVal += delta / duration;
                if (progressVal >= 1.0) {
                    progressVal = 1.0;
                    isOpening = false;
                }
            } else {
                progressVal -= delta / duration;
                if (progressVal <= 0.0) {
                    progressVal = 0.0;
                    isOpening = true;
                }
            }
        }

        // 상단 안내 텍스트
        drawHeader(progressVal);

        // 2. 다양한 도형/문자를 progress 기반으로 렌더링
        p.strokeWeight(6);
        p.noFill();

        // (1) 사각형 그리기 (왼쪽 위)
        p.stroke(100, 200, 255);
        drawRectSegments(80, 150, 120, 120, progressVal);

        // (2) 둥근 사각형 / 원 그리기 (중앙 위)
        p.stroke(255, 140, 100);
        drawRoundedRectSegments(270, 150, 120, 120, 30, progressVal);

        // (3) 한글 'ㅎ' 그리기 (중앙 우측 - 복합 타이밍 적용)
        p.stroke(255, 220, 100);
        drawHieut(460, 150, 120, 120, progressVal);

        // (4) 숫자 '6' 그리기 (우측 상단 - 곡선 문자)
        p.stroke(255, 130, 220);
        drawNumberSix(650, 150, 85, 120, progressVal);

        // (5) 별(Star) 모양 그리기 (왼쪽 아래)
        p.stroke(180, 130, 255);
        drawStarSegments(140, 390, 60, 30, 5, progressVal);

        // (6) 한글 '별' 초성 ㅂ 그리기 (중앙 아래)
        p.stroke(120, 240, 180);
        drawBieup(270, 330, 120, 120, progressVal);

        // (7) 파동 곡선 그리기 (오른쪽 아래)
        p.stroke(255, 105, 180);
        drawWaveSegments(460, 390, 240, 40, progressVal);
    };

    // 마우스 클릭 시 일시정지 / 재생 토글
    p.mousePressed = () => {
        if (p.mouseY > 100) {
            isLooping = !isLooping;
        }
    };
}

// =================================================================
// 🎨 핵심 렌더링 엔진: renderSegments
// =================================================================
/**
 * 주어진 선분 목록을 progress(0.0 ~ 1.0)에 따라 순차적으로 보간 렌더링
 * @param segments - [시작점, 끝점] 쌍의 배열
 * @param progress - 0.0 ~ 1.0 사이의 진행률
 */
function renderSegments(segments: [p5.Vector, p5.Vector][], progress: number): void {
    if (progress <= 0 || segments.length === 0) return;

    const total = progress * segments.length;
    const currentIdx = p.constrain(Math.floor(total), 0, segments.length - 1);
    const segmentFrac = total - currentIdx;

    for (let i = 0; i <= currentIdx; i++) {
        const start = segments[i][0];
        let end = segments[i][1];

        // 현재 그려지고 있는 마지막 선분만 부분 보간(lerp)
        if (i === currentIdx) {
            end = p5.Vector.lerp(start, end, segmentFrac);
        }
        p.line(start.x, start.y, end.x, end.y);
    }
}

// =================================================================
// 📐 도형별 선분 분할 렌더러
// =================================================================

// 1. 사각형 선분 렌더링
function drawRectSegments(x: number, y: number, w: number, h: number, progress: number): void {
    const segments: [p5.Vector, p5.Vector][] = [
        [p.createVector(x, y), p.createVector(x + w, y)],
        [p.createVector(x + w, y), p.createVector(x + w, y + h)],
        [p.createVector(x + w, y + h), p.createVector(x, y + h)],
        [p.createVector(x, y + h), p.createVector(x, y)]
    ];
    renderSegments(segments, progress);
}

// 2. 둥근 사각형 / 원 선분 렌더링 (호 분할)
function drawRoundedRectSegments(x: number, y: number, w: number, h: number, radius: number, progress: number): void {
    const segments: [p5.Vector, p5.Vector][] = [];
    const r = Math.min(radius, Math.min(w, h) / 2);
    const quarterSteps = 8; // 각 코너당 분할 수

    // 상단 직선
    segments.push([p.createVector(x + r, y), p.createVector(x + w - r, y)]);

    // 우상단 코너 호
    for (let i = 0; i < quarterSteps; i++) {
        const a1 = -p.HALF_PI + (i * p.HALF_PI) / quarterSteps;
        const a2 = -p.HALF_PI + ((i + 1) * p.HALF_PI) / quarterSteps;
        segments.push([
            p.createVector(x + w - r + r * p.cos(a1), y + r + r * p.sin(a1)),
            p.createVector(x + w - r + r * p.cos(a2), y + r + r * p.sin(a2))
        ]);
    }

    // 우측 수직선
    segments.push([p.createVector(x + w, y + r), p.createVector(x + w, y + h - r)]);

    // 우하단 코너 호
    for (let i = 0; i < quarterSteps; i++) {
        const a1 = 0 + (i * p.HALF_PI) / quarterSteps;
        const a2 = 0 + ((i + 1) * p.HALF_PI) / quarterSteps;
        segments.push([
            p.createVector(x + w - r + r * p.cos(a1), y + h - r + r * p.sin(a1)),
            p.createVector(x + w - r + r * p.cos(a2), y + h - r + r * p.sin(a2))
        ]);
    }

    // 하단 직선
    segments.push([p.createVector(x + w - r, y + h), p.createVector(x + r, y + h)]);

    // 좌하단 코너 호
    for (let i = 0; i < quarterSteps; i++) {
        const a1 = p.HALF_PI + (i * p.HALF_PI) / quarterSteps;
        const a2 = p.HALF_PI + ((i + 1) * p.HALF_PI) / quarterSteps;
        segments.push([
            p.createVector(x + r + r * p.cos(a1), y + h - r + r * p.sin(a1)),
            p.createVector(x + r + r * p.cos(a2), y + h - r + r * p.sin(a2))
        ]);
    }

    // 좌측 수직선
    segments.push([p.createVector(x, y + h - r), p.createVector(x, y + r)]);

    // 좌상단 코너 호
    for (let i = 0; i < quarterSteps; i++) {
        const a1 = p.PI + (i * p.HALF_PI) / quarterSteps;
        const a2 = p.PI + ((i + 1) * p.HALF_PI) / quarterSteps;
        segments.push([
            p.createVector(x + r + r * p.cos(a1), y + r + r * p.sin(a1)),
            p.createVector(x + r + r * p.cos(a2), y + r + r * p.sin(a2))
        ]);
    }

    renderSegments(segments, progress);
}

// 3. 한글 'ㅎ' (상단 2획: progress 0~0.5 / 하단 원: progress 0.5~1.0)
function drawHieut(x: number, y: number, w: number, h: number, progress: number): void {
    const topSegments: [p5.Vector, p5.Vector][] = [
        [p.createVector(x + w / 2, y), p.createVector(x + w / 2, y + h * 0.22)],
        [p.createVector(x, y + h * 0.22), p.createVector(x + w, y + h * 0.22)]
    ];

    // 구간 분할 (0.0 ~ 0.5)
    const topProgress = Math.min(progress * 2, 1);
    renderSegments(topSegments, topProgress);

    // 구간 분할 (0.5 ~ 1.0)
    const bottomProgress = Math.max((progress - 0.5) * 2, 0);
    if (bottomProgress > 0) {
        const circleSize = Math.min(w, h * 0.65);
        drawRoundedRectSegments(
            x + (w - circleSize) / 2,
            y + h * 0.35,
            circleSize,
            circleSize,
            circleSize / 2,
            bottomProgress
        );
    }
}

// 4. 한글 'ㅂ' 선분 렌더링
function drawBieup(x: number, y: number, w: number, h: number, progress: number): void {
    const segments: [p5.Vector, p5.Vector][] = [
        [p.createVector(x, y), p.createVector(x, y + h)],
        [p.createVector(x, y + h), p.createVector(x + w, y + h)],
        [p.createVector(x + w, y + h), p.createVector(x + w, y)],
        [p.createVector(x, y + h / 2), p.createVector(x + w, y + h / 2)]
    ];
    renderSegments(segments, progress);
}

// 5. 별(Star) 모양 선분 렌더링
function drawStarSegments(cx: number, cy: number, rOuter: number, rInner: number, points: number, progress: number): void {
    const segments: [p5.Vector, p5.Vector][] = [];
    const totalPoints = points * 2;
    const angleStep = p.TWO_PI / totalPoints;
    const pts: p5.Vector[] = [];

    for (let i = 0; i < totalPoints; i++) {
        const angle = i * angleStep - p.HALF_PI;
        const r = i % 2 === 0 ? rOuter : rInner;
        pts.push(p.createVector(cx + p.cos(angle) * r, cy + p.sin(angle) * r));
    }

    for (let i = 0; i < totalPoints; i++) {
        segments.push([pts[i], pts[(i + 1) % totalPoints]]);
    }

    renderSegments(segments, progress);
}

// 6. 부드러운 사인 파동 곡선 선분 렌더링
function drawWaveSegments(x: number, y: number, length: number, amplitude: number, progress: number): void {
    const segments: [p5.Vector, p5.Vector][] = [];
    const steps = 40;
    for (let i = 0; i < steps; i++) {
        const t1 = i / steps;
        const t2 = (i + 1) / steps;
        const p1 = p.createVector(x + t1 * length, y + p.sin(t1 * p.TWO_PI * 2) * amplitude);
        const p2 = p.createVector(x + t2 * length, y + p.sin(t2 * p.TWO_PI * 2) * amplitude);
        segments.push([p1, p2]);
    }
    renderSegments(segments, progress);
}

// 7. 숫자 '6' 선분 렌더링 (곡선 문자: 3차 베지어 + 원형 루프)
function drawNumberSix(x: number, y: number, w: number, h: number, progress: number): void {
    const segments: [p5.Vector, p5.Vector][] = [];
    const pts: p5.Vector[] = [];
    const stemSteps = 25;

    // 1) 상단 꼬리 ~ 왼쪽 곡선 (위 -> 아래 3차 베지어 곡선)
    const p0 = { x: x + w * 0.8, y: y + h * 0.05 };
    const p1 = { x: x + w * 0.15, y: y };
    const p2 = { x: x, y: y + h * 0.35 };
    const p3 = { x: x, y: y + h * 0.7 };

    for (let i = 0; i <= stemSteps; i++) {
        const t = i / stemSteps;
        const px = p.bezierPoint(p0.x, p1.x, p2.x, p3.x, t);
        const py = p.bezierPoint(p0.y, p1.y, p2.y, p3.y, t);
        pts.push(p.createVector(px, py));
    }

    // 2) 하단 동그라미 루프 (9시 방향에서 시작해 시계방향으로 360도 회전)
    const loopCenter = p.createVector(x + w * 0.5, y + h * 0.7);
    const rx = w * 0.5;
    const ry = h * 0.3;
    const loopSteps = 35;

    for (let i = 1; i <= loopSteps; i++) {
        const angle = p.PI + (i / loopSteps) * p.TWO_PI;
        pts.push(p.createVector(
            loopCenter.x + p.cos(angle) * rx,
            loopCenter.y + p.sin(angle) * ry
        ));
    }

    // 점들을 이웃한 선분(segments) 쌍으로 변환
    for (let i = 0; i < pts.length - 1; i++) {
        segments.push([pts[i], pts[i + 1]]);
    }

    renderSegments(segments, progress);
}

// =================================================================
// 📈 UI 안내 헤더
// =================================================================
function drawHeader(progress: number): void {
    p.noStroke();
    p.fill(220);
    p.textSize(14);
    p.textAlign(p.LEFT, p.TOP);
    p.text(`Progress: ${(progress * 100).toFixed(1)}%`, 20, 20);
    p.text("Click Canvas to Toggle Pause/Play", 20, 42);

    // 상단 진행바
    p.fill(60);
    p.rect(20, 70, p.width - 40, 6, 3);
    p.fill(100, 200, 255);
    p.rect(20, 70, (p.width - 40) * progress, 6, 3);
}
