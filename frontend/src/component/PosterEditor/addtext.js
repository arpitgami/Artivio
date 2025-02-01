import { FabricText } from "fabric";
import { useEffect, useState } from "react";

export function Addtext({ canvas }) {
  const [textContent, setTextContent] = useState("");
  const [selectedObject, setSelectedObject] = useState("");

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", (event) => {
        handleObjectSelection(event.selected[0]);
      });
      canvas.on("selection:updated", (event) => {
        handleObjectSelection(event.selected[0]);
      });
      canvas.on("selection:cleared", (event) => {
        setSelectedObject("");
        setTextContent("");
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

    if (object.type === "text") {
      // console.log(object.text);
      setTextContent(object.text);
    } else {
      setTextContent("");
    }
  }

  function handleAddText(e) {
    e.preventDefault();

    if (selectedObject.type === "text") {
      return;
    }
    // if (!textContent.trim()) {
    //   console.warn("Text content is empty. Skipping text addition.");
    //   return;
    // }

    const text = new FabricText(textContent, {
      left: 50,
      top: 50,
      fill: "#D84D42",
      fontSize: 28,
    });

    canvas.add(text);
    canvas.centerObject(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  }

  function handletextchange(e) {
    if (selectedObject && selectedObject.type === "text") {
      selectedObject.set({ text: e.target.value });
      setTextContent(e.target.value);
      canvas.renderAll();
      return;
    }
    setTextContent(e.target.value);
  }

  return (
    <div>
      <form onSubmit={handleAddText} className="flex flex-row">
        <label>
          <input
            type="text"
            placeholder="Add your text here.."
            value={textContent}
            onChange={handletextchange}
            className=" input input-sm mx-3"
          />
        </label>
        <button type="submit" className="btn btn-sm">
          Add Text
        </button>
      </form>
    </div>
  );
}
