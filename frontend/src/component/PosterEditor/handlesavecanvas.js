import pako from "pako";
import axios from "axios";

export async function handlesavecanvas(canvas, isdesigner) {
  function splitIntoChunks(data, chunkSize) {
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks; // array of chunks (Uint8Array)
  }

  const jsonData = JSON.stringify(canvas.toJSON());
  console.log("stringified json data : ", jsonData);
  const compressedData = pako.gzip(jsonData); // Outputs Uint8Array
  const chunkSize = 8 * 1024 * 1024; // 8 MB chunks
  const chunks = splitIntoChunks(compressedData, chunkSize);

  for (let i = 0; i < chunks.length; i++) {
    const blob = new Blob([chunks[i]], { type: "application/gzip" });
    const formData = new FormData();
    formData.append("file", blob);
    if (!isdesigner)
      formData.append("upload_preset", "Artivio_useredits_preset");
    else formData.append("upload_preset", "Artivio_designeredit_preset");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/drhmsjhpq/upload",
        formData
      );
      const cloudinaryUrl = response.data.secure_url;
      const publicId = response.data.public_id;

      const data = {
        designerid: "test",
        posterid: "test",
        chunkjson: cloudinaryUrl,
        chunknumber: i,
        publicid: publicId,
      };

      const res = await axios({
        method: "post",
        url: "http://localhost:8080/posters/savechunkfromdesigner",
        data: data,
      });

      console.log(`Uploaded chunk ${i + 1}:`, res);
    } catch (error) {
      console.error(`Error uploading chunk ${i + 1}:`, error);
    }
  }
}
