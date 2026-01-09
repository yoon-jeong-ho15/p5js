import p5 from "p5";

export default function initials(p: p5) {
  p.setup = () => {
    p.createCanvas(500, 400);
    p.background(220);
    p.noLoop();
  };

  p.draw = () => {
    p.fill(0);
    //y
    p.translate(60, 80);
    p.arc(0, 0, 100, 200, p.HALF_PI, p.PI);
    p.translate(60, 0);
    p.arc(0, 0, 100, 400, p.HALF_PI, p.PI);
    p.resetMatrix();
    //j
    p.translate(180, 80);
    p.rect(-40, 0, 40, 30);
    p.arc(0, 0, 80, 400, 0, p.HALF_PI);
    p.translate(0, 200);
    p.rect(0, 0, -40, -30);
    p.resetMatrix();
    //h
    p.translate(235, 80);
    p.rect(0, 0, 35, 200);
    p.translate(45, 200);
    p.arc(0, 0, 100, 180, -p.HALF_PI, 0);
    p.resetMatrix();
  };
}
