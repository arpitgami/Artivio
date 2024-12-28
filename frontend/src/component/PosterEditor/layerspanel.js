import { useEffect, useState } from "react";
import { Canvas } from "fabric";

export function Layers({ canvas }) {
  const [layers, setLayers] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState(null);

  function addLayerId(object) {
    if (!object.id) {
      const time = new Date().getTime();
      object.id = `${object.type}_${time}`;
    }
  }

  Canvas.prototype.updateZIndices = function () {
    const objects = this.getObjects();
    objects.forEach((obj, index) => {
      addLayerId(obj);
      obj.zIndex = index;
    });
  };

  function updateLayer() {
    if (canvas) {
      canvas.updateZIndices();

      const objects = canvas
        .getObjects()
        .map((obj) => ({ id: obj.id, zIndex: obj.zIndex, type: obj.type }));
      // console.log(objects);
      setLayers([...objects].reverse());
    }
  }
  function updateSelection(e) {
    const object = e.selected[0];
    if (object) setSelectedLayer(object.id);
  }

  useEffect(() => {
    if (canvas) {
      canvas.on("object:added", updateLayer);
      canvas.on("object:removed", updateLayer);
      canvas.on("selection:created", updateSelection);
      canvas.on("selection:cleared", setSelectedLayer(null));
      canvas.on("selection:updated", updateSelection);

      return () => {
        canvas.off("object:added", updateLayer);
        canvas.off("object:removed", updateLayer);
        canvas.off("selection:created", updateSelection);
        canvas.off("selection:cleared", setSelectedLayer(null));
        canvas.off("selection:updated", updateSelection);
      };
    }
  }, [canvas]);

  function handleSelectLayer(id) {
    const object = canvas.getObjects().find((obj) => obj.id === id);
    if (object) {
      canvas.setActiveObject(object);
      canvas.renderAll();
    }
  }
  function moveLayer(st) {
    // console.log(selectedLayer);
    if (!selectedLayer) return;

    const objects = canvas.getObjects();

    const object = canvas.getObjects().find((obj) => obj.id === selectedLayer);
    const index = objects.indexOf(object);

    // console.log(index);

    const newObjects = objects;
    if (st === "up" && index < objects.length - 1) {
      const temp = newObjects[index];
      newObjects[index] = newObjects[index + 1];
      newObjects[index + 1] = temp;
    } else if (st === "down" && index > 0) {
      const temp = newObjects[index];
      newObjects[index] = newObjects[index - 1];
      newObjects[index - 1] = temp;
    }
    // console.log(newObjects);
    const bgcolor = canvas.backgroundColor;
    canvas.clear();

    newObjects.forEach((obj) => canvas.add(obj));
    canvas.renderAll();

    updateLayer();
    canvas.setActiveObject(object);
    canvas.backgroundColor = bgcolor;
    canvas.renderAll();
  }

  return (
    <div className="Layerspannel">
      <button onClick={() => moveLayer("up")}>up</button>
      <button onClick={() => moveLayer("down")}>down</button>
      <ul>
        {layers.map((obj) => {
          return (
            <li
              key={obj.id}
              onClick={() => handleSelectLayer(obj.id)}
              className={obj.id === selectedLayer ? "selected-layer" : ""}
            >
              {obj.type}({obj.zIndex})
            </li>
          );
        })}
      </ul>
    </div>
  );
}
