/**
@author Alex Miller
@title  Pathfinder
@desc   Click to spawn new path segments
*/

// -------- color knobs --------
const SEED_COLOR   = "#FFFFFF"; // initial seeds & click-to-seed
const GROWTH_COLOR = "#E81313"; // NEWLY ADDED cells
// -----------------------------

let prevFrame;
let width = 0, height = 0;

// Box-drawing glyphs (UTF-8)
const roads = "│─┏┓┛┗┣┳┻╋";

export const settings = {
  fps: 30,
  backgroundColor: "#000000",
};

// --- helpers ---
function getCell(x, y) {
  if (x < 0 || x >= width)  return { char: " ", color: SEED_COLOR };
  if (y < 0 || y >= height) return { char: " ", color: SEED_COLOR };
  const v = prevFrame[y * width + x];
  if (v == null) return { char: " ", color: SEED_COLOR };
  return (typeof v === "string") ? { char: v, color: SEED_COLOR } : v;
}
function getChar(x, y) { return getCell(x, y).char; }
function choose(list) { return list.charAt(Math.floor(Math.random() * list.length)); }

export function pre(context, cursor, buffer) {
  // Initialize on first run or resize
  if (width !== context.cols || height !== context.rows) {
    width = context.cols;
    height = context.rows;
    const length = width * height;

    // Fill with explicit objects so colors persist
    for (let i = 0; i < length; i++) {
      buffer[i] = { char: " ", color: SEED_COLOR };
    }

    // Seed a few visible starters (≈0.5% of cells)
    const seeds = Math.max(20, Math.floor((width * height) * 0.005));
    for (let i = 0; i < seeds; i++) {
      const idx = Math.floor(Math.random() * length);
      buffer[idx] = { char: choose(roads), color: SEED_COLOR };
    }
  }

  // Copy previous frame
  prevFrame = [...buffer];
}

export function main(coord, context, cursor, buffer) {
  const { x, y } = coord;

  // Click to plant a seed (seed color)
  if (
    cursor.pressed &&
    Math.floor(cursor.x) === x &&
    Math.floor(cursor.y) === y &&
    getChar(x, y) === " "
  ) {
    return { char: choose(roads), color: SEED_COLOR };
  }

  const lastChar = getChar(x, y);

  // Empty cell: potentially GROW into it using neighbor rules
  if (lastChar === " ") {
    const top    = getChar(x, y - 1);
    const bottom = getChar(x, y + 1);
    const left   = getChar(x - 1, y);
    const right  = getChar(x + 1, y);

    let char = " ";

    if ("│┫┣╋┏┓┳".includes(top)) {
      char = choose("││││││││││││││││││││┻┫┣┛╋");
    } else if ("│┻┗┣┫┛╋".includes(bottom)) {
      char = choose("││││││││││││││││││││┏┓┣┫┳╋");
    } else if ("─┏┻┣┳┛╋".includes(left)) {
      char = choose("──────────────────┘┗┫┳┛╋");
    } else if ("─┓┛┫┳┻╋".includes(right)) {
      char = choose("──────────────────┏┓┣┳╋");
    }

    // If we added a new char, color it as NEW GROWTH
    if (char !== " ") return { char, color: GROWTH_COLOR };

    // Otherwise leave empty
    return { char: " ", color: SEED_COLOR };
  }

  // Non-empty: keep what was there (preserve original color)
  const prev = getCell(x, y);
  return { char: prev.char, color: prev.color };
}

// Default export for safety (some runners expect it)
export default { settings, pre, main };
