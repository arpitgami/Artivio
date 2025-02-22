import { useState, useEffect } from "react";

export function Settings({ canvas }) {
  const [selectedObject, setSelectedObject] = useState("null");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [radius, setRadius] = useState("");
  const [color, setColor] = useState("");
  const [fontSize, setFontSize] = useState(20);

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", (event) => {
        handleObjectSelection(event.selected[0]);
      });
      canvas.on("selection:updated", (event) => {
        handleObjectSelection(event.selected[0]);
      });
      canvas.on("selection:cleared", (event) => {
        setSelectedObject(null);
        clearSettings();
      });
      canvas.on("object:modified", (event) => {
        handleObjectSelection(event.target);
      });
      canvas.on("object:scaling", (event) => {
        handleObjectSelection(event.target);
      });
    }
  }, [canvas]);

  function handleObjectSelection(object) {
    if (!object) return;

    setSelectedObject(object);

    if (object.type === "rect") {
      setWidth(Math.round(object.width * object.scaleX));
      setHeight(Math.round(object.height * object.scaleY));
      setColor(object.fill);
      setRadius("");
    } else if (object.type === "circle") {
      setRadius(Math.round(object.radius * object.scaleX));
      setColor(object.fill);
      setHeight("");
      setWidth("");
    } else if (object.type === "text") {
      // console.log(object);
      setFontSize(object.fontSize);
      // console.log("text color : ", object.fill);
      setColor(object.fill);
    }
  }

  function clearSettings() {
    setColor("");
    setRadius("");
    setHeight("");
    setWidth("");
    setFontSize(20);
  }

  function handleWidthChange(e) {
    const newValue = e.target.value;
    setWidth(newValue);

    if (selectedObject && selectedObject.type === "rect") {
      selectedObject.set({ width: newValue / selectedObject.scaleX });
      canvas.renderAll();
    }
  }
  function handleHeightChange(e) {
    const newValue = e.target.value;
    setHeight(newValue);

    if (selectedObject && selectedObject.type === "rect") {
      selectedObject.set({ height: newValue / selectedObject.scaleY });
      canvas.renderAll();
    }
  }
  function handleRadiusChange(e) {
    const newValue = e.target.value;
    setRadius(newValue);

    if (selectedObject && selectedObject.type === "circle") {
      selectedObject.set({ radius: newValue / selectedObject.scaleX });
      canvas.renderAll();
    }
  }

  function handleColorChange(e) {
    setColor(e.target.value);

    selectedObject.set({ fill: e.target.value });
    canvas.renderAll();
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  function handleFontSizeChange(e) {
    const newSize = e.target.value;
    setFontSize(newSize);

    if (selectedObject && selectedObject.type === "text") {
      selectedObject.set({ fontSize: parseInt(newSize, 10) });
      canvas.renderAll();
    }
  }

  return (
    <>
      <div className="text-sm text-base-100 ">Settings Pannel</div>
      {selectedObject && selectedObject.type === "rect" && (
        <>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 items-start"
          >
            {/* Rectangle Settings */}
            <label className="flex flex-row gap-2 items-center justify-around">
              <span className="text-base-200 text-sm">Width : </span>
              <input
                label="Width"
                value={width}
                onChange={handleWidthChange}
                className="input input-xs"
              />
            </label>
            <label>
              <span className="text-base-200 text-sm">Height : </span>
              <input
                label="Height"
                value={height}
                onChange={handleHeightChange}
                className="input input-xs"
              />
            </label>
            <label className="flex flex-row gap-2 items-center justify-around">
              <span className="text-base-200 text-sm">Color : </span>
              <input
                label="Color"
                type="color"
                value={color}
                onChange={handleColorChange}
                className="input input-xs"
              />
            </label>
          </form>
        </>
      )}
      {selectedObject && selectedObject.type === "text" && (
        <>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 items-start"
          >
            {/* Text Settings */}
            <label className="flex flex-row gap-2 items-center justify-around">
              <span className="text-base-200 text-sm">Font Size : </span>
              <input
                label="Font Size"
                value={fontSize}
                onChange={handleFontSizeChange}
                className="input input-xs"
              />
            </label>
            <label className="flex flex-row gap-2 items-center justify-end">
              <span className="text-base-200 text-sm">Color : </span>
              <input
                label="Color"
                type="color"
                value={color}
                onChange={handleColorChange}
                className="input input-xs"
              />
            </label>
          </form>
        </>
      )}
      {selectedObject && selectedObject.type === "circle" && (
        <>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 items-start"
          >
            {/* Text Settings */}
            <label className="flex flex-row gap-2 items-center justify-around">
              <span className="text-base-200 text-sm">Radius : </span>
              <input
                label="Radius"
                value={radius}
                onChange={handleRadiusChange}
                className="input input-xs"
              />
            </label>
            <label className="flex flex-row gap-2 items-center justify-end">
              <span className="text-base-200 text-sm">Color : </span>
              <input
                label="Color"
                type="color"
                value={color}
                onChange={handleColorChange}
                className="input input-xs"
              />
            </label>
          </form>
        </>
      )}
    </>
  );
}
