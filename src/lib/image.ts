/**
 * Image processing utilities
 */

/**
 * Removes white/near-white backgrounds from an image data URL and makes them transparent.
 * 
 * @param dataUrl - The original image data URL (e.g. from file upload)
 * @param tolerance - Tolerance for how "white" a pixel needs to be (0-255). Default 240.
 * @returns A promise that resolves to the new image data URL with transparent background.
 */
export function removeWhiteBackground(dataUrl: string, tolerance: number = 240): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas 2D context not available"));
        return;
      }
      
      // Draw image
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Loop through pixels
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // If pixel is near white, make it transparent
          if (r >= tolerance && g >= tolerance && b >= tolerance) {
            data[i + 3] = 0; // Set alpha to 0 (transparent)
          }
        }
        
        // Put data back to canvas
        ctx.putImageData(imageData, 0, 0);
        
        // Return new data URL
        resolve(canvas.toDataURL("image/png"));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataUrl;
  });
}
