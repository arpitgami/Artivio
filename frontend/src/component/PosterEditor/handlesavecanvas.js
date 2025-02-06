import pako from "pako";
import axios from "axios";

export async function handlesavecanvas(
  posterID,
  canvas,
  isdesigner,
  setIsSaving
) {
  function splitIntoChunks(data, chunkSize) {
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks; // array of chunks (Uint8Array)
  }

  canvas.getObjects().forEach((obj) => {
    console.log(obj);
  });
  // Store text properties manually before calling `toJSON()`
  const textMap = new Map();
  canvas.getObjects().forEach((obj, index) => {
    if (obj.type === "textbox" || obj.type === "text") {
      textMap.set(index, obj.text);
    }
  });

  // Serialize the canvas
  const tojsondata = await canvas.toJSON();

  console.log("toJSON data BEFORE adding text:", tojsondata);

  // Restore text properties from `textMap`
  tojsondata.objects.forEach((obj, index) => {
    if (textMap.has(index)) {
      obj.text = textMap.get(index);
    }
  });

  console.log("toJSON data AFTER adding text:", tojsondata);

  const jsonData = JSON.stringify(tojsondata);

  const compressedData = pako.gzip(jsonData); // Outputs Uint8Array
  const chunkSize = 8 * 1024 * 1024; // 8 MB chunks
  const chunks = splitIntoChunks(compressedData, chunkSize);

  const user = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/user`, {
    headers: { Authorization: localStorage.getItem("token") },
  });
  console.log("User:", user.data);
  const previousChunksURL = isdesigner
    ? `${process.env.REACT_APP_API_BASE_URL}/posters/getchunksbydesigner`
    : `${process.env.REACT_APP_API_BASE_URL}/posters/getchunksbyuser`;
  const previouschunks = await axios.get(
    previousChunksURL + `?userid=${user.data._id}&posterid=${posterID}`,
    {
      headers: { Authorization: localStorage.getItem("token") },
    }
  );
  const previousChunks = previouschunks.data;
  console.log("Previous chunks:", previousChunks);

  if (previousChunks.length > 0) {
    try {
      const deletechunkURL = isdesigner
        ? `${process.env.REACT_APP_API_BASE_URL}/posters/deletechunksofdesigner`
        : `${process.env.REACT_APP_API_BASE_URL}/posters/deletechunksofuser`;
      const deleteResponse = await axios.post(
        deletechunkURL,
        {
          chunks: previousChunks,
        },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      console.log("Deleted previous chunks:", deleteResponse.data);
    } catch (error) {
      console.error("Error deleting previous chunks:", error.response.data);
    }
  }

  await Promise.all(
    chunks.map(async (chunk, i) => {
      const publicId = `${user.data._id}_${posterID}_chunk_${i}`;
      const blob = new Blob([chunk], { type: "application/gzip" });

      try {
        // Step 1: Get signed parameters from the backend

        const signatureResponse = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/generate-signature`,
          {
            public_id: publicId,
            upload_preset: isdesigner
              ? "Artivio_designeredit_preset"
              : "Artivio_useredits_preset",
          },
          { headers: { Authorization: localStorage.getItem("token") } }
        );
        console.log(
          `Got signature for chunk ${i + 1}:`,
          signatureResponse.data
        );

        const { signature, timestamp, upload_preset } = signatureResponse.data;

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
          posterid: posterID,
          chunkjson: cloudinaryUrl,
          chunknumber: i,
          publicid: publicId,
        };

        isdesigner
          ? (data.designerid = user.data._id)
          : (data.userid = user.data._id);

        const URL = isdesigner
          ? `${process.env.REACT_APP_API_BASE_URL}/posters/savechunkfromdesigner`
          : `${process.env.REACT_APP_API_BASE_URL}/posters/savechunkfromuser`;
        const backendResponse = await axios.post(URL, data, {
          headers: { Authorization: localStorage.getItem("token") },
        });

        console.log(`Uploaded chunk ${i + 1}:`, backendResponse.data);
      } catch (error) {
        console.error(`Error uploading chunk ${i + 1}:`, error.response.data);
        alert(`Error saving canvas : ${error.response.data.message}`);
        return;
      }
    })
  );

  if (isdesigner) {
    setIsSaving(false);
    return { message: "Canvas saved successfully!", success: true };
  }

  //canvas image save

  const dataURL = canvas.toDataURL({
    format: "png",
  });

  const parts = dataURL.split(",");
  const mime = parts[0].match(/:(.*?);/)[1]; // image/png
  const binary = atob(parts[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  const blob = new Blob([new Uint8Array(array)], { type: mime });
  const publicId = `${user.data._id}_${posterID}_canvaspng`;

  const signatureResponse = await axios.post(
    `${process.env.REACT_APP_API_BASE_URL}/generate-signature`,
    {
      public_id: publicId,
      upload_preset: "Artivio_useredits_preset",
    },
    { headers: { Authorization: localStorage.getItem("token") } }
  );

  const { signature, timestamp, upload_preset } = signatureResponse.data;

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

  const data = {
    userid: user.data._id,
    posterid: posterID,
    imageURL: cloudinaryResponse.data.secure_url,
    publicid: publicId,
  };

  const response = await axios.post(
    `${process.env.REACT_APP_API_BASE_URL}/posters/uploadimage`,
    data,
    {
      headers: { Authorization: localStorage.getItem("token") },
    }
  );

  setIsSaving(false);

  console.log("Uploaded canvas png:", response.data);
  document.getElementById("my_modal_3").showModal();
  return { message: "Canvas saved successfully!", success: true };
}
