import p5 from "p5";

const order = [
  ["triangle", "rect", "circle"],
  ["line", "bezier", "zigzag"],
  ["pacman", "trapezoid", "elipse"],
];

export default function oneWithEverything(p: p5) {
  p.setup = () => {
    p.createCanvas(900, 900);
    p.background(200);
    p.strokeWeight(8);
    p.noLoop();
  };

  p.draw = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const object = order[i][j];

        const offSetX = j * 300;
        const offSetY = i * 300;

        let mod = 30;

        switch (object) {
          case "triangle":
            p.resetMatrix();
            p.translate(offSetX, offSetY);
            p.triangle(30, 270, 270, 270, 150, 30);
            break;
          case "rect":
            p.resetMatrix();
            p.translate(offSetX, offSetY);
            p.fill(255);
            p.rect(30, 30, 250, 250);
            break;
          case "circle":
            p.resetMatrix();
            p.translate(offSetX, offSetY);
            p.fill(255);
            p.circle(150, 150, 250);
            break;
          case "line":
            mod = 60;
            p.resetMatrix();
            p.translate(offSetX, offSetY);
            p.line(30, 30, 270, 270);
            p.point(270 - mod, 30 + mod);
            p.point(30 + mod, 270 - mod);
            break;
          case "bezier":
            p.resetMatrix();
            p.translate(offSetX, offSetY);
            p.noFill();

            p.point(30, 30);
            p.point(270, 30);
            p.point(270, 270);
            p.point(30, 270);

            p.line(30, 30, 30, 270);
            p.line(270, 30, 270, 270);

            p.bezier(30, 270, 30, 30, 270, 270, 270, 30);
            break;
          case "zigzag":
            p.resetMatrix();
            p.translate(offSetX, offSetY);
            p.noFill();

            p.beginShape();
            p.vertex(30, 150);
            p.vertex(90, 270);
            p.vertex(90, 30);
            p.vertex(210, 270);
            p.vertex(210, 30);
            p.vertex(270, 150);
            p.endShape();
            break;
          case "pacman":
            p.resetMatrix();
            p.translate(offSetX, offSetY);
            p.fill(255);
            p.arc(150, 150, 250, 250, 0.6, -0.6, "pie");
            break;
          case "trapezoid":
            p.resetMatrix();
            p.translate(offSetX, offSetY);
            p.quad(90, 30, 210, 30, 270, 270, 30, 270);
            break;
          case "elipse":
            p.resetMatrix();
            p.translate(offSetX, offSetY);
            p.translate(150, 150);
            p.fill(255);
            p.angleMode(p.DEGREES);
            p.rotate(45);
            p.ellipse(0, 0, 250, 100);
            p.rotate(-45);
            break;
        }
      }
    }
  };
}
