/**
@author Alex Miller
@title  Pathfinder
@desc   Click to spawn new path segments
*/

// No external imports — everything is self-contained for GitHub Pages.

let prevFrame;
let width, height;

export const settings = {
  fps: 30,                 // cap framerate
  backgroundColor: "#000000", // page background
};

// NOTE: These box-drawing characters may look odd in some editors due to encoding,
// but they work fine when served as UTF-8.
const roads = 'â”ƒâ”â”â”“â”—â”›â”£â”«â”³â”»â•‹';

export function pre(context, cursor, buffer) {
  if (width !== context.cols || height !== context.rows) {
    const length = context.cols * context.rows;
    for (let i = 0; i < length; i++) {
      buffer[i] = Math.random() < 0.001
        ? { char: choose(roads), color: "white" }
        : " ";
    }
    width = context.cols;
    height = context.rows;
  }
  // Copy previous frame so reads don’t mutate the current buffer
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

    if ("â”ƒâ”«â”£â•‹â”â”“â”³".includes(top)) {
      char = choose("â”ƒ".repeat(20) + "â”—â”«â”£â”»â•‹");
    } else if ("â”ƒâ”—â”›â”£â”«â”»â•‹".includes(bottom)) {
      char = choose("â”ƒ".repeat(20) + "â”â”“â”£â”«â”³â•‹");
    } else if ("â”â”â”—â”£â”³â”»â•‹".includes(left)) {
      char = choose("â”".repeat(20) + "â”“â”›â”«â”³â”»â•‹");
    } else if ("â”â”“â”›â”«â”³â”»â•‹".includes(right)) {
      char = choose("â”".repeat(20) + "â”â”—â”£â”³â”»â•‹");
    }

    return { char, color: "white" };
  }

  return { char: last, color: "white" };
}

function choose(list) {
  return list.charAt(Math.floor(Math.random() * list.length));
}

function get(x, y) {
  if (x < 0 || x >= width) return 0;
  if (y < 0 || y >= height) return 0;
  const index = y * width + x;
  return prevFrame[index].char;
}
