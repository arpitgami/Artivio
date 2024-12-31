import { use, useEffect, useRef, useState } from "react";
import { Canvas, Rect, FabricObject } from "fabric";
import "../App.css";
import { Settings } from "../component/PosterEditor/settings";
import { Layers } from "../component/PosterEditor/layerspanel";
import { AddImage } from "../component/PosterEditor/addimage";
import { handlesavecanvas } from "../component/PosterEditor/handlesavecanvas";
import { useParams } from "react-router-dom";
import { handleloadcanvas } from "../component/PosterEditor/handleloadcanvas";
import axios from "axios";

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
  const { id } = useParams();
  const posterID = id;
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [isdesigner, setIsDesigner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/user", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        // console.log(res.data);
        setIsDesigner(res.data.isdesigner);
      });
  }, []);

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

  useEffect(() => {
    if (canvas) {
      handleloadcanvas(posterID, canvas, setIsLoading, isdesigner);
    }
  }, [isdesigner, canvas]);

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
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
          <div className=" text-black">Loading...</div>
        </div>
      )}
      {isdesigner && <div> Upload your posters layers</div>}
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
        <button
          className="text-white m-4"
          onClick={() => handlesavecanvas(posterID, canvas, isdesigner)}
        >
          save
        </button>
      </div>
    </>
  );
}
