import "./App.css";
import P5Canvas from "./components/p5canvas";
import * as sketches from "./components/sketch";
import { useState } from "react";

const titles: Record<string, string> = {
  oneWithEverything: "One With Everything",
  initials: "Initials",
  kaleidoscope: "Kaleidoscope",
  wavePattern: "Wave Pattern",
};

function App() {
  const [currentSketch, setCurrentSketch] = useState<string>("initials");
  return (
    <>
      <nav>
        <ul>
          {Object.keys(sketches).map((sketch) => (
            <li onClick={() => setCurrentSketch(sketch)}>
              {titles[sketch]}
            </li>
          ))}
        </ul>
      </nav>
      <P5Canvas
        title={titles[currentSketch]}
        sketch={sketches[currentSketch as keyof typeof sketches]}
      />
    </>
  );
}

export default App;
