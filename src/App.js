import { useEffect, useRef, useState } from "react";
import { Canvas, Rect } from "fabric";
import "./App.css";
import { Settings } from "./component/settings";
import { Layers } from "./component/layerspanel";

function App() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 400,
        height: 500,
        preserveObjectStacking: true,
      });

      initCanvas.backgroundColor = "#fff";
      initCanvas.renderAll();

      setCanvas(initCanvas);
      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

  function addRectangle() {
    if (canvas) {
      const rect = new Rect({
        top: 100,
        left: 100,
        width: 100,
        height: 100,
        fill: "#D84D42",
      });

      canvas.add(rect);
    }
  }

  return (
    <div className="App">
      <button onClick={() => addRectangle()}> Rectangle </button>
      <canvas id="canvas" ref={canvasRef} />
      <Settings canvas={canvas}></Settings>
      <Layers canvas={canvas}></Layers>
    </div>
  );
}

export default App;
