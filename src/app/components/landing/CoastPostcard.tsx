import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { ditherColor, sampleCells } from "./dither.mjs";

// A focused interpretation of the supplied Ink Garden dither preset, not an ASCII editor.
// The original Atlantic illustration is the fallback and always remains available.
export function CoastPostcard({ image }: { image: string }) {
  const wrapper = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"original" | "pixels">("original");
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [cells, setCells] = useState<ReturnType<typeof sampleCells>>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!wrapper.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (!entry.isIntersecting) setPlaying(false);
      },
      { rootMargin: "100px" },
    );
    observer.observe(wrapper.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || cells.length || failed || mode !== "pixels") return;
    let cancelled = false;
    const source = new Image();
    source.onload = () => {
      if (cancelled) return;
      try {
        const buffer = document.createElement("canvas");
        buffer.width = 720;
        buffer.height = 480;
        const context = buffer.getContext("2d", { willReadFrequently: true });
        if (!context) throw new Error("Canvas unavailable");
        const scale = Math.max(
          720 / source.naturalWidth,
          480 / source.naturalHeight,
        );
        const w = source.naturalWidth * scale,
          h = source.naturalHeight * scale;
        context.drawImage(source, (720 - w) / 2, (480 - h) / 2, w, h);
        setCells(
          sampleCells(context.getImageData(0, 0, 720, 480).data, 720, 480),
        );
      } catch {
        setFailed(true);
        setMode("original");
        setPlaying(false);
      }
    };
    source.onerror = () => {
      if (!cancelled) {
        setFailed(true);
        setMode("original");
        setPlaying(false);
      }
    };
    source.src = image;
    return () => {
      cancelled = true;
    };
  }, [image, visible, cells.length, failed, mode]);

  useEffect(() => {
    if (!cells.length || mode !== "pixels") return;
    const context = canvas.current?.getContext("2d");
    if (!context) {
      setFailed(true);
      setMode("original");
      setPlaying(false);
      return;
    }
    const draw = (time: number) => {
      context.clearRect(0, 0, 720, 480);
      for (const cell of cells) {
        context.fillStyle = ditherColor(cell, time);
        context.fillRect(cell.x, cell.y, 9, 9);
      }
    };
    draw(0);
    if (!playing || reduced || !visible || document.hidden) return;
    let frame = 0,
      started = 0,
      lastDraw = 0;
    const animate = (now: number) => {
      if (!started) started = now;
      if (now - started >= 5000) {
        setPlaying(false);
        return;
      }
      if (now - lastDraw >= 1000 / 18) {
        draw((now - started) / 1000);
        lastDraw = now;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    const pauseWhenHidden = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", pauseWhenHidden);
    };
  }, [cells, mode, playing, reduced, visible]);

  return (
    <figure className="coast-postcard" ref={wrapper}>
      <div className="postcard-art">
        <img
          src={image}
          alt="Illustrated Hopewell Rocks rising from the water at sunset."
          loading="lazy"
          width="720"
          height="480"
          style={{ opacity: mode === "pixels" && cells.length > 0 ? 0 : 1 }}
        />
        <canvas
          ref={canvas}
          width="720"
          height="480"
          aria-hidden="true"
          style={{ opacity: mode === "pixels" && cells.length > 0 ? 1 : 0 }}
        />
      </div>
      <figcaption>
        <span>A little piece of the Atlantic.</span>
        <div
          className="postcard-controls"
          role="group"
          aria-label="Coast illustration style"
        >
          <button
            aria-pressed={mode === "original"}
            onClick={() => {
              setMode("original");
              setPlaying(false);
            }}
          >
            Original
          </button>
          <button
            aria-pressed={mode === "pixels"}
            disabled={failed}
            onClick={() => {
              setMode("pixels");
              setPlaying(false);
            }}
          >
            Pixels
          </button>
        </div>
      </figcaption>
      {mode === "pixels" && !reduced && cells.length > 0 && (
        <button
          className="postcard-play"
          onClick={() => setPlaying(!playing)}
          aria-label={
            playing
              ? "Pause pixel animation"
              : "Play five-second pixel animation"
          }
        >
          {playing ? (
            <Pause size={15} aria-hidden="true" />
          ) : (
            <Play size={15} aria-hidden="true" />
          )}
          {playing ? "Pause" : "Animate"}
        </button>
      )}
      {failed && (
        <p className="postcard-status" role="status">
          Pixel view is unavailable. The original illustration is still here.
        </p>
      )}
    </figure>
  );
}
