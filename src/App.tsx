import "./App.css";
import P5Canvas from "./components/p5canvas";
import * as sketches from "./components/sketch";
import { useState } from "react";

type SketchName = keyof typeof sketches;

const titles: Record<SketchName, string> = {
  oneWithEverything: "One With Everything",
  initials: "Initials",
  braille: "Braille",
};

function App() {
  const [currentSketch, setCurrentSketch] = useState<SketchName>("initials");
  return (
    <>
      <nav>
        <ul>
          <li onClick={() => setCurrentSketch("oneWithEverything")}>
            One With Everything
          </li>
          <li onClick={() => setCurrentSketch("initials")}>Initials</li>
          <li onClick={() => setCurrentSketch("braille")}>Braille</li>
        </ul>
      </nav>
      <P5Canvas
        title={titles[currentSketch]}
        sketch={sketches[currentSketch]}
      />
    </>
  );
}

export default App;
