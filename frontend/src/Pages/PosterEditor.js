import { useEffect, useRef, useState } from "react";
import { Canvas, Rect, FabricObject } from "fabric";
import "../App.css";
import { Settings } from "../component/PosterEditor/settings";
import { Layers } from "../component/PosterEditor/layerspanel";
import { AddImage } from "../component/PosterEditor/addimage";
// import { fabric } from "fabric";

FabricObject.prototype.toObject = (function (toObject) {
  return function () {
    return {
      ...toObject.call(this),
      id: this.id,
      zIndex: this.zIndex,
    };
  };
})(FabricObject.prototype.toObject);

export function PosterEditor() {
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

  const [jsoncanvas, setJsoncanvas] = useState("");

  function saveCanvas() {
    const json = JSON.stringify(canvas.toJSON());
    setJsoncanvas(json);
  }

  function loadCanvas() {
    canvas.clear();

    canvas
      .loadFromJSON(jsoncanvas, function (o, object) {
        console.log(o.id);
        if (o.id) {
          object.id = o.id; // Restore custom 'id'
        }
        if (o.zIndex !== undefined) {
          object.zIndex = o.zIndex; // Restore custom 'zIndex'
        }
      })
      .then((res) => {
        canvas.renderAll();
        console.log("Canvas reloaded successfully.");
      });
  }

  return (
    <>
      <AddImage canvas={canvas}></AddImage>
      <div className="flex flex-row items-center justify-center bg-slate-700 h-screen ">
        <button className="text-white" onClick={() => addRectangle()}>
          Rectangle
        </button>
        <canvas id="canvas" ref={canvasRef} />
        <div className="">
          <Settings canvas={canvas}></Settings>
          <Layers canvas={canvas}></Layers>
        </div>
        <button className="text-white m-4" onClick={saveCanvas}>
          save
        </button>
        <button className="text-white m-4" onClick={loadCanvas}>
          reload
        </button>
      </div>
    </>
  );
}
