import { useState, type RefObject } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import type { GalleryPhoto } from "./types";

function Preview({ photo }: { photo: GalleryPhoto }) {
  const [failed, setFailed] = useState(false);
  return <div className="gallery-viewer-image">
    <img src={photo.preview.src} width={photo.preview.width} height={photo.preview.height}
      alt={photo.alt} onError={() => setFailed(true)} />
    {failed && <p className="gallery-viewer-error" role="status">This preview could not load. Use “Open original” below to view the photo.</p>}
  </div>;
}

export function PhotoViewer({ photos, index, onChange, onClose, returnFocus }: {
  photos: GalleryPhoto[];
  index: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
  returnFocus: RefObject<HTMLButtonElement>;
}) {
  const photo = index === null ? null : photos[index];
  const move = (offset: number) => onChange(((index ?? 0) + offset + photos.length) % photos.length);
  return <Dialog.Root open={photo !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
    {photo && index !== null && <Dialog.Portal>
      <Dialog.Overlay className="gallery-viewer-overlay" />
      <Dialog.Content className="gallery-viewer" onCloseAutoFocus={(event) => {
        event.preventDefault();
        returnFocus.current?.focus({ preventScroll: true });
      }} onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}>
        <div className="gallery-viewer-top">
          <Dialog.Title className="gallery-viewer-title">Photo {index + 1} of {photos.length}</Dialog.Title>
          <Dialog.Close className="gallery-icon-button" aria-label="Close photo viewer"><X aria-hidden="true" /></Dialog.Close>
        </div>
        <Preview key={photo.id} photo={photo} />
        <div className="gallery-viewer-bottom">
          <button className="gallery-icon-button" type="button" onClick={() => move(-1)} aria-label="Previous photo"><ArrowLeft aria-hidden="true" /></button>
          <div className="gallery-viewer-caption">
            <Dialog.Description>{photo.album} · {photo.filename}</Dialog.Description>
            <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer">Open original <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
          <button className="gallery-icon-button" type="button" onClick={() => move(1)} aria-label="Next photo"><ArrowRight aria-hidden="true" /></button>
        </div>
      </Dialog.Content>
    </Dialog.Portal>}
  </Dialog.Root>;
}
