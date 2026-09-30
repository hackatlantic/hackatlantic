import { useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUp, ArrowUpRight, Instagram, Linkedin, Mail } from "lucide-react";
import { PolaroidCard } from "./components/gallery/PolaroidCard";
import { PhotoViewer } from "./components/gallery/PhotoViewer";
import photoData from "./components/gallery/photos.json";
import metadata from "./components/gallery/metadata.json";
import type { GalleryPhoto } from "./components/gallery/types";
import "../styles/gallery.css";

const photos: GalleryPhoto[] = photoData;
const albums = [
  { label: "Saturday album", href: "https://drive.google.com/drive/folders/1fYRXdQMh9KY_jxa79B7JT-Tw_QLHkSjN" },
  { label: "Sunday album", href: "https://drive.google.com/drive/folders/1r5UDM-d9z9piEjGYZE1WUTBm19z_1f9s" },
];

export default function PhotoGalleryPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const returnFocus = useRef<HTMLButtonElement | null>(null);
  useLayoutEffect(() => {
    const previousTitle = document.title;
    document.title = metadata.title;
    const changes: [string, string, string][] = [
      ['meta[name="description"]', "content", metadata.description],
      ['link[rel="canonical"]', "href", metadata.canonical],
      ['meta[property="og:url"]', "content", metadata.canonical],
      ['meta[property="og:title"]', "content", metadata.title],
      ['meta[name="twitter:title"]', "content", metadata.title],
      ['meta[property="og:description"]', "content", metadata.description],
      ['meta[name="twitter:description"]', "content", metadata.description],
    ];
    const restore = changes.map(([selector, attribute, value]) => {
      const element = document.querySelector(selector);
      const previous = element?.getAttribute(attribute);
      element?.setAttribute(attribute, value);
      return () => {
        if (previous != null) element?.setAttribute(attribute, previous);
        else element?.removeAttribute(attribute);
      };
    });
    return () => { document.title = previousTitle; restore.forEach(reset => reset()); };
  }, []);

  return <div className="gallery-page" id="gallery-top">
    <a className="gallery-skip" href="#gallery-photos">Skip to photos</a>
    <div className="gallery-container">
      <header className="gallery-header">
        <a className="gallery-back" href="/"><ArrowLeft size={20} aria-hidden="true" /> Back to recap</a>
        <nav className="gallery-socials" aria-label="Social links">
          <a href="mailto:team@hackatlantic.ca" aria-label="Email Hack Atlantic"><Mail aria-hidden="true" /></a>
          <a href="https://www.instagram.com/hackatlantic" target="_blank" rel="noopener noreferrer" aria-label="Hack Atlantic on Instagram"><Instagram aria-hidden="true" /></a>
          <a href="https://www.linkedin.com/company/hack-atlantic/" target="_blank" rel="noopener noreferrer" aria-label="Hack Atlantic on LinkedIn"><Linkedin aria-hidden="true" /></a>
        </nav>
      </header>
      <main>
        <div className="gallery-heading">
          <h1>Photo Gallery</h1>
          <p className="gallery-subtitle">{photos.length} photos</p>
        </div>
        <ul className="gallery-grid" id="gallery-photos" aria-label="Weekend photos" tabIndex={-1}>
          {photos.map((photo, index) => <PolaroidCard key={photo.id} photo={photo} index={index} onOpen={(event) => {
            returnFocus.current = event.currentTarget;
            setSelected(index);
          }} />)}
        </ul>
      </main>
      <footer className="gallery-footer">
        <div className="gallery-albums">{albums.map(album => <a key={album.href} href={album.href} target="_blank" rel="noopener noreferrer">{album.label} <ArrowUpRight size={17} aria-hidden="true" /></a>)}</div>
        <a href="#gallery-top">Back to top <ArrowUp size={17} aria-hidden="true" /></a>
      </footer>
    </div>
    <PhotoViewer photos={photos} index={selected} onChange={setSelected} onClose={() => setSelected(null)} returnFocus={returnFocus} />
  </div>;
}
