import "./App.css";
import P5Canvas from "./components/p5canvas";
import * as sketches from "./components/sketch";
import { useState } from "react";

function App() {
  const [currentSketch, setCurrentSketch] = useState<string>("initials");
  return (
    <>
      <nav>
        <ul>
          {Object.keys(sketches).map((sketch) => (
            <li
              key={sketch}
              onClick={() => setCurrentSketch(sketch)}>
              {sketch}
            </li>
          ))}
        </ul>
      </nav>
      <P5Canvas
        title={currentSketch}
        sketch={sketches[currentSketch as keyof typeof sketches]}
      />
    </>
  );
}

export default App;
