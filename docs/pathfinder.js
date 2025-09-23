/**
@author Alex Miller
@title  Pathfinder
@desc   Click to spawn new path segments
*/

// Self-contained: no external imports
let prevFrame;
let width, height;

export const settings = {
  fps: 30,                  // cap framerate
  backgroundColor: "#000000",
};

// Box-drawing glyphs (UTF-8). Keep this file saved as UTF-8.
const roads = "│─┏┓┛┗┣┳┻╋";

// Utility: safe char getter from the previous frame
function get(x, y) {
  if (x < 0 || x >= width) return " ";
  if (y < 0 || y >= height) return " ";
  const v = prevFrame[y * width + x];
  if (v == null) return " ";
  // v can be either a string " " or an object {char, color}
  return typeof v === "string" ? v : v.char || " ";
}

function choose(list) {
  return list.charAt(Math.floor(Math.random() * list.length));
}

export function pre(context, cursor, buffer) {
  if (width !== context.cols || height !== context.rows) {
    const length = context.cols * context.rows;
    for (let i = 0; i < length; i++) {
      buffer[i] =
        Math.random() < 0.001
          ? { char: choose(roads), color: "white" }
          : " ";
    }
    width = context.cols;
    height = context.rows;
  }
  // Copy previous buffer so reads don't mutate the current frame
  prevFrame = [...buffer];
}

export function main(coord, context, cursor, buffer) {
  const { x, y } = coord;

  // Click to seed a new segment
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

    const top = get(x, y - 1);
    const bottom = get(x, y + 1);
    const left = get(x - 1, y);
    const right = get(x + 1, y);

    // Neighbor sets (decoded from the original):
    // top-connected neighbors
    if ("│┫┣╋┏┓┳".includes(top)) {
      char = choose("││││││││││││││││││││┻┫┣┛╋");
    }
    // bottom-connected neighbors
    else if ("│┻┗┣┫┛╋".includes(bottom)) {
      char = choose("││││││││││││││││││││┏┓┣┫┳╋");
    }
    // left-connected neighbors
    else if ("─┏┻┣┳┛╋".includes(left)) {
      char = choose("───────────────┘┗┫┳┛╋");
    }
    // right-connected neighbors
    else if ("─┓┛┫┳┻╋".includes(right)) {
      char = choose("───────────────┏┓┣┳╋");
    }

    return { char, color: "white" };
  }

  return { char: last, color: "white" };
}
