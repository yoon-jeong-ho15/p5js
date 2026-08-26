import { useEffect, useRef } from "react";
import p5 from "p5";

export default function P5Canvas({
  title,
  sketch,
}: {
  title: string;
  sketch: (p: p5) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const p5Sketch = new p5(sketch, containerRef.current);
    return () => {
      p5Sketch.remove();
    };
  }, [sketch]);

  return (
    <div className="p5-container">
      <div className="p5-header">
        <h1>{title}</h1>
      </div>
      <div ref={containerRef} />
    </div>
  );
}
