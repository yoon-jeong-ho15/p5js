import p5 from "p5";

const order = [
  ["triangle", "rect", "circle"],
  ["line", "bezier", "zigzag"],
  ["pacman", "trapezoid", "elipse"],
];

export default function oneWithEverything(p: p5) {
  let cols = 3;
  let rows = 3;

  p.setup = () => {
    p.createCanvas(600, 600);
    p.background(200);
    p.strokeWeight(8);
    p.noLoop();
  };

  p.draw = () => {
    const cellW = p.width / cols;
    const cellH = p.height / rows;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const object = order[i][j];

        const offSetX = j * cellW;
        const offSetY = i * cellH;

        p.push();
        p.translate(offSetX, offSetY);

        switch (object) {
          case "triangle":
            p.fill(255);
            p.triangle(
              cellW * 0.15,
              cellH * 0.85,
              cellW * 0.85,
              cellH * 0.85,
              cellW * 0.5,
              cellH * 0.15
            );
            break;
          case "rect":
            p.fill(255);
            p.rect(cellW * 0.15, cellH * 0.15, cellW * 0.7, cellH * 0.7);
            break;
          case "circle":
            p.fill(255);
            p.circle(cellW * 0.5, cellH * 0.5, Math.min(cellW, cellH) * 0.75);
            break;
          case "line": {
            const modX = cellW * 0.2;
            const modY = cellH * 0.2;
            p.line(cellW * 0.1, cellH * 0.1, cellW * 0.9, cellH * 0.9);
            p.point(cellW * 0.9 - modX, cellH * 0.1 + modY);
            p.point(cellW * 0.1 + modX, cellH * 0.9 - modY);
            break;
          }
          case "bezier": {
            p.noFill();
            const x1 = cellW * 0.1;
            const x2 = cellW * 0.9;
            const y1 = cellH * 0.1;
            const y2 = cellH * 0.9;

            p.point(x1, y1);
            p.point(x2, y1);
            p.point(x2, y2);
            p.point(x1, y2);

            p.line(x1, y1, x1, y2);
            p.line(x2, y1, x2, y2);

            p.bezier(x1, y2, x1, y1, x2, y2, x2, y1);
            break;
          }
          case "zigzag":
            p.noFill();
            p.beginShape();
            p.vertex(cellW * 0.1, cellH * 0.5);
            p.vertex(cellW * 0.3, cellH * 0.9);
            p.vertex(cellW * 0.3, cellH * 0.1);
            p.vertex(cellW * 0.7, cellH * 0.9);
            p.vertex(cellW * 0.7, cellH * 0.1);
            p.vertex(cellW * 0.9, cellH * 0.5);
            p.endShape();
            break;
          case "pacman":
            p.fill(255);
            p.arc(
              cellW * 0.5,
              cellH * 0.5,
              cellW * 0.75,
              cellH * 0.75,
              0.6,
              -0.6,
              "pie"
            );
            break;
          case "trapezoid":
            p.fill(255);
            p.quad(
              cellW * 0.3,
              cellH * 0.1,
              cellW * 0.7,
              cellH * 0.1,
              cellW * 0.9,
              cellH * 0.9,
              cellW * 0.1,
              cellH * 0.9
            );
            break;
          case "elipse":
            p.translate(cellW * 0.5, cellH * 0.5);
            p.fill(255);
            p.angleMode(p.DEGREES);
            p.rotate(45);
            p.ellipse(0, 0, cellW * 0.8, cellH * 0.35);
            break;
        }

        p.pop();
      }
    }
  };
}
