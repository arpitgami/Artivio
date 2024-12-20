import { Image } from "fabric";

export function AddImage({ canvas }) {
  function handleImages(e) {
    const objects = Array.from(e.target.files);

    objects.forEach((obj) => {
      const reader = new FileReader();
      reader.readAsDataURL(obj);
      reader.onload = (e) => {
        const imageURL = e.target.result;
        const imageElement = document.createElement("img");
        imageElement.src = imageURL;
        imageElement.onload = function () {
          const fabricImage = new Image(imageElement);

          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;

          const desiredWidthPercentage = 0.5;
          const desiredHeightPercentage = 0.5;

          // Calculate new width and height
          const newWidth = canvasWidth * desiredWidthPercentage;
          const newHeight = canvasHeight * desiredHeightPercentage;

          // Scale the image proportionally to fit within the desired dimensions
          const scaleX = newWidth / fabricImage.width;
          const scaleY = newHeight / fabricImage.height;

          const scale = Math.min(scaleX, scaleY); // Keep the image proportional
          fabricImage.scale(scale);

          // Center the image on the canvas
          fabricImage.set({
            left: canvasWidth / 2,
            top: canvasHeight / 2,
            originX: "center",
            originY: "center",
          });
          canvas.add(fabricImage);
          canvas.renderAll();
        };
      };
    });
  }
  return (
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={handleImages}
    ></input>
  );
}
