import { useState, type CSSProperties, type MouseEvent } from "react";
import type { GalleryPhoto } from "./types";

const rotations = [-1.6, 1.2, -0.7, 1.8, -1, 0.8, -1.3];
const sizes = "(min-width: 1696px) 288px, (min-width: 1280px) calc((100vw - 256px) / 5), (min-width: 1024px) calc((100vw - 192px) / 4), (min-width: 768px) calc((100vw - 120px) / 3), (min-width: 480px) calc((100vw - 72px) / 2), (min-width: 408px) 360px, calc(100vw - 48px)";

export function PolaroidCard({ photo, index, onOpen }: {
  photo: GalleryPhoto;
  index: number;
  onOpen: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <li className="gallery-item" data-photo-id={photo.id}>
      <button className="gallery-polaroid" type="button" onClick={onOpen}
        style={{ "--photo-rotation": `${rotations[index % rotations.length]}deg` } as CSSProperties}
        aria-label={`Open photo ${index + 1}: ${photo.alt}`}>
        <span className="gallery-photo-window">
          <img src={photo.thumbnail.src}
            srcSet={`${photo.thumbnail.src} ${photo.thumbnail.width}w, ${photo.largeThumbnail.src} ${photo.largeThumbnail.width}w`}
            sizes={sizes} width={photo.width} height={photo.height}
            alt={photo.alt} loading={index < 5 ? "eager" : "lazy"} decoding="async"
            onError={() => setFailed(true)} />
          {failed && <span className="gallery-image-error">Preview unavailable. Open photo to view the original.</span>}
        </span>
      </button>
    </li>
  );
}
