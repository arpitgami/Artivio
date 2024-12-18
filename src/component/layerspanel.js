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
    console.log(selectedLayer);
    if (e.selected[0]) setSelectedLayer(e.selected[0].id);
  }
  useEffect(() => {
    if (canvas) {
      canvas.on("object:added", updateLayer);
      canvas.on("object:removed", updateLayer);
      canvas.on("selection:added", updateSelection);
      canvas.on("selection:removed", setSelectedLayer(null));
      canvas.on("selection:modified", updateSelection);

      return () => {
        canvas.off("object:added", updateLayer);
        canvas.off("object:removed", updateLayer);
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

  return (
    <div className="Layerspannel">
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
