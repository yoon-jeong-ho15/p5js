import p5 from "p5";

export default function braille(p: p5) {
  let displayText = ""; // Variable to store the word

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Enter text";
  const submitButton = document.createElement("button");
  submitButton.innerHTML = "Submit";
  submitButton.addEventListener("click", () => {
    displayText = input.value.trim();
    p.redraw();
  });

  document.getElementsByClassName("p5-container")[0].appendChild(input);
  document.getElementsByClassName("p5-container")[0].appendChild(submitButton);

  p.setup = () => {
    p.createCanvas(800, 600);
    p.background(220);
    p.noLoop();
  };

  p.draw = () => {
    const line = Math.ceil(displayText.length / 8);
    p.createCanvas(800, line * 100);
    p.background(220);

    for (let i = 0; i < displayText.length; i++) {
      const a = Math.floor(i / 8);
      const b = i % 8;
    }
  };
}
