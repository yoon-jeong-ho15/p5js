import p5 from "p5";

export default function kaleidoscope(p: p5) {
  let side: number;

  p.setup = () => {
    p.createCanvas(800, 800);
    // console.log(p.TWO_PI);
    side = 200;
  };

  p.draw = () => {
    p.background(220);

    let rot = 0;
    let flip = false;

    let y = 0;
    while (y < p.height) {
      rot = 0;
      flip = false;
      for (let x = p.width; x >= 0; x -= side) {
        drawSingle(x, y, rot, flip);
        rot += p.TWO_PI / 3.0;
      }

      y += side / (2.0 * p.sqrt(3)) + 2;
      rot = p.PI / 3;
      flip = true;
      // for (let x = p.width + side / 2; x >= 0; x -= side) {
      //   drawSingle(x, y, rot, flip);
      //   rot -= p.TWO_PI / 3.0;
      // }

      y += side / p.sqrt(3);
      rot = (2.0 * p.PI) / 3;
      flip = false;
      // for (let x = p.width + side / 2; x >= 0; x -= side) {
      //   drawSingle(x, y, rot, flip);
      //   rot += p.TWO_PI / 3.0;
      // }

      y += side / (2.0 * p.sqrt(3)) + 2;
      rot = p.PI;
      flip = true;
      // for (let x = p.width; x >= 0; x -= side) {
      //   drawSingle(x, y, rot, flip);
      //   rot -= p.TWO_PI / 3.0;
      // }

      y += side / p.sqrt(3);
    }
  };

  const drawSingle = (x: number, y: number, rot: number, flip: boolean) => {
    const sq3 = p.sqrt(3);
    const s2 = side / 2;
    const eyeDx = 9;
    const eyeLh = -1.5;
    const mouthDa = 0.35;
    const mouthDy = 11;
    const s3 = side * 0.3;
    const faceDy = -3;

    p.push();
    p.translate(x, y);
    p.rotate(rot);
    if (flip) {
      p.scale(-1, 1);
    }

    p.noFill();
    p.stroke(0);
    p.strokeWeight(2);
    p.triangle(
      -s2,
      -side / (2.0 * sq3),
      s2,
      -side / (2.0 * sq3),
      0,
      side / sq3
    );

    p.strokeWeight(8);
    p.translate(0, faceDy);
    p.arc(
      0,
      side / 4 - side / (2.0 * sq3) + mouthDy,
      s3,
      s3,
      p.PI + mouthDa,
      p.TWO_PI - mouthDa
    );
    p.ellipse(
      side * (2 / 5) - s2 + eyeDx,
      side / 2.5 - side / (2.0 * sq3),
      side / 8,
      side / 5
    );
    p.line(
      side * (5 / 8) - s2 - eyeDx,
      side / 2.5 - side / 10 - side / (2.0 * sq3) - eyeLh,
      side * (5 / 8) - s2 - eyeDx,
      side / 2.5 + side / 10 - side / (2.0 * sq3) + eyeLh
    );

    p.pop();
  };
}
