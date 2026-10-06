const MAX_IMAGES = 6;
const MAX_DIMENSION = 1400;
const JPEG_QUALITY = 0.82;

export { MAX_IMAGES };

export type PreparedImage = {
  id: string;
  name: string;
  mimeType: string;
  previewUrl: string;
  data: string;
};

export async function fileToPreparedImage(file: File): Promise<PreparedImage> {
  const dataUrl = await compressImage(file);
  const [header, data] = dataUrl.split(",");
  const mimeMatch = header.match(/data:(.+);base64/);

  return {
    id: crypto.randomUUID(),
    name: file.name,
    mimeType: mimeMatch?.[1] ?? "image/jpeg",
    previewUrl: dataUrl,
    data,
  };
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that screenshot."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That file does not look like an image."));
      img.onload = () => {
        const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not process that screenshot."));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function moveItem<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}
