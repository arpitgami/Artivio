import pako from "pako";
import axios from "axios";

export async function handleloadcanvas(
  posterID,
  canvas,
  setIsLoading,
  isdesigner,
  isloaduseredit,
  userid,
  isedit
) {
  if (isdesigner === null) {
    // setIsLoading(false);
    return;
  }
  if (isdesigner === true && !isedit) {
    setIsLoading(false);
    return;
  }
  try {
    // console.log(isdesigner);
    console.log("Loading canvas data for poster:", posterID);
    const downloadedChunks = [];
    const chunksURL = isloaduseredit
      ? `${process.env.REACT_APP_API_BASE_URL}/posters/getchunksbyuser?posterid=${posterID}&userid=${userid}`
      : `${process.env.REACT_APP_API_BASE_URL}/posters/getchunksbydesigner?posterid=${posterID}`;
    const sortedChunks = await axios.get(chunksURL, {
      headers: {
        authorization: localStorage.getItem("token"),
      },
    });

    for (const chunk of sortedChunks.data) {
      const chunkResponse = await axios.get(chunk.chunkjson, {
        responseType: "arraybuffer", // To handle binary data
      });
      downloadedChunks.push(new Uint8Array(chunkResponse.data));
    }

    // Combine chunks into a single Uint8Array
    const combinedData = new Uint8Array(
      downloadedChunks.reduce((acc, chunk) => acc + chunk.length, 0)
    );
    let offset = 0;
    for (const chunk of downloadedChunks) {
      combinedData.set(chunk, offset);
      offset += chunk.length;
    }
    const decompressedData = pako.ungzip(combinedData, { to: "string" });
    // console.log("decompressed data : ", decompressedData);
    const parsedData = JSON.parse(decompressedData);

    console.log("parsedData : ", parsedData);

    canvas
      .loadFromJSON(parsedData, function (o, object) {
        // console.log(o.id);
        if (o) {
          if (object.type === "circle") {
            object.radius = o.width / 2;
          }
          if (o.id) {
            object.id = o.id; // Restore custom 'id'
          }
          if (o.zIndex !== undefined) {
            object.zIndex = o.zIndex; // Restore custom 'zIndex'
          }
        } else {
          console.log("Object undefined");
        }
      })
      .then((canvas) => {
        canvas.requestRenderAll();
        setIsLoading(false);
        console.log("check");
      })
      .catch((err) => {
        console.log("error in loadfromJSON : ", err);
      });
  } catch (error) {
    console.error("Error downloading or reconstructing canvas data:", error);
    alert(error);
  }
}
