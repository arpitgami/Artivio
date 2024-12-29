import pako from "pako";
import axios from "axios";

export async function handleloadcanvas(posterID, canvas, setIsLoading) {
  try {
    const downloadedChunks = [];
    const sortedChunks = await axios.get(
      `http://localhost:8080/posters/getchunksbydesigner?posterid=${posterID}`,
      {
        headers: {
          authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      }
    );

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
    const parsedData = JSON.parse(decompressedData);
    canvas
      .loadFromJSON(parsedData, function (o, object) {
        // console.log(o.id);
        if (o.id) {
          object.id = o.id; // Restore custom 'id'
        }
        if (o.zIndex !== undefined) {
          object.zIndex = o.zIndex; // Restore custom 'zIndex'
        }
      })
      .then((canvas) => {
        canvas.requestRenderAll();
        setIsLoading(false);
      });
  } catch (error) {
    console.error("Error downloading or reconstructing canvas data:", error);
    throw error;
  }
}
