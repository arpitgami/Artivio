import { use, useEffect, useRef, useState } from "react";
import { Canvas, Rect, FabricObject, Circle } from "fabric";
import "../App.css";
import { Settings } from "../component/PosterEditor/settings";
import { Layers } from "../component/PosterEditor/layerspanel";
import { AddImage } from "../component/PosterEditor/addimage";
import { handlesavecanvas } from "../component/PosterEditor/handlesavecanvas";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { handleloadcanvas } from "../component/PosterEditor/handleloadcanvas";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { Addtext } from "../component/PosterEditor/addtext";

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
  const [isSaving, setIsSaving] = useState(false);
  const [userid, setUserId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Parse the query string
  const queryParams = new URLSearchParams(location.search);
  const isloaduseredit = queryParams.get("loaduseredit");
  const isedit = queryParams.get("edit");

  // console.log()
  // console.log("Query param value:", isloaduseredit, isedit);

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
        width: 480,
        height: 600,
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
        isloaduseredit,
        userid,
        isedit
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
      canvas.setActiveObject(rect);
    }
  }
  function addCircle() {
    if (canvas) {
      const rect = new Circle({
        top: 100,
        left: 100,
        width: 100,
        height: 100,
        fill: "#D84D42",
      });

      canvas.add(rect);
    }
  }
  async function handleaddtocart() {
    try {
      const user = await axios.get("http://localhost:8080/user", {
        headers: { Authorization: localStorage.getItem("token") },
      });

      const res = await axios.post(
        "http://localhost:8080/cart",
        {
          posterid: id,
          userid: user.data._id,
          customized: true,
          quantity: 1,
        },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      alert(res.data.message);
      navigate("/cart");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
          <div className=" text-black">Loading...</div>
        </div>
      )}
      {isSaving && (
        <>
          <div className="absolute inset-0 flex items-center justify-center opacity-30 bg-base-100 z-50">
            <span class="loading loading-spinner loading-lg"></span>{" "}
          </div>
        </>
      )}
      <div className="bg-primary flex flex-col justify-center relative items-center m-0 w-screen h-screen overflow-hidden ">
        <div
          className="btn btn-sm btn-primary hover:bg-base-300 hover:text-primary text-base-100 absolute top-10 left-10 "
          onClick={() => navigate(-1)}
        >
          {" "}
          {`<`}
          {" back"}
        </div>
        {isdesigner && (
          <div className="text-base-100 mx-auto text-md font-normal p-2">
            {" "}
            Upload your poster's layers
          </div>
        )}
        <div className="flex flex-row items-center justify-center h-[600px] ">
          <div className="flex flex-col items-center justify-center h-screen">
            <button
              className="btn btn-sm text-base-100"
              onClick={() => addRectangle()}
            >
              <FontAwesomeIcon icon={faSquare} style={{ color: "#000000" }} />
            </button>
            <Addtext canvas={canvas} />
          </div>
          <div className="">
            <canvas id="canvas" ref={canvasRef} />
          </div>
          <div className="flex flex-col h-[600px] items-center justify-evenly mx-10">
            <div>
              <AddImage canvas={canvas}></AddImage>
              <div
                className="btn btn-sm text-primary mx-4"
                onClick={() => {
                  setIsSaving(true);
                  handlesavecanvas(
                    posterID,
                    canvas,
                    isdesigner,
                    setIsSaving
                  ).then((res) => {
                    if (res.success) {
                      // alert("Poster uploaded succesfully!!");
                      if (isdesigner) {
                        navigate("/home/yourdesign");
                      }
                    }
                  });
                }}
              >
                Save
              </div>
            </div>
            <Settings canvas={canvas}></Settings>
            <div className="">
              <Layers canvas={canvas}></Layers>
            </div>
          </div>
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
                <button className="btn ml-4" onClick={handleaddtocart}>
                  Add to cart
                </button>
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
      </div>
    </>
  );
}
