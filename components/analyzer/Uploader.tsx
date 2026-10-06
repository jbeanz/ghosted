"use client";

import { useRef, useState } from "react";
import { MAX_IMAGES, fileToPreparedImage, moveItem, type PreparedImage } from "@/lib/images";

type UploaderProps = {
  images: PreparedImage[];
  onChange: (images: PreparedImage[]) => void;
  disabled?: boolean;
};

export function Uploader({ images, onChange, disabled }: UploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function addFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
    if (!files.length) {
      setError("That doesn't look like a screenshot.");
      return;
    }
    if (images.length + files.length > MAX_IMAGES) {
      setError(`Max ${MAX_IMAGES} screenshots. We don't need the whole camera roll.`);
      return;
    }

    try {
      const prepared = await Promise.all(files.map(fileToPreparedImage));
      onChange([...images, ...prepared]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add those screenshots.");
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (event.dataTransfer.files) void addFiles(event.dataTransfer.files);
        }}
        className={`flex min-h-44 w-full flex-col items-center justify-center rounded-3xl border border-dashed px-6 py-10 text-center transition ${
          dragging ? "border-mint bg-mint/10" : "border-white/15 bg-white/[0.03] hover:border-lavender/50"
        }`}
      >
        <p className="text-lg font-semibold">Drop the receipts</p>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Upload one or more screenshots from iMessage, Hinge, Bumble, IG, WhatsApp — whatever you&apos;ve got.
        </p>
        <span className="mt-5 rounded-full bg-white/10 px-4 py-2 text-sm">Choose screenshots</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(event) => {
          if (event.target.files) void addFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {images.length > 0 && (
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image, index) => (
            <li key={image.id} className="glass overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.previewUrl} alt={`Screenshot ${index + 1}`} className="h-40 w-full object-cover" />
              <div className="flex items-center justify-between gap-1 px-2 py-2 text-xs">
                <span className="truncate text-muted">#{index + 1}</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className="rounded-md px-2 py-1 hover:bg-white/10"
                    onClick={() => onChange(moveItem(images, index, index - 1))}
                    disabled={index === 0}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="rounded-md px-2 py-1 hover:bg-white/10"
                    onClick={() => onChange(moveItem(images, index, index + 1))}
                    disabled={index === images.length - 1}
                  >
                    →
                  </button>
                  <button
                    type="button"
                    className="rounded-md px-2 py-1 text-rose hover:bg-white/10"
                    onClick={() => onChange(images.filter((item) => item.id !== image.id))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="mt-3 text-sm text-rose">{error}</p>}
    </div>
  );
}
