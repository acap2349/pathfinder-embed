/**
@author Alex Miller
@title  Pathfinder
@desc   Click to spawn new path segments
*/

// Self-contained (no external imports)
let prevFrame;
let width, height;

const roads = "│─┏┓┛┗┣┳┻╋";

export const settings = {
  fps: 30,
  backgroundColor: "#000000",
};

function choose(list) {
  return list.charAt(Math.floor(Math.random() * list.length));
}

function get(x, y) {
  if (x < 0 || x >= width) return " ";
  if (y < 0 || y >= height) return " ";
  const v = prevFrame[y * width + x];
  // cells can be " " or {char,color}
  return typeof v === "string" ? v : (v && v.char) ? v.char : " ";
}

export function pre(context, cursor, buffer) {
  // seed once or on resize
  if (width !== context.cols || height !== context.rows) {
    width = context.cols;
    height = context.rows;
    const length = width * height;
    for (let i = 0; i < length; i++) {
      buffer[i] =
        Math.random() < 0.01 // 1% seeds so it’s visible immediately
          ? { char: choose(roads), color: "white" }
          : " ";
    }
  }
  prevFrame = [...buffer];
}

export function main(coord, context, cursor, buffer) {
  const { x, y } = coord;

  // Click to plant a new seed
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

    // grow from neighbors
    if ("│┫┣╋┏┓┳".includes(top)) {
      char = choose("││││││││││││││││││││┻┫┣┛╋");
    } else if ("│┻┗┣┫┛╋".includes(bottom)) {
      char = choose("││││││││││││││││││││┏┓┣┫┳╋");
    } else if ("─┏┻┣┳┛╋".includes(left)) {
      char = choose("──────────────────┘┗┫┳┛╋");
    } else if ("─┓┛┫┳┻╋".includes(right)) {
      char = choose("──────────────────┏┓┣┳╋");
    }

    if (char !== " ") return { char, color: "white" };
  }

  // keep what's already there
  if (last !== " ") return { char: last, color: "white" };

  // otherwise leave empty
  return " ";
}

// Also export default (some runners expect a default)
export default { settings, pre, main };
