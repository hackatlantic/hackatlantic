const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const clamp = (value) => Math.max(0, Math.min(255, value));

/** Average source pixels once; animation reuses the cell data, not getImageData. */
export function sampleCells(data, width, height, cellSize = 9) {
  const cells = [];
  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0,
        count = 0;
      for (let py = y; py < Math.min(y + cellSize, height); py++) {
        for (let px = x; px < Math.min(x + cellSize, width); px++) {
          const offset = (py * width + px) * 4;
          r += data[offset];
          g += data[offset + 1];
          b += data[offset + 2];
          a += data[offset + 3];
          count++;
        }
      }
      cells.push({
        x,
        y,
        r: r / count,
        g: g / count,
        b: b / count,
        a: a / count / 255,
      });
    }
  }
  return cells;
}

/** Ordered color dithering: 9px cells, 158% contrast, full coverage, no tint/blur/post-FX. */
export function ditherColor(cell, time = 0) {
  const threshold =
    (BAYER[(Math.floor(cell.y / 9) % 4) * 4 + (Math.floor(cell.x / 9) % 4)] /
      16 -
      0.5) *
    34;
  const pulse =
    time === 0 ? 0 : Math.sin(time * 1.4 + cell.x * 0.012 + cell.y * 0.007) * 6;
  const channel = (value) =>
    clamp(
      Math.round(clamp((value - 128) * 1.58 + 128 + threshold + pulse) / 51) *
        51,
    );
  return `rgba(${channel(cell.r)},${channel(cell.g)},${channel(cell.b)},${cell.a})`;
}
