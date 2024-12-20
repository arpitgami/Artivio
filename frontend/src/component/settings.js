import { useState, useEffect } from "react";

export function Settings({ canvas }) {
  const [selectedObject, setSelectedObject] = useState("null");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [diameter, setDiameter] = useState("");
  const [color, setColor] = useState("");

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
      setDiameter("");
    } else if (object.type === "circle") {
      setDiameter(Math.round(object.radius * 2 * object.scaleX));
      setColor(object.fill);
      setHeight("");
      setWidth("");
    }
  }

  function clearSettings() {
    setColor("");
    setDiameter("");
    setHeight("");
    setWidth("");
  }

  function handleWidthChange(e) {
    const newValue = e.target.value;
    setWidth(newValue);

    if (selectedObject && selectedObject.type === "rect") {
      selectedObject.set({ width: newValue / selectedObject.scaleX });
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

  return (
    <>
      {selectedObject && selectedObject.type === "rect" && (
        <>
          <form onSubmit={handleSubmit}>
            <label>Width : </label>
            <input
              label="Width"
              value={width}
              onChange={handleWidthChange}
            ></input>
            <label>Colour : </label>
            <input
              label="Color"
              type="color"
              value={color}
              onChange={handleColorChange}
            ></input>
          </form>
        </>
      )}
    </>
  );
}
