import { useEffect, useState } from "react";
import { Canvas } from "fabric";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrashCan } from "@fortawesome/free-regular-svg-icons";

export function Layers({ canvas }) {
  const [layers, setLayers] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [visibilityMap, setVisibilityMap] = useState({});

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

  function handledeletelayer(id) {
    canvas.getObjects().forEach((obj) => {
      if (obj.id === id) {
        canvas.remove(obj);
      }
    });
  }

  function handlevisibility(id) {
    const object = canvas.getObjects().find((obj) => obj.id === id);
    if (object) {
      object.visible = !object.visible;
      canvas.renderAll();

      setVisibilityMap((prev) => ({
        ...prev,
        [id]: object.visible,
      }));
    }
  }

  return (
    <div className="w-52 h-72 flex flex-col overflow-hidden bg-base-100 relative">
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={() => moveLayer("up")}
          className="btn btn-sm btn-ghost"
        >
          Up
        </button>
        <button
          onClick={() => moveLayer("down")}
          className="btn btn-sm btn-ghost"
        >
          Down
        </button>
      </div>
      <ul className="mt-10 overflow-y-auto flex-1 space-y-1 ">
        {layers.map((obj) => (
          <li
            key={obj.id}
            onClick={() => handleSelectLayer(obj.id)}
            className={`p-2  ${
              obj.id === selectedLayer ? " bg-gray-100" : null
            } cursor-pointer hover:bg-gray-100 flex flex-row justify-between items-center`}
          >
            {obj.type} ({obj.zIndex})
            <span className="flex flex-row gap-2">
              <FontAwesomeIcon
                className={` size-4 ${
                  visibilityMap[obj.id] === false
                    ? "text-gray-400"
                    : "text-primary"
                }  `}
                onClick={() => handlevisibility(obj.id)}
                icon={faEye}
              />
              <FontAwesomeIcon
                className="text-primary size-4 "
                icon={faTrashCan}
                onClick={() => handledeletelayer(obj.id)}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
