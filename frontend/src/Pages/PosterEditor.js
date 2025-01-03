import { use, useEffect, useRef, useState } from "react";
import { Canvas, Rect, FabricObject } from "fabric";
import "../App.css";
import { Settings } from "../component/PosterEditor/settings";
import { Layers } from "../component/PosterEditor/layerspanel";
import { AddImage } from "../component/PosterEditor/addimage";
import { handlesavecanvas } from "../component/PosterEditor/handlesavecanvas";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { handleloadcanvas } from "../component/PosterEditor/handleloadcanvas";
import { useSearchParams } from "react-router-dom";

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
  const [userid, setUserId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Parse the query string
  const queryParams = new URLSearchParams(location.search);
  const paramValue = queryParams.get("loaduseredit");
  // console.log("Query param value:", paramValue);

  useEffect(() => {
    axios
      .get("http://localhost:8080/user", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((res) => {
        // console.log(res.data);
        setIsDesigner(res.data.isdesigner);
        setUserId(res.data._id);
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
      handleloadcanvas(
        posterID,
        canvas,
        setIsLoading,
        isdesigner,
        paramValue,
        userid
      );
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
          onClick={() => {
            handlesavecanvas(posterID, canvas, isdesigner).then((res) => {
              if (res.success) {
                alert("Poster uploaded succesfully!!");
                if (isdesigner) {
                  navigate("/home/yourdesign");
                }
              }
            });
          }}
        >
          save
        </button>
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box flex flex-col items-center justify-center w-1/4">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-xl mb-4">Poster Saved !!</h3>
            <div>
              <button
                className="btn mr-4"
                onClick={() => {
                  navigate("/home/myedits");
                }}
              >
                {" "}
                My Edits
              </button>
              <button className="btn ml-4">Add to cart</button>
            </div>
            <p
              className="py-2 text-sm"
              onClick={() => {
                document.getElementById("my_modal_3").close();
              }}
            >
              or continue editing
            </p>
          </div>
        </dialog>
      </div>
    </>
  );
}
