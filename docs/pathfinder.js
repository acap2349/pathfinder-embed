/**
@author Alex Miller
@title  Pathfinder
@desc   Click to spawn new path segments
*/

// Self-contained: no external imports.
let prevFrame;
let width = 0, height = 0;

// Box-drawing glyphs (UTF-8). If your font doesn't support these,
// they still render in most browsers; otherwise they'll fall back.
const roads = "│─┏┓┛┗┣┳┻╋";

export const settings = {
  fps: 30,
  backgroundColor: "#000000",
};

// Safe accessor: cells may be " " or {char,color}
function getCharFromCell(cell) {
  if (cell == null) return " ";
  return (typeof cell === "string") ? cell : (cell.char || " ");
}

function get(x, y) {
  if (x < 0 || x >= width) return " ";
  if (y < 0 || y >= height) return " ";
  const cell = prevFrame[y * width + x];
  return getCharFromCell(cell);
}

function choose(list) {
  return list.charAt(Math.floor(Math.random() * list.length));
}

export function pre(context, cursor, buffer) {
  // Initialize on first run or resize
  if (width !== context.cols || height !== context.rows) {
    width = context.cols;
    height = context.rows;
    const length = width * height;

    // Fill with spaces as OBJECTS so renderer definitely has {char,color}
    for (let i = 0; i < length; i++) {
      buffer[i] = { char: " ", color: "white" };
    }

    // Seed a few visible starters so something shows immediately
    const seeds = Math.max(20, Math.floor((width * height) * 0.0005)); // ~0.5%
    for (let i = 0; i < seeds; i++) {
      const idx = Math.floor(Math.random() * length);
      buffer[idx] = { char: choose(roads), color: "white" };
    }

    // Tiny diagonal "hello" stroke for sanity (top-left corner)
    for (let d = 0; d < Math.min(12, Math.min(width, height)); d++) {
      buffer[d * width + d] = { char: "│", color: "white" };
      if (d + 1 < width) buffer[d * width + (d + 1)] = { char: "─", color: "white" };
    }
  }

  // Copy previous frame so reads won't mutate current buffer
  prevFrame = [...buffer];
}

export function main(coord, context, cursor, buffer) {
  const { x, y } = coord;

  // Allow clicks to plant seeds
  if (
    cursor.pressed &&
    Math.floor(cursor.x) === x &&
    Math.floor(cursor.y) === y &&
    get(x, y) === " "
  ) {
    return { char: choose(roads), color: "white" };
  }

  const last = get(x, y);
  if (last === " ") {
    let char = " ";

    const top    = get(x, y - 1);
    const bottom = get(x, y + 1);
    const left   = get(x - 1, y);
    const right  = get(x + 1, y);

    // Grow based on neighbors (decoded neighbor sets)
    if ("│┫┣╋┏┓┳".includes(top)) {
      char = choose("││││││││││││││││││││┻┫┣┛╋");
    } else if ("│┻┗┣┫┛╋".includes(bottom)) {
      char = choose("││││││││││││││││││││┏┓┣┫┳╋");
    } else if ("─┏┻┣┳┛╋".includes(left)) {
      char = choose("──────────────────┘┗┫┳┛╋");
    } else if ("─┓┛┫┳┻╋".includes(right)) {
      char = choose("──────────────────┏┓┣┳╋");
    }

    // Always return an object
    return { char, color: "white" };
  }

  // Keep what's already there, as an object
  return { char: last, color: "white" };
}

// Some runners prefer a default export; include both to be safe.
export default { settings, pre, main };
