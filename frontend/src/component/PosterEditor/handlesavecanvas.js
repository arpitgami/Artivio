import pako from "pako";
import axios from "axios";

export async function handlesavecanvas(posterID, canvas, isdesigner) {
  function splitIntoChunks(data, chunkSize) {
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks; // array of chunks (Uint8Array)
  }

  const jsonData = JSON.stringify(canvas.toJSON());

  const compressedData = pako.gzip(jsonData); // Outputs Uint8Array
  const chunkSize = 8 * 1024 * 1024; // 8 MB chunks
  const chunks = splitIntoChunks(compressedData, chunkSize);

  const user = await axios.get(`http://localhost:8080/user`, {
    headers: { Authorization: localStorage.getItem("token") },
  });
  console.log("User:", user.data);

  for (let i = 0; i < chunks.length; i++) {
    const publicId = `${user.data._id}_${posterID}_chunk_${i}`;
    const blob = new Blob([chunks[i]], { type: "application/gzip" });

    try {
      // Step 1: Get signed parameters from the backend
      const timestamp = Math.floor(Date.now() / 1000);

      const signatureResponse = await axios.post(
        "http://localhost:8080/generate-signature",
        {
          public_id: publicId,
          timestamp,
          upload_preset: isdesigner
            ? "Artivio_designeredit_preset"
            : "Artivio_useredits_preset",
        },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      console.log(`Got signature for chunk ${i + 1}:`, signatureResponse.data);

      const { signature, cloud_name, upload_preset } = signatureResponse.data;

      // Step 2: Upload to Cloudinary with signed parameters
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("public_id", publicId);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY);
      formData.append("upload_preset", upload_preset);

      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(`Coudinary response : `, cloudinaryResponse.data);

      const cloudinaryUrl = cloudinaryResponse.data.secure_url;

      // Step 3: Save metadata to the backend
      const data = {
        // isdesigner ? designerid : userid  : user.data.userid,
        posterid: posterID,
        chunkjson: cloudinaryUrl,
        chunknumber: i,
        publicid: publicId,
      };

      isdesigner
        ? (data.designerid = user.data._id)
        : (data.userid = user.data._id);

      const URL = isdesigner
        ? "http://localhost:8080/posters/savechunkfromdesigner"
        : "http://localhost:8080/posters/savechunkfromuser";
      const backendResponse = await axios.post(URL, data);

      console.log(`Uploaded chunk ${i + 1}:`, backendResponse.data);
    } catch (error) {
      console.error(`Error uploading chunk ${i + 1}:`, error.response.data);
    }
  }
}
