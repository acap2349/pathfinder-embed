/**
@author Alex Miller
@title  Pathfinder
@desc   Click to spawn new path segments
*/

import { dist, sub } from '/src/modules/vec2.js'
import * as v2 from '/src/modules/vec2.js'

const vec2 = v2.vec2

let prevFrame;
let width, height;

const colors = [
	'red',
	'orange',
	'yellow',
	'green',
	'blue',
	'indigo',
	'violet'
];

export const settings = {
	fps             : 30,    // fps capping
	backgroundColor : '#000000',    // background color of the container element
}

const roads = 'â”ƒâ”â”â”“â”—â”›â”£â”«â”³â”»â•‹';

export function pre(context, cursor, buffer) {
	if (width != context.cols || height != context.rows) {
		const length = context.cols * context.rows
		for (let i = 0; i < length; i++) {
			buffer[i] = Math.random() < 0.001 ? {
				char: choose(roads),
				color: 'white'
			} : ' ';
        }
		width = context.cols;
		height = context.rows;
	}

	// Use the spread operator to copy the previous frame
	// You must make a copy, otherwise `prevFrame` will be updated prematurely
	prevFrame = [...buffer];
}

function choose(list) {
	return list.charAt(Math.floor(Math.random() * list.length))
}

export function main(coord, context, cursor, buffer) {
	const {x, y} = coord;
	if (cursor.pressed &&
			Math.floor(cursor.x) == x &&
			Math.floor(cursor.y) == y &&
	        get(x, y) == ' ') {
		return {
			char: choose(roads),
			color: 'white'
		};
	}

	const last = get(x, y);

	// 'â”ƒ â” â” â”“ â”— â”› â”£ â”« â”³ â”» â•‹';

	if (last == ' ') {
		let char = ' '

		const top = get(x, y - 1);
		const bottom = get(x, y + 1);
		const left = get(x - 1, y);
		const right = get(x + 1, y);


		if ('â”ƒâ”«â”£â•‹â”â”“â”³'.includes(top)) {
			char = choose('â”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”—â”«â”£â”»â•‹');
		} else if ('â”ƒâ”—â”›â”£â”«â”»â•‹'.includes(bottom)) {
			char = choose('â”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”ƒâ”â”“â”£â”«â”³â•‹');
		} else if ('â”â”â”—â”£â”³â”»â•‹'.includes(left)) {
			char = choose('â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”“â”›â”«â”³â”»â•‹');
		} else if ('â”â”“â”›â”«â”³â”»â•‹'.includes(right)) {
			char = choose('â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”—â”£â”³â”»â•‹');
		}

		return {
			char,
			color: 'white'
		};
	}

	return {
		char: last,
		color: 'white'
	};
}


function get(x, y) {
	if (x < 0 || x >= width) return 0;
	if (y < 0 || y >= height) return 0;
	const index = y * width + x;
	return prevFrame[index].char;
}
